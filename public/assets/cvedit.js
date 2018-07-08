/**
 * 在线简历简历前端交互操作
 */
var cvmutual = cvmutual || {};
cvmutual.main = cvmutual.main || {};   
cvmutual.info={
	vipMessages:{},
	resume_type : "文档"
};
cvmutual.tips_show = true;//贴士展示

cvmutual.main = {
 	init_:function(){// 初始化
		// 事件初始化
		cvmutual.main.event_();
		// 模态框模块
		cvmutual.main.resume_modal();	
		// 浏览器版本
		cvmutual.main.resume_browser();
		// 简历分页
		cvmutual.main.resume_page();
		// 删除模块
		cvmutual.main.resume_delete();
		// 隐藏模块
		cvmutual.main.resume_hidden();	
		// 自动完成
		cvmutual.main.reusme_autocompleter();
		// 风格设置更换简繁体
		cvmutual.main.set_fgsz_t2s();
		// 操作历史li显示隐藏
		cvmutual.main.set_czls_li($(".czls-con .hd"));	
		// 模块管理显示隐藏
		cvmutual.main.set_mkgl_showhide();
		// 创建自定义模块
		cvmutual.main.create_customItem();
		// 创建带时间模块
		cvmutual.main.create_timeItem_content();	
		// 更换图标
		//cvmutual.main.set_resume_icon();
		// 时间工具
		cvmutual.main.set_timeItem_time();
		// 简历封面
		cvmutual.main.set_coverItem();	
		// 添加作品集
		cvmutual.main.add_workItem_list();
		// 编辑作品集
		cvmutual.main.edit_workItem_list();
		// 职业技能
		cvmutual.main.set_skillItem();
		// 兴趣爱好
		cvmutual.main.set_hobbyItem();
		// 拖动调用
		cvmutual.main.set_baseItem_sortable();	
		// 添加hover删除编辑
		cvmutual.main.create_workItem_hover();
		// 实时更新
		// cvmutual.main.set_liveupdate();
		// 富文本编辑器
		cvmutual.main.set_resume_editor();
		// 图片上传工具
		cvmutual.main.set_headItem_img($(".headimg-content .cropper img"),$("#inputHeadImage"));	
		cvmutual.main.set_workItem_img();
		// 个人信息弹框 & 交互
		cvmutual.main.set_infoItem();
		// 求职意向弹框 & 交互
		cvmutual.main.set_inteItem();
		// 自定义 select 控件 & 选择城市控件
        cvmutual.main.set_selectControl();
        // 复制到剪贴板
        cvmutual.main.set_copyToClipBoard();
        // 作品集弹框
        cvmutual.main.set_portfolioModal();
        // 建议案例弹框
        // cvmutual.main.set_reCommentCase();
        // 切换英文简历
		cvmutual.main.set_changLanguage();
		// 获取唯一ID
		cvmutual.main.makeId();
		// 同步数据到基本信息弹框
		cvmutual.main.get_infoToModal();
		// 同步数据到求职弹框
		cvmutual.main.get_jobToModal();
		// 同步数据到技能弹框
		cvmutual.main.get_skillToModal();
		// 同步数据到兴趣弹框
		cvmutual.main.get_hobbyToModal();
		// 简历分享
		cvmutual.main.resume_share();
		// 跟换模板
		cvmutual.main.resume_select_template();
		// 下载
		cvmutual.main.resume_download();
		// 内容模板数据放入localstroage
		cvmutual.main.content_data_put_local_stroage();
		// 小贴士事件
        cvmutual.main.tips_event();
        // 更换模块样式
        cvmutual.main.change_style();
        // 更换头像尺寸
        cvmutual.main.change_head_size();
        // 简历诊断
        cvmutual.main.resume_diagnose();
        
	},	
	event_:function(){// 事件
		//10分钟保存一次历史记录1000*60*10
		window.setInterval(save_history,1000*60*10); 
		function save_history(){ 
			if (window.localStorage && cvresume.localStorage) {
				cvresume.main.resume_save_history();
			}
		}
        $(document).on("click","#importResumeBtn:not(.wbd-vip-lock)",function(){
    		$("#importRModal").modal("show");
    	});
        $(document).on("click", ".case_bar", function(){
        	if($("#case-modal").empty()){
        		var itemid=$(this).attr("itemid");
            	$.get("/cvresume/cases/",{"itemid":itemid,"resumeId":cvresume.info.resumeid},function(result){
            		$("#case-modal").append(result);
            		common.main.resume_cases_event();
            	});
        	}
			$("#case-modal").modal("show");
			$("#case-modal").css({"background":"none"})
        });
		// 分页
		$(document).on("click",".wbdCv-resume .moduleItem", function() {			
			cvmutual.main.resume_page();
		});		
        //作品展示删除input
        $(".portfolio-tips a").click(function(){
            $(".portfolio-tips input").val("").focus();
        });
		$(".baseItem .dd-title span div[contenteditable]").keydown( function(e) {
		    var key = window.event?e.keyCode:e.which;
		    if(key.toString() == "13"){
		    	layer.msg("此处不可以使用回车键");
		        return false;
		    }
		});	
		function stopkeypress(){
			return false;
		}
		$(".wbdCv-baseStyle .module_item_title,.wbdCv-baseStyle .baseItem .dd-title span div").on('input',function(){
			var size=30;
			if(cvresume.info.language=="en"){
				size=100;
			}
			if($(this).text().length>=size){
				layer.msg("你输入的字数不能超过"+size);
				$(this).on('keypress',stopkeypress);
				var $text = $(this).text().substring(0,size);
				$(this).text($text);
			}else{
				$(this).off('keypress',stopkeypress);
			}
		});
		$(".wbdCv-cover .coverItem div[contenteditable]").on('input',function(){
		    var _content = '';
            $(".wbdCv-cover .coverItem div[contenteditable]").each(function(){
                _content += $(this).text()
            });
            if(_content.length > 499){
                layer.msg("你输入的字数不能超过500");
                $(this).on('keypress',stopkeypress);
            }else{
                $(this).off('keypress',stopkeypress);
            }
        });
		//会员升级
		$(document).on("click","a.huiyuan-upload",function(){
			$("#upvip_tips").html($(this).attr("data_tips"));
			$("#upvipModal").modal("show");
		});
		//初始化状态		
		$(document).ready(function(){ 
			// 遍历风格设置状态
			$(".wbdCv-baseStyle").each(function(){
                var _data_color = $(this).attr("data_color"),
                    _data_font_name = $(this).attr("data_font_name"),
                    _data_font_size = $(this).attr("data_font_size"),
                    _data_line_height = $(this).attr("data_line_height"),
                    _data_font_type = $(this).attr("data_font_type"),
                    _data_modal_margin = $(this).attr("data-modal_margin");
                if($(this).attr("data_color") ==""){
                    $('.fgsz-color ul li[data-style="j1"]').addClass("checked");
                }else{
                    $(".fgsz-color ul li[data-style='"+_data_color+"']").addClass("checked").siblings().removeClass("checked");
                }
                if($(this).attr("data_font_name") ==""){
                    $("#myselect-family").val("微软雅黑");
                    $("#select-font-family").text("微软雅黑");
                }else{
                    var $font_name = $(" #setFontfamily li[data-fontname = "+_data_font_name+"]").text();
                    $("#myselect-family").val($font_name);
                    $("#select-font-family").text($font_name);
                }
                if($(this).attr("data_font_size") ==""){
                    $("#myselect-family").val("14");
                    $("#select-font-family").text("14");
                }else{
                    var $font_size = $(" #setFontsize li[data_font_size = "+_data_font_size+"]").text();
                    $("#myselect-size").val($font_size);
                    $("#select-font-size").text($font_size);
                }
                if($(this).attr("data_line_height") ==""){
                    $("#lineh_amount").val("1.5");
                }else{
                    $("#lineh_amount").val(_data_line_height);
                    var a = (_data_line_height-0)/(0.1)*(1/30).toFixed(4) ;
                    var left = a*100+"%" ;
                    $("#lineh_slider .ui-slider-handle").css("left",left)
                }
                if(undefined != $(this).attr("data-modal_margin") && $(this).attr("data-modal_margin") == ""){
                    $("#margin_amount").val("1")
                }else if(undefined != $(this).attr("data-modal_margin") && $(this).attr("data-modal_margin") != ""){
                    $("#margin_amount").val(_data_modal_margin);
                    var a = (_data_modal_margin - 0)/(0.2)*(1/8).toFixed(4);
                    var left = a*100 + "%";
                    $("#margin_slider .ui-slider-handle").css("left",left)
                }
                if(_data_font_type =="0"){
                    $('.fgsz-jft #jian').addClass("checked").siblings().removeClass("checked");
                }else{
                    $('.fgsz-jft #fan').addClass("checked").siblings().removeClass("checked");
                }
			});
			// 遍历标题状态
			$(".moduleItem dl dt").each(function(){
				var $this = $(this).parents("dl").siblings().find(".hiddenTitle s")
			　 	if($(this).hasClass("hidden")){
					$this.addClass("checked");
					$this.prev("i").text("显示栏目标题");
				}
				if($this.hasClass("checked")){
					$this.parent().siblings(".changeTitle").addClass("hidden");
				}			
			}); 
			// 遍历时间模块状态
			$(".moduleItem dl dd .dd-title").each(function(){
				var $this = $(this).parents("dl").siblings().find(".hiddenTime s");
			　 if($(this).hasClass("hidden")){
					$this.addClass("checked");
                  $this.prev("i").text("显示时间模块")
				}
				if($this.hasClass("checked")){
					$this.parent().siblings(".hiddenText").addClass("hidden");
				}		
			});
			// 遍历描述模块状态
			$(".moduleItem dl dd .dd-text").each(function(){
				var $this = $(this).parents("dl").siblings().find(".hiddenText s");
			　 if($(this).hasClass("hidden")){
					$this.addClass("checked");
					$this.prev("i").text("显示描述模块")
				}
				if($this.hasClass("checked")){
					$this.parent().siblings(".hiddenTime").addClass("hidden");
				}			
			});

			// 遍历是否有hidden,隐藏模块
			$(".baseItem,.wbdCv-cover,.wbdCv-letter,.contactItem,.headItem,.infoItem").each(function(){
				var $forid = $(this).attr("id");
				if($(this).hasClass("hidden")){
					$(this).find($forid);
					var $hideitem = $("#showul").find($("a[for-id ='"+$forid+"']")).parent("li");
					var $hidecon = $("#hideul li:last");
					$("#showul").find($("a[for-id ='"+$forid+"']")).attr("title","显示此模块");
					$hidecon.after($hideitem);	
				}
				var $title = $("div[id ='"+$forid+"']").find("dl dt div").text();
				$(".r-itembar ul li").find($("a[for-id ='"+$forid+"']")).siblings(".name").text($title);
			});
			// 遍历自定义模块
			$(".customItem").each(function(){
				var $forid = $(this).attr("id");
				var $title = $("div[id ='"+$forid+"']").find("dl dt div").text();
				var $customtitle = $("#showul li.grzp").clone();
				$customtitle.find("a").attr("title","删除此模块");
				$customtitle.find("span").attr("data-placeholder","自定义模块");
				$customtitle.find("a").attr("for-id",$forid);
				$customtitle.removeClass("grzp");
				$customtitle.addClass("custom-li");
				$customtitle.find(".name").text($title);
				$customtitle.insertAfter($("#showul li:last-child"));				
			});
		});
		// 作品灯箱效果
		$('.workItem .work-img .work-img-inner').fancybox();
		// 当前编辑模块状态效果
		var curr_html = '<div class="curr_bg" style="display:none"></div>'
		$(curr_html).appendTo($("body"));
		$(document).on("click",".bInfoItem dl,.baseItem dl",function(){	
			$(".curr_bg").stop().show();
			$(this).parent().addClass("current").siblings().removeClass("current");			
		});	
		$(document).on("click",".curr_bg",function(){
			$(this).stop().hide();
			$(".moduleItem,.nameItem").removeClass("current");
			$(".litemodal").css('left','-240px');
			// 单独写隐藏更换模板弹框
			$(".litemodal.change_template").css("left","-344px");
            // 失去编辑状态隐藏富文本编辑器
            $("#textExecCommand").css("display","none");
            $(".foreColor").removeClass("open");
            $(".foreColor_list").hide();
            cvmutual.main.resume_page();
		});			
		// 左侧栏
		// 滑块设置段距高
	    $( "#lineh_slider" ).slider({
	      value:1,
	      min: 0,
	      max: 3,
	      step: 0.1,
	      slide: function( event, ui ) {
	        $( "#lineh_amount" ).val(ui.value);
			cvmutual.main.set_fgsz_lineheight(ui.value);    
	      },
	      change:function(event,ui){
	      	cvresume.main.delay_resume_save();
	      	common.main._500dtongji("PC-在线制作-风格设置功能（"+cvmutual.info.resume_type+"编辑）-段距调整-段距调整-调整到某段距");
	      }
	    });
        // 滑块设置块距
		$("#margin_slider").slider({
            value:1,
            min: 0,
            max: 1.6,
            step: 0.2,
            slide: function( event, ui ) {
                $( "#margin_amount" ).val(ui.value);
                cvmutual.main.set_fgsz_margin(ui.value);
            },
            change:function(event,ui){
                cvresume.main.delay_resume_save();
                common.main._500dtongji("PC-在线制作-风格设置功能（"+cvmutual.info.resume_type+"编辑）-模块距离调整-模块距离调整-调整到某间距");
            }
		});
		// 选择字体下拉列表
		$(".select-box.family").click(function(){
			var thisinput=$(this);
			var thisul=$(this).parent().find("ul");
			if(thisul.css("display")=="none"){
			  if(thisul.height()>120){thisul.css({height:"120"+"px","overflow-y":"scroll" })};
			  thisul.fadeIn("100");
			  thisul.hover(function(){},function(){thisul.fadeOut("100");})
			  thisul.find("li").click(function(){
			  	$("#myselect-family").val($(this).text());
			  	$("#select-font-family").text($(this).text());
			  	thisul.fadeOut("100");
			  });
			  }
			else{
			  thisul.fadeOut("fast");
			}
		});			
		$(".select-box.size").click(function(){
			var thisinput=$(this);
			var thisul=$(this).parent().find("ul");
			if(thisul.css("display")=="none"){
			  if(thisul.height()>120){thisul.css({height:"120"+"px","overflow-y":"scroll" })};
			  thisul.fadeIn("100");
			  thisul.hover(function(){},function(){thisul.fadeOut("100");})
			  thisul.find("li").click(function(){
			  	$("#myselect-size").val($(this).text());
			  	$("#select-font-size").text($(this).text());
			  	thisul.fadeOut("100");
			  });
			  }
			else{
			  thisul.fadeOut("fast");
			}
		});	
		// 统一格式
		$(".fgsz-unified p").on("click",function(){
			$("#setStyleModal").css('left','-240px');
			var title = "确定要统一简历内容格式吗？";
			var content = "统一后内容排版和文字大小及颜色可能发生变化。";
			cvmutual.main.resume_confirm({
				title:title,
				content:content,
				onOk:function(){
					$('.unify_masking').show ().delay (1000).fadeOut ();
					$('.unify_loading').show ().delay (1000).fadeOut ();
					setTimeout(unify_resume,1500)
				},
				onCancel:function(){
					$("#setStyleModal").css('left','0');
				}
			});
			return false;
		})
		
		function unify_resume() {
			common.main._500dtongji("PC-CV6.7.0-在线制作-简历编辑页-左侧功能区-中间-风格设置-统一格式");
			var length=  $(".resume_content").length
			$(".resume_content").each(function(){
				var _str= $(this).text()
				var $this = $(this)
				$this.empty()
				$this.html(_str)
			})
			cvresume.main.delay_resume_save();
		}
		
		// 更换主题
		$(document).on("click",".fgsz-color ul li",function(){
			$this = $(this);
			$this.addClass("checked").siblings().removeClass("checked");
			name = String($this.attr("data-style"));
			cvmutual.main.set_fgsz_theme(name);
		});	    
		// 更换字体
		$(document).on("click","#setFontfamily li",function(){
			$this = $(this);
			name = String($this.attr("data-fontname"));
			cvmutual.main.set_fgsz_fontfamily(name);			
		});			
		$(document).on("click","#setFontsize li",function(){
			$this = $(this);
			name = String($this.attr("data_font_size"));
			cvmutual.main.set_fgsz_fontsize(name);			
		});	
      	// 更换简繁体
      	$(document).on("click",".fgsz-jft button",function(){
      		if($(this).attr("id") == "jian"){
      			name = 0;
      			cvmutual.main.set_fgsz_fonttype(name);
      		}
       		if($(this).attr("id") == "fan"){
      			name = 1;
      			cvmutual.main.set_fgsz_fonttype(name);
      		}     		
      	})
      	
		// 设置操作历史列显示隐藏
		$(document).on("click",".czls-con ul li .hd",function(){
			cvmutual.main.set_czls_li($(this),$(".bd"));	
		}); 
		
		// 右侧栏
		//在线编辑 6.2.0 隐私设置
		$(".resume_authority_modal .authority_list").click(function(){
            $(this).addClass("checked").siblings().removeClass("checked");
            $(".resume_access_authority .authority_tips").text('"' +$(this).find(".authority_title").text() + '"')
			if($(this).index() != 1){
                $("#resume_authority_modal").modal("hide");
			}
		});
    	// 编辑区域工具(拖动设置添加工具，上下移动删除子模块工具)
			
		// 向上移动子模块
		$(document).on('click',".timeItem .move-downup .up",function(){
			var $this = $(this).parents(".move-downup").parents(".dd-content");
			cvmutual.main.set_timeItem_moveup($this);
		});
		// 向下移动子模块
		$(document).on('click',".timeItem .move-downup .down",function(){
			var $this = $(this).parents(".move-downup").parents(".dd-content");
			cvmutual.main.set_timeItem_movedown($this);
		});		
		// 向上移动子模块
		$(document).on('click',".recomentItem .move-downup .up",function(){
			var $this = $(this).parents(".move-downup").parents(".recoment-list");
			cvmutual.main.set_timeItem_moveup($this);
		});
		// 向下移动子模块
		$(document).on('click',".recomentItem .move-downup .down",function(){
			var $this = $(this).parents(".move-downup").parents(".recoment-list");
			cvmutual.main.set_timeItem_movedown($this);
			
		});	    
		
		// 设置 开关状态
		$(document).on("click",".set .set-list",function(){
		    if($(this).hasClass("recovery_style")){
		        return null
                // 兼容恢复样式
            }else{
                var $this = $(this).children("s"), text = $(this).children("i").text().substr(2);
                if($this.hasClass("checked")){
                    $this.removeClass("checked");
                    $(this).children("i").text("隐藏"+text);
                }else{
                    $this.addClass("checked");
                    $(this).children("i").not(".noChange").text("显示"+text);
                }
            }
		});		
		// 隐藏标题栏目
		$(document).on("click",".set .hiddenTitle",function(){
			var $this = $(this).parents(".baseItem-toolbar").siblings("dl").children("dt");
			var $thischangeTitle = $(this).siblings(".set .changeTitle");
			if($(this).children("s").hasClass("checked")){			
				$this.addClass("hidden");
				$thischangeTitle.addClass("hidden");
			}else{
				$this.removeClass("hidden");
				$thischangeTitle.removeClass("hidden");
			}
		});
		// 隐藏时间栏目
		$(document).on("click",".set .hiddenTime",function(){
			var $this = $(this).parents(".baseItem-toolbar").siblings("dl").find(".dd-title");
			var $thishiddenText = $(this).siblings(".set .hiddenText");
			if($(this).children("s").hasClass("checked")){
				$this.addClass("hidden");
				$thishiddenText.addClass("hidden");
			}else{
				$this.removeClass("hidden");
				$thishiddenText.removeClass("hidden");
			}
		});
		// 隐藏描述栏目
		$(document).on("click",".set .hiddenText",function(){
			var $this = $(this).parents(".baseItem-toolbar").siblings("dl").find(".dd-text");
			var $thishiddenTime = $(this).siblings(".set .hiddenTime");
			if($(this).children("s").hasClass("checked")){
				$this.addClass("hidden");
				$thishiddenTime.addClass("hidden");
			}else{
				$this.removeClass("hidden");
				$thishiddenTime.removeClass("hidden");
			}
		});
		// 编辑标题栏目(6.5 修改)
		$(document).on("click",".wbdCv-baseStyle .baseItem dt div",function(){

		    var $this = $(this), $id = $this.parents(".baseItem").attr("id");
			// var $this = $(this).parents(".baseItem-toolbar").siblings("dl").children("dt").find("div");
			// var $id = $(this).parents(".baseItem-toolbar").parents(".baseItem").attr("id");
			// $(".baseItem-toolbar .set .set-con").css({"height":"0px","overflow":"hidden","transition":"all 0.3s"});
			$this.attr("contentEditable",true).focus();
			// $("div[id ='"+$id+"']").find("dl dt div").focusout(function(){
            $this.focusout(function(){
				// var $title = $("div[id ='"+$id+"']").find("dl dt div").text();
				var $title = $this.text();
			   $("#showul").find($("a[for-id ='"+$id+"']")).siblings(".name").text($title);
			});
		});
		$(".wbdCv-baseStyle .baseItem dt div").keydown( function(e) {
            var key = window.event?e.keyCode:e.which;
            if(key == 13){
                layer.msg("此处不可以使用回车键");
                event.cancelBubble=true;
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });
        $(document).on("mouseleave",".baseItem-toolbar",function(){
			$(this).find(".set-con").css({"height":"0px","overflow":"hidden","transition":"all 0.3"});
		});	
		$(document).on("focusout",".baseItem dl dt div[contenteditable]",function(){
			$(".baseItem dl dt div[contenteditable]").attr('contenteditable','false');
		});	
		// 设置下拉展示效果
		$(document).on("mousedown",".baseItem-toolbar .set",function(){
			$(this).find(".set-con").css({"height":"auto","overflow":"visible","transition":"all 0.3s"});	
		});			
		// 底部预览提示框
		$(".bottom-modal span.close").click(function(){
			$(this).parents(".bottom-modal").css('bottom','-150px');
		});
		//模块标题打点统计
		$(document).on("click",".preItem500dtongji",function(){
			var id=$(this).closest(".moduleItem").attr("id");
			var id_str=$("#resume_modal_manager ul li a[for-id="+id+"]").siblings("span").attr("data-placeholder");
			//正常的流程是到右侧菜单栏的模块管理中对应的菜单栏去那埋点的数据的
			if(id == "resume_name"){
				id_str="基本信息（名字）";
			}else if(id == "base_info"){
				id_str="基本信息（其他）";
			}
			var data_track=$(this).attr("data_track");
			//判断是否是自定义
			if($(this).closest(".moduleItem").hasClass("customItem")){
				if($(this).closest(".moduleItem").hasClass("timeItem")){
					data_track=data_track.replace("{0}","自定义（时间）");
				}else{
					data_track=data_track.replace("{0}","自定义（描述）");
				}
			}else{
				data_track=data_track.replace("{0}",id_str);
			}
			common.main._500dtongji(data_track);
		});
		//判断简历类型
    	if($(".wbdCv-container").hasClass("mobile")){
    		cvmutual.info.resume_type="手机";
    	}

    	// 显示隐藏评分说明弹框
        $(".resume_power .resume_power_explain").on("mouseover",function(){
            $(".wbdCv-toolbars .explain_modal").show();
        });
        $(".wbdCv-toolbars .explain_modal").hover(function(){},function(){$(this).hide();});
        //  同步简历名称到头部命名框
        if(!common.main.is_empty($("#resumeName").find("input").val())){
            $(".set_resume_name input[name=resume_name]").val($("#resumeName").find("input").val());
        }
        // 初始化简历投递弹框方法
        common.main.send_resume();
        //案例弹框关闭
        $(document).on("click","#case-modal .close",function(){
        	common.main._500dtongji("PC-CV6.7.0-在线制作-案例库弹窗页-顶部-右上-关闭");
			$(".modal-backdrop").remove()
			$(".defaultmodal.case_modal .modal-content").css({"animation": "close_slow 0.5s ease forwards"})
			setTimeout(function(){
				$("#case-modal").modal("hide");
			},800); 
    	});
	},
	resume_share:function(){// 简历分享
		$("#recommend-modal #recommendUrl").on('click',function(){
            var str = $("#recommend-modal .recommendContent span").html();
            cvmutual.main.set_copyToClipBoard(str);
            $("#recommendUrl").html("复制成功")
        });
        // 分享
        $("#share_btn").click(function(){
        	var visitid=cvresume.info.visitid;
        	if(cvresume.main.is_empty(visitid)){
        		layer.msg("亲，保存简历才可以分享简历哦~");
        		return false;
        	}
        	$(".shareContent input").val(visitid);
        	$("#shareResume-modal").modal("show");
        });
        $("#shareResume-modal #copyUrl").on("click",function(){
        	 var str = $(".shareContent span").html() + $(".shareContent input").val()+"/";
        	 cvmutual.main.set_copyToClipBoard(str);
             $("#copyUrl").html("复制成功");
             setTimeout(function(){
                 $("#copyUrl").html("复制链接")
             },2000);
        });
	},
	resume_select_template:function(){
        function reload_template_list(){
            var current_resume_type=$("#current_resume_type").val();
            var current_resume_bank_type=$("#current_resume_bank_type").val();
            $.get("/cvresume/select_template/",{"type":current_resume_type,"resumeBankType":current_resume_bank_type,"pageNumber":select_template_page},function(result){
                if(result!=null&&""!=result.trim()){
                	$(result).appendTo($(".change_template .resume_template"));
                    loading_template = false;
                }else{
                    layer.msg("没有更多了");
                    $("#loadingBtn").hide();
                }
            });
        }
		 var select_template_page=1;  //页码
		 var tagId, loading_template = false;
		$(document).on('click',"#change_temlate_btn:not(.wbd-vip-lock)",function(e){
			// 1判断是否存在模板节点
			if($("#changeResumeModal .template_masking").length<=0){
				// 无节点，发送ajax请求渲染回ul
				reload_template_list();
			}
            $("#changeResumeModal").css("left","0");
            $(document).on("click",cvmutual.main.modail_listener);
			cvmutual.main.close_tips_event();
			e.stopPropagation();
		});
        // 模板项点击跳转
		$(document).on("click","#changeResumeModal .select_template",function(){
			common.main.resumeOperationLogUpload(cvresume.info.resumeid,"changemoban","","");//日志上报
			var id=$(this).attr("data-itemid");
			location.href="/cvresume/edit/?itemid="+id+"&resumeId="+cvresume.info.resumeid+"&language="+cvresume.info.language;
		});
	},
	resume_modal:function(){//modal模态框调用
		//调用图标库弹框
		$(document).on("click",".wbdCv-baseStyle a.wbdfont",function(){
			var $this=$(this);
			var optName="";
			if($this.closest(".moduleItem").attr("id")=="resume_hobby"){
				optName="更换兴趣爱好图标升级";
				common.main._500dtongji("PC-在线制作-"+cvmutual.info.resume_type+"编辑页-中间简历编辑-兴趣爱好-更换图标(all)");
			}else{
				optName="更换模块图标升级";
				common.main._500dtongji("PC-在线制作-"+cvmutual.info.resume_type+"编辑页-中间简历编辑-通用-点击模块图标(all)");
			}
			if($("#importResumeBtn").hasClass("wbd-vip-lock")){
				//获取权限消息
				$.ajax({
					async:false,
					type:"GET",
					data:{"opt":"icon"},
					url:"/cvresume/validate_opt_auth/",
					success:function(message){
						if(message.type=="warn"){
							var tips=JSON.parse(message.content);
							common.main.vip_opt_tips(tips.message,tips.vipRank,optName);
						}else if(message.type=="error"){
							layer.msg(message.content);
							return false;
						}
					}
				});
				return;
			}
			$(".wbdCv-baseStyle a.wbdfont").removeClass("checked");
			$("#IconModal").modal("show");
			$(this).addClass("checked");
			cvmutual.main.set_resume_icon();
			if($("#resume_icon_list li").length==0){
				icon_list();
			}else{
				$("#resume_icon_list li").css('display','block')
			};
		});
		$("#icon_search_value").keyup(function(){
             $("#resume_icon_list li").remove();
			 var name =$("#icon_search_value").val();
			 if(!cvresume.main.is_empty(name)){
				$.get("/cvresume/icon/",{"name":name},function(result){
					if(result!=null&&result!=""){
						$("#resume_icon_list").append(result);
					}else{
						
					}
				})
			 }
			 if(cvresume.main.is_empty(name)){
				icon_list(); 
			 }
		});
		function icon_list(){
			 var name =$("#icon_search_value").val();
			$.get("/cvresume/icon/",{"name":name},function(result){
				if(result!=null&&result!=""){
					$("#resume_icon_list").append(result);
				}else{
					
				}
			})
		}
		// 调用操作历史弹框
		$(".czls a").click(function(e){
			$("#historyModal").css('left','0px');
            $(document).on("click",cvmutual.main.modail_listener);
            var data_value = $(this).attr("data-value");
            common.main._500dtongji("PC-CV6.7.0-在线制作-简历编辑页-左侧功能区-中间-操作历史");
            e.stopPropagation();
		});		
		// 调用风格设置弹框
		$(".fgsz a").click(function(e){
			$("#setStyleModal").css('left','0px');
			$(document).on("click",cvmutual.main.modail_listener);
			var data_value=$(this).attr("data-value");
			common.main._500dtongji("PC-在线制作-"+data_value+"-左侧设置-左侧设置-风格设置");
            e.stopPropagation();
		});	
		// 我的简历弹框
		$(".l-cvbar a").click(function(e){
			var data_value = $(this).attr("data-value");
			common.main._500dtongji("PC-在线制作-"+data_value+"-左侧设置-左侧设置-我的简历");
			$("#cvListModal").css('left','0px');
            $(document).on("click",cvmutual.main.modail_listener);
            e.stopPropagation();
			var $my_resume_list=$("#my_resume_list");
			if($my_resume_list.find("li").length<=0){
				// 查看我的简历
				$.ajax({
		             type: "GET",
		             url: "/cvresume/select_resume/",
		             success: function(result){
		            	 if(result.indexOf("li")!=-1){
		            		 $("#my_resume_list").closest("div").find(".wdjl-null").hide();
		            		 result = result.replace(/\{0}/g, cvmutual.info.resume_type);
		            		 $("#my_resume_list").append(result);
		            	}else{
		            		 $("#my_resume_list").closest("div").find(".wdjl-null").show();
		            	 }
		             }
				});
			}					  
		});
        //在线编辑6.2.0新增 模块管理弹框
        $(".modal_manager a").click(function(e){
            $("#resume_modal_manager").css("left",'0');
            $(document).on("click",cvmutual.main.modail_listener);
            var data_value = $(this).attr("data-value");
            common.main._500dtongji("PC-在线制作-"+data_value+"-左侧设置-左侧设置-模块管理");
            e.stopPropagation();
        });
		$(".litemodal .close").click(function(){
			$(".litemodal").css('left','-240px');
            // 单独写隐藏更换模板弹框
            $(".litemodal.change_template").css("left","-344px");
		});
    	//切换编辑模式
    	$(".resume_switch_style a").on('click',function(){
    		var _href = $(this).attr("data_href");
    		if(!cvresume.main.is_empty(cvresume.info.resumeid)){
    			_href += "&resumeId=" + cvresume.info.resumeid;
    		}
    		window.location.href = _href;
    	})
		// 调用推荐信邀请弹框
		$(document).on("click",".recomentItem .baseItem-toolbar .add,.recomentItem .baseItem-null,.r-yqrecomentbar a",function(){
			if(cvresume.main.is_empty(cvresume.info.resumeid)){
				layer.msg("简历未保存");
			}else{
				var url = "http://www.500d.me/recommend/send/"+cvresume.info.resumeid+"/";
				$("#recommend-modal .recommendContent").find("span").text(url);
				$("#recommend-modal").modal("show");
			}
		});
		//调用访问权限弹框
		$(".resume_access_authority a").click(function(){
			$("#resume_authority_modal").modal("show")
		})
		// 所有人权限弹框
		$(".view-select #syr").click(function(){
		     $("#accessPassword-modal").find(".successPanel").show().find("h6").text("已设置权限为所有人可访问");
			 $("#accessPassword-modal").modal("show");
		});
		// 调用支付选择弹框
		$(".payBtn").click(function(){
			$("#payModal").modal("show");
		});	
		// 调用更换头像弹框
		$(".headItem .head-con").click(function(){
			if($("html").hasClass("ie9")){
				alert("当前浏览器内核为ie9,无法上传图片,请更换浏览器,或切换至极速模式,体验更多功能.");
				$("#headimg-modal").modal("show");
			}else{
				$("#inputHeadImage").removeAttr("disabled");
				$("#inputHeadImage").trigger("click");
			}

		});		
		$("#inputHeadImage").change(function(){
			var $upload_file =document.getElementById("inputHeadImage").files;
			if($upload_file.length>0){
				var _upload_file_size=$upload_file[0].size/1024;
				if((_upload_file_size/1024)>5){
					layer.msg("请上传小于5M的图片");
					return;
				}
			}
			$("#headimg-modal").modal("show");
		})
		// 恢复简历提示
		$(document).on("click",".czls-con .cancel",function(){
			var $title = "确定要恢复到此版本吗？";
			var $text = "恢复之后当前版本将被替换为历史版本。";
			var $resumebanktype = $(this).attr("history-resumeBankType");
			var $historyid = $(this).attr("history-id");
			var href ="/resume/history/rollback/" + $resumebanktype+ "/" + $historyid+ "/";
			cvmutual.main.resume_confirm({
				title:$title,
				content:$text,
				onOk:function(){
					if (window.localStorage && cvresume.localStorage) {
						sessionStorage.removeItem("historyid");
	                    cvresume.main.resume_save_history();
	                }else{
	                	cvresume.info.historyid=0;
	                	cvresume.main.resume_save_history();
	                }
			      	$.ajax({type : "get",
				        cache: false,
				        async : false,
				        url : href,
				        success : function(message) {
					        if(message.type == "success"){
					        	common.main.resumeOperationLogUpload(cvresume.info.resumeid,"rollback","","回滚历史记录id为" + $historyid);//日志上报
					          	var href = "/cvresume/edit/?";
					          	var data = cvresume.main.strToJson(message.content);
					          	href+= "itemid=" + data.itemid + "&resumeId=" + data.resumeId;
					          	location.href = href;
					        }else{// 消息框
					        	layer.msg(message);
					        }
				        }
			        });
				}
			});			
			return false;
		});
		// 切换简历提示
		$(document).on("click","#cvListModal .edit",function(){
			var title = "确定要切换到其它简历吗？";
			var content = "我们将为您自动保存当前简历。";
			var href=$(this).attr("data_path");
			cvmutual.main.resume_confirm({
				title:title,
				content:content,
				onOk:function(){
					location.href=href;
				}
			});
			return false;
		});
		// 案例弹框案例弹框
		$("#case-bar").on("click",function(){
			$("#case-modal").modal("show");
			$("#case-modal").css({"background":"none"})
		})
	},	
	resume_confirm:function(options){// 系统确认性弹框
		var settings = {
				title:"操作提示标题",
				content:"操作提示内容",
				ok: "确定",
				cancel: "取消",
				onOk: null,
				onCancel: null
		};
		$.extend(settings, options);
		var $modal=$("#tips-modal")
		var $confirm_btn=$("#tips-modal").find("button.submit");
		var $cancel_btn=$("#tips-modal").find("button.cancel");
		if ($confirm_btn != null) {
			$confirm_btn.click(function() {
				if (settings.onOk && typeof settings.onOk == "function") {
					if (settings.onOk() != false) {
						tips_modal_close();
					}
				} else {
					tips_modal_close();
				}
				return false;
			});
		}
		if ($cancel_btn != null) {
			$cancel_btn.click(function() {
				if (settings.onCancel && typeof settings.onCancel == "function") {
					if (settings.onCancel() != false) {
						tips_modal_close();
					}
				} else {
					tips_modal_close();
				}
				return false;
			});
		}
		// 组装弹框内容
		$modal.find(".tips_title").text(settings.title);
		$modal.find(".tips_content").text(settings.content);
		$modal.find("button.submit").text(settings.ok);
		$modal.find("button.cancel").text(settings.cancel);
		$modal.modal("show");
		// 弹框关闭通用方法
		function tips_modal_close(){
			$modal.modal("hide");
		}
	},
	resume_browser:function(){
		var appName = navigator.appName;
		var appVersion = navigator.appVersion;
		if(appName == "Microsoft Internet Explorer") {
			var broserVersion = appVersion.match(/MSIE (\d)\.0/i);
			if(broserVersion && broserVersion.length ==2) {
				var versionNumber = broserVersion[1];
				if(versionNumber < 10) {
					$("#browserModal").modal("show");
				} else if(!localStorage || !localStorage.getItem("#browserModal"));
					$("#browserModal").modal("show");
			}
		}	
	},
	reusme_autocompleter:function(){
	    $('.eduItem .company div[contenteditable]').autocompleter({
	    	source: school,  	
	    	limit: 6,
	    	cache: true,
	        focusOpen: false,
	        highlightMatches: true,
	        template: ' <span>{{ label }}</span>'	    	
	    });			
	},
	resume_delete:function(){// 删除模块
		function resumeDelete(){
			var isContinue=true;			
			var key=$(".baseItem a.delete.selected").closest(".moduleItem").attr("id");
			if(key=="resume_recoment"){
			    // 推荐信删除
				var data_id=$(".baseItem a.delete.selected").closest(".moduleItemList").attr("data-id");
				$.ajax({
		    		 type: "POST",
		    		 async : false,
		             url: "/recommend/delete/",
		             data:{"id":data_id},
		          	 success:function(message){
		          		 if(message.type!="success"){
		          			 layer.msg(message.content);
		          			 return;
		          		 }
		          	 }
		    	})
			}else if(key == "resume_skill"){
			    //技能特长删除
				var data_id=$(".baseItem a.delete.selected").closest(".moduleItemList").attr("data-id");
				if(!cvresume.main.is_empty(data_id)){
					$.ajax({
			    		 type: "POST",
			             url: "/cvresume/module/skill/delete/",
			             data:{
			             	"id":data_id,
			             	"resumeId":cvresume.info.resumeid
			         	 },
			          	 success:function(message){}
			    	});
		    	}
			}else if(key == "resume_hobby"){
			    //兴趣爱好
				var data_id=$(".baseItem a.delete.selected").closest(".moduleItemList").attr("data-id");
				if(!cvresume.main.is_empty(data_id)){
					$.ajax({
			    		 type: "POST",
			             url: "/cvresume/module/hobby/delete/",
			             data:{
			             	"id":data_id,
			             	"resumeId":cvresume.info.resumeid
			         	 },
			          	 success:function(message){}
			    	});
		    	}
			}else if(key == "resume_edu" || key == "resume_internship" || key == "resume_work" || key == "resume_project" || key == "resume_volunteer"){
				var type="";
				if(key == "resume_edu"){
					type="edu";
				}else if(key == "resume_internship"){
					type="internship";
				}else if(key == "resume_work"){
					type="work";
				}else if(key == "resume_project"){
					type="project";
				}else if(key == "resume_volunteer"){
					type="volunteer";
				}
				if(!cvresume.main.is_empty(type)){
					var data_id=$(".baseItem a.delete.selected").closest(".moduleItemList").attr("data-id");
					if(!cvresume.main.is_empty(data_id)){
						$.ajax({
				    		 type: "POST",
				             url: "/cvresume/module/time/delete/",
				             data:{
				             	"id":data_id,
				             	"resumeId":cvresume.info.resumeid,
				             	"type":type
				         	 },
				          	 success:function(message){}
				    	});
			    	}
				}
			}
			if(!isContinue){
				return false;
			}
			$(".recomentItem .moduleItemList a.delete.selected").closest(".moduleItemList").remove();
			$(".skillItem .moduleItemList a.delete.selected").closest(".moduleItemList").remove();
			$(".hobbyItem .moduleItemList a.delete.selected").closest(".moduleItemList").remove();
			$(".workItem .moduleItemList a.delete.selected").closest(".moduleItemList").remove();
		    $(".homeItem .home-list a.delete.selected").closest(".moduleItemList").remove();
		    $(".coverItem a.delete.selected").closest(".cover-list").remove();
			$(".info-list .delete.selected").parents(".info-list").addClass("hidden").find("span").text("");
			$(".inte-list .delete.selected").parents(".inte-list").find("span").text("");
            $(".inte-list .delete.selected").parents(".inte-list").addClass("hidden");
			if($(".skillItem .skill-list").length<=0){
			 	$(".skillItem .baseItem-null").css('display','block');
			}if($(".hobbyItem .hobby-list").length<=0){
			 	$(".hobbyItem .baseItem-null").css('display','block');
			}if($(".recomentItem .recoment-list").length<=0){
				$(".recomentItem .baseItem-null").css('display','block');
			}if($(".workItem .work-list").length<=0 && $(".workItem .link-list").length<=0){
			 	$(".workItem .baseItem-null").css('display','block');
			}if($(".infoItem .info-list").hasClass("info-defind")){
                $('.defaultmodal .defindItem .add[data-value='+ $(".info-defind .delete.selected").parents(".info-defind").attr('id') +']').remove();
                $(".info-defind .delete.selected").parents(".info-defind").remove();
			}if($(".coverItem .cover-list").hasClass("cover-custom")){
	        	$(".cover-custom a.delete.selected").parents(".cover-custom").remove();
	        }if($(".homeItem .home-list").length<=0){
	        	$(".homeItem").addClass("hidden");
	        }
	        if($(".moduleItemList a.delete.selected").closest(".moduleItem").find(".moduleItemList").length==1){
	        	 layer.msg("只剩一项了不能删除了呀.");
	        } else{
	        	$(".timeItem .moduleItemList a.delete.selected").parents(".moduleItemList").remove();
	        }

	        cvmutual.main.get_infoToModal();
	        cvmutual.main.get_jobToModal();
	        cvmutual.main.get_hobbyToModal();
	        cvmutual.main.get_skillToModal()
		};
		function resumeDeleteChild(){
			$("a.delete-child.selected").parents(".dd-text").remove()
		}
		$("#delete-modal button.submit").click(function(){
			var $checked =  $("#delete-modal #checkedNotfy:checked").val();
			addCookie("delete",$checked);			
		});
		$(document).on("click","a.delete",function(){
			if($(this).hasClass("job")){
				$(".salaryItem .negotiable input[type='checkbox']").prop("checked", false);
                $(".salaryItem .monthly input,.salaryItem .daily input").attr("disabled",false);
			}
		    if($(this).parents(".set-list").length <= 0){
                $(".curr_bg").css('display','none');
                $(".moduleItem").removeClass("current");
                $("a.delete").removeClass("selected");
                $(this).addClass("selected");
                if(getCookie("delete") == undefined){
                	$("#delete-modal").modal("show");
                    $("#delete-modal button.submit").click(function(){
                        resumeDelete();
                        $("#delete-modal").modal("hide");
                        cvmutual.main.resume_page();
                    });
                }else{
                    resumeDelete();
                    cvmutual.main.resume_page();
                }
            }
		});		
		$(document).on("click","a.delete-child",function(){
			if($(this).hasClass("job")){
				$(".salaryItem .negotiable input[type='checkbox']").prop("checked", false);
                $(".salaryItem .monthly input,.salaryItem .daily input").attr("disabled",false);
			}
		    if($(this).parents(".set-list").length <= 0){
                $(".curr_bg").css('display','none');
                $(".moduleItem").removeClass("current");
                $("a.delete").removeClass("selected");
                $(this).addClass("selected");
                if(getCookie("delete") == undefined){
                   $("#delete-modal-child").modal("show");
                    $("#delete-modal-child button.submit").click(function(){
                        resumeDeleteChild();
                        $("#delete-modal-child").modal("hide");
                        cvmutual.main.resume_page();
                    });
                }else{
                    resumeDeleteChild();
                    cvmutual.main.resume_page();
                }
            }
		});	
	
	},
	resume_hidden:function(){// 隐藏模块
		function resumeHidden(){
			// baseItem模块隐藏
			 var $this = $(".baseItem-toolbar .delete.selected").parents(".baseItem");
			 var $id = $this.attr("id");
			 var $forid = $("#showul li a[for-id="+$id+"]");
			 var $hideitem = $forid.parent("li");
			 var $hidecon = $("#hideul li:last");
			 $(".hidecon ul").css('height','100%');			 
			 if($this.hasClass("customItem")){
			 	$this.remove();
			 	$hideitem.remove();
			 	$("#delete-modal").modal("hide");
			 }else{
			 	 $hidecon.after($hideitem);
				 $this.addClass("hidden");
				 $("#delete-modal").modal("hide");	
				 
			 }

			 // 去除selected
			 $(".baseItem-toolbar .delete").removeClass("selected");			
		}
		$("#hidden-modal button.submit").click(function(){
			var $checked =  $("#hidden-modal #checkedNotfy:checked").val();
			addCookie("hidden",$checked);
		});
		$(document).on("click",".baseItem-toolbar .delete",function(){
			$(".curr_bg").css('display','none');
			$(".moduleItem").removeClass("current");
			$(".baseItem-toolbar .delete").removeClass("selected");
			$(this).addClass("selected");
			if($(this).parents(".baseItem").hasClass("customItem")){
				$("#hidden-modal .delete-tips").text("此模块为自定义模块,删除后无法恢复");
			}else{
				$("#hidden-modal .delete-tips").text("删除后你可以在右侧模块管理出恢复显示");
			}			
			if(getCookie("hidden") == undefined){
				$("#hidden-modal").modal("show");
				$("#hidden-modal button.submit").click(function(){
					resumeHidden()
					cvmutual.main.resume_page();
					$("#hidden-modal").modal("hide");
				});
			}else{
				console.log("neverNotfy有存cookie");
				resumeHidden()
				cvmutual.main.resume_page();
			}
		});			
	},
	resume_page:function(){// 简历分页
		if($(".wbdCv-container").hasClass("mobile")){}else{
			var nowPageSize = 0; // 当前页数
			var resumePageHeight = 1160;// 每页高度
			var resumePageHtml = '<div class="page_tips"><div class="tips_inner"><span class="tips_title">温馨提示：</span><span class="tips_text">此处为分页线，内容超出一页请用回车键换行隔开。</span></div></div>';
			var resumeHeight = $(".wbdCv-resume").css({"height" : "auto","min-height":1160}).outerHeight();
            $(".wbdCv-resume").css("height",resumeHeight);
			var pageSize = Math.ceil(resumeHeight / resumePageHeight);
			if(pageSize != nowPageSize) {
                nowPageSize = pageSize;
				$("div.page_tips").remove();
				for(var index = 1; index < pageSize; index++) {
					var pageBreakObj = $(resumePageHtml);
					pageBreakObj.css({"top" : (index * resumePageHeight)-40 + "px"});
					$(".wbdCv-resume").append(pageBreakObj);
				}
			}
		}
	},
	create_resume_tool:function(i,j){// 创建工具
		var html = i.html();
    	j.before(html);		
	},	
	create_customItem:function(){// 创建自定义模块
		$(document).on("click","#custom-modal .resume_add",function(){	
			var title = $("#custom-modal").find(".resume_title").val();
			var time = $("#custom-modal").find(".time div[contenteditable]").html();
			var unit = $("#custom-modal").find(".resume_unit").val();
			var job = $("#custom-modal").find(".resume_job").val();
			var content = $('#custom-modal').find(".resume_content").val();
			var $lastchild = $(".addCustomItem.selected");
			var item = $("#add_resume_time").clone();
			var item1 = $("#add_resume_desc").clone();
			var $customtitle = $("#showul li.grzp").clone();
			item.removeAttr("style");
			item.find("dt,.dd-title,.dd-text").removeClass("hidden");
			item.find(".baseItem-toolbar .set .set-list").removeClass("hidden");
			item.find(".baseItem-toolbar .set .set-list s").removeClass("checked");
			item1.removeAttr("style");
			if (!title || title == "") {				
				layer.msg("请填写模块标题名称");
				$("#custom-modal").find(".resume_title").focus();
			}else{
				var uuid=cvresume.main.uuid();
				if(($("#custom-modal").find(".time").hasClass("hidden")) || (unit && unit.length > 0) || (job && job.length > 0)){
					item.attr("id",uuid);
					item.find("[for-key]").attr("for-key",uuid);
					item.addClass("customItem");	
					item.removeClass("experItem");
					item.find(".dd-content:first-child").siblings(".dd-content").remove();
					item.find("dt span a.wbdfont").text("&#xe70f;");
					item.find("dt span div[contenteditable]").text(title);
					item.find(".time div[contenteditable]").html(time);
					item.find(".company div[contenteditable]").text(unit);
					item.find(".post div[contenteditable]").text(job);
					item.find(".dd-text div[contenteditable]").text(content);					
					item.find("dt span div[contenteditable]").attr("data-placeholder","自定义标题...")
					item.find(".company div[contenteditable]").attr("data-placeholder","自定义...")
					item.find(".post div[contenteditable]").attr("data-placeholder","自定义...")
					item.find(".dd-text div[contenteditable]").attr("data-placeholder","添加自定义描述...");
					item.insertBefore($lastchild);
					common.main._500dtongji("PC-在线制作-"+cvmutual.info.resume_type+"编辑页-中间简历编辑-自定义模块-添加时间模块");
				}else{
					item1.attr("id",uuid);
					item1.find("[for-key]").attr("for-key",uuid);
					item1.addClass("customItem");	
					item1.removeClass("honorItem");
					item1.find("dt span a.wbdfont").text("&#xe70f;");
					item1.find("dt span div[contenteditable]").text(title);
					item1.find(".dd-text div[contenteditable]").text(content);
					item1.find("dt span div[contenteditable]").attr("data-placeholder","自定义标题...")
					item1.find(".dd-text div[contenteditable]").attr("data-placeholder","添加自定义描述...");					
					item1.insertBefore($lastchild);	
					common.main._500dtongji("PC-在线制作-"+cvmutual.info.resume_type+"编辑页-中间简历编辑-自定义模块-添加描述模块");
				}
				$customtitle.find("a").attr("for-id",uuid);
				$customtitle.removeClass("grzp");
				$customtitle.find("a").attr("title","删除此模块");
				$customtitle.find("span").attr("data-placeholder","自定义模块");
				$customtitle.addClass("custom-li");
				$customtitle.find(".name").text(title);
				$customtitle.insertAfter($("#showul li:last-child"));
			    $("#custom-modal").modal("hide");
			}
			$(".addCustomItem").removeClass("selected");
			cvmutual.main.resume_page();
            $("#bar").sortable("refresh");
            $("#foo").sortable("refresh");
		});
		$(document).on("click",".custom-time-input .dateBar-con li span",function(){
			var $this = $(this).parents(".dateBar");
			$this.siblings("b").addClass("hidden");
			$this.siblings("div[contenteditable]").removeClass("hidden");
		});
		// 点击事件
		$(".addCustomItem").click(function(){	
			$("#custom-modal").find(".resume_title").val("");
			$("#custom-modal").find(".time b").removeClass("hidden");
			$("#custom-modal").find(".time div[contenteditable]").addClass("hidden");
			$("#custom-modal").find(".resume_unit").val("");
			$("#custom-modal").find(".resume_job").val("");
			$("#custom-modal").find(".resume_content").val("");		
			$("#custom-modal").modal();
			$(".addCustomItem").removeClass("selected");
			$(this).addClass("selected");
			if ($(".addCustomItem.selected").parents().hasClass("wbdCv-baseLeft")){
				$("#custom-modal").find(".custom-time-input").addClass("hidden");
			} else{
				$("#custom-modal").find(".custom-time-input").removeClass("hidden");
			}
		});		
	},
	create_timeItem_content:function(){// 创建子模块
		$(document).on("click",".timeItem .baseItem-toolbar .add",function(){
			cvmutual.main.reusme_autocompleter();
			var $this = $(this).parent(".baseItem-toolbar").siblings("dl").children("dd").children(".dd-content:first-child");
			var $lastchild = $(this).parent(".baseItem-toolbar").siblings("dl").children("dd").children(".dd-content:last-child");
			var $item = $this.clone();
			$item.removeAttr("data-id");
			$item.find(".time div[contenteditable]").text("");
			$item.find(".company div").text("");
			$item.find(".post div").text("");
			$item.find(".dd-text div").text("");
			$item.insertAfter($lastchild);
			cvmutual.main.resume_page();
		});			
	},	
	create_workItem_hover:function(){// 创建作品展示hover
		var html1 = '<div class="span-hover"></div>';
    	var html2 = '<a class="delete preItem500dtongji" data_track="PC-在线制作-'+cvmutual.info.resume_type+'编辑页-中间简历编辑-{0}-子模块删除"></a>';
    	var html3 = '<a class="work-edit"></a>';
    	var html4 = '<div class="move-downup">'+'<a class="up save_opt preItem500dtongji" data_track="PC-在线制作-'+cvmutual.info.resume_type+'编辑页-中间简历编辑-{0}-子模块上移"></a>'+'<a class="down save_opt preItem500dtongji" data_track="PC-在线制作-'+cvmutual.info.resume_type+'编辑页-中间简历编辑-{0}-子模块下移"></a>'+'<a class="delete preItem500dtongji" data_track="PC-在线制作-'+cvmutual.info.resume_type+'编辑页-中间简历编辑-{0}-子模块删除"></a>'+'</div>';    	
    	$(".work-con-link .link-list,.work-con .work-list,.infoItem .info-con div,.homeItem .home-list,.skillItem .skill-list,.hobbyItem .hobby-list,.coverItem .cover-list").append(html2);
    	$(".work-con-link .link-list,.work-con .work-list").append(html3);		
    	$(".work-list .work-img").append(html1);
		$(".dd-content .dd-title,.recoment-list .hd").before(html4);  
	},	
	set_liveupdate:function(){// 操作状态提示
    	$(document).on('focusin',".wbdCv-baseStyle div[contenteditable='true']",function(){
    		$(".liveupdate span").text("正在保存...");
    		$(".liveupdate i").addClass("rotate");
    	});
    	 $(document).on('focusout',".wbdCv-baseStyle div[contenteditable='true']",function(){
			$(".liveupdate i").removeClass("rotate");
    	 });
	},
    // 状态参数 sending, success, fail
	set_intervalProgress: "",
	set_progressBar:function(a){
        if(a == "sending"){
            cvmutual.main.set_intervalProgress = setInterval(function(){
                $(".progressBar").css("display","block");
                var winW = $(window).width(), $width= $(".progress").width();
                if($width >= winW){
                    clearInterval(cvmutual.main.set_intervalProgress);
                    $(".progress").width(0);
                    $(".progressBar").css("display","none");
                } else{
                    $width+= 1;
                    $(".progress").width($width);
                }
            },30);
            $(".liveupdate span").css("color","#00c190").text("正在保存...");
        }else if(a == "success"){
            clearInterval(cvmutual.main.set_intervalProgress);
            cvmutual.main.set_intervalProgress = setInterval(function(){
                $(".progressBar").css("display","block");
                var winW = $(window).width(), $width= $(".progress").width();
                if($width >= winW){
                    clearInterval(cvmutual.main.set_intervalProgress);
                    $(".progress").width(0);
                    $(".progressBar").css("display","none");
                } else{
                    $width+= 30;
                    $(".progress").width($width);
                }
            },1);
            $(".liveupdate span").css("color","#00c190");
        }else if(a == "fail"){
            clearInterval(cvmutual.main.set_intervalProgress);
			$(".progress").width(0);
			$(".progressBar").css("display","none");
            $(".liveupdate span").css("color","red").text("保存失败");
		}
	},
	set_modalbackdrop_hide:function(){// 隐藏模态框蒙板层
		// 隐藏模态框蒙版层
		if($(".litemodal").hasClass("in")){
			$(".modal-backdrop").css({
                'display':'none',
				'z-index':"-1"
			});
		}else{
            $(".modal-backdrop").css({
                'display':'none',
                'z-index':"-1"
            });
		}
		$("body").removeClass("suggestModal");
		$("body").removeClass("modal-open");
	},
	set_fgsz_theme:function(obj){// 设置模板主题
		var basestyle = $(".wbdCv-baseStyle");
		basestyle.attr("data_color",obj);
	},
	set_fgsz_fontfamily:function(obj){// 设置字体类型
		var basestyle = $(".wbdCv-baseStyle");
		basestyle.attr("data_font_name",obj);		
	},
	set_fgsz_fontsize:function(obj){// 设置字体大小
		var basestyle = $(".wbdCv-baseStyle");
		basestyle.attr("data_font_size",obj);		
	},
	set_fgsz_fonttype:function(obj){// 设置字体大小
		var basestyle = $(".wbdCv-baseStyle");
		basestyle.attr("data_font_type",obj);		
	},	
	set_fgsz_lineheight:function(obj){// 设置字体行高
		var basestyle = $(".wbdCv-baseStyle");
		basestyle.attr("data_line_height",obj);		
	},
    set_fgsz_margin:function(str){//	设置块距
		$(".wbdCv-baseStyle").attr("data-modal_margin",str);
        cvmutual.main.resume_page();
	},
	set_fgsz_t2s:function(){// 设置简繁体
    	var isSimplified = true;   
	    $(".fgsz-jft #fan").click(function(){
	    	$(".wbdCv-baseStyle").s2t();
	    	var isSimplified = false;
	    });
	    $(".fgsz-jft #jian").click(function(){
	    	$(".wbdCv-baseStyle").t2s();
	    	var isSimplified = true;
	    });
	    $(".fgsz-jft button").click(function(){
	    	$(this).addClass("checked").siblings().removeClass("checked");
	    });		
	},
	set_czls_li:function(i){// 设置操作历史显示隐藏
		var $li =i.parents("li");
		if($li.hasClass("current")) {
			$li.removeClass('current');
		} else {
			$li.addClass('current').siblings().removeClass('current');
		}			
	},
	set_mkgl_showhide:function(){// 设置模块管理显示隐藏
	    // 模块管理隐藏模块show hide
        // $(document).on("click",".itemcon .addother-btn",function(){
			// if($(".hidecon ul").height() <= 0){
			// 	$(".hidecon ul").css('height','100%');
			// 	$(this).addClass('show');
			// }else{
			// 	$(".hidecon ul").css('height','0px');
			// 	$(this).removeClass('show');
			// }
        // });
		// 隐藏模块管理模块
		$(document).on("click",".showcon ul li a",function(){
			$(this).attr("title","显示此模块");
			var $forid = $(this).attr("for-id");
			var $hideitem = $(this).parent("li");
			var $hidecon = $("#hideul li:last");
			$(".addother-btn").addClass("show");
			$(".hidecon ul").css('height','100%');
			if($(this).parents("li").hasClass("custom-li")){
				cvmutual.main.resume_confirm({
                    title:"确定删除当前模块吗？",
                    content:"此模块为自定义模块,删除后无法恢复.",
                    onOk:function(){
                    	if(!cvresume.main.is_empty($hideitem)){
                            $hideitem.remove();
						};
                    	if(!cvresume.main.is_empty($forid)){
                            $("body").find($("#" + $forid)).remove();
						}
                    },
					onCancel:function(){
                    	$hideitem = undefined;
                    	$forid = undefined;
					}
               });							
			}else if($forid == "resume_head"){
                $(this).toggleClass("checked");
			    if($(this).hasClass("checked")){
                    $("body").find($("#" + $forid)).addClass("hidden");
                }else{
                    $("body").find($("#" + $forid)).removeClass("hidden");
                }
            }else{
				$hidecon.after($hideitem);
				$("body").find($("#" + $forid)).addClass("hidden");
				var _module = $(this).attr("data_track");
				if(!cvresume.main.is_empty(_module)){
					var _dataTrack = "PC-在线制作-模块管理功能（"+cvmutual.info.resume_type+"编辑）-已有模块管理-已有模块管理-隐藏" + _module;
					common.main._500dtongji(_dataTrack);
				}
			}
			cvmutual.main.resume_page();
		});
		$(document).on("click",".showcon ul li,.hidecon ul li",function(){
			var $forid = $(this).find("a").attr("for-id");
			$('html,body').animate({scrollTop: $("#" + $forid).offset().top - 80}, 800);
		});		
		// 显示模块管理模块
		$(document).on("click",".hidecon ul li a:not(.wbd-vip-lock)",function(){
			$(this).attr("title","隐藏此模块");
			var $forid = $(this).attr("for-id");
			var $showitem = $(this).parent("li");
			var $showcon = $("#showul li:last");
			$showcon.after($showitem);
			$("body").find($("#" + $forid)).removeClass("hidden");
			cvmutual.main.resume_page();
			var _module = $(this).attr("data_track");
			if(!cvresume.main.is_empty(_module)){
				var _dataTrack = "PC-在线制作-模块管理功能（"+cvmutual.info.resume_type+"编辑）-添加其他模块-添加其他模块-显示" + _module;
				common.main._500dtongji(_dataTrack);
			}
		});	
	},
	set_resume_icon:function(){// 设置图标更换
		$(document).on("click","#IconModal .icon-list li",function(){
			var $icon = $(this).children(".wbdfont").html();
			$(".wbdCv-baseStyle .wbdfont.checked").html($icon);
			$("#IconModal").modal("hide");
			cvresume.main.delay_resume_save();
			common.main._500dtongji("PC-在线制作-"+cvmutual.info.resume_type+"编辑页-中间简历编辑-通用-点击模块图标(all)-选择某图标");
			var id=$(this).attr("id");
			var useNum=$(this).attr("data");
			 $.ajax({
		             type: "GET",
		             url: "/cvresume/icon/updateNum/",
		             data:{"id":id},
		             success: function(result){
		            	if(result.type == "success"){
		            	
		            	 } else {
		            	 	alert("err");
		            	 }
		            	 
		             }
				 })
		});		
	},	
	set_timeItem_time:function(){// 设置日期工具
		cvmutual.main.create_resume_tool($("#dateTool"),$(".dd-title span.time div"));
		cvmutual.main.create_resume_tool($("#dateTool"),$(".custom-content .custom-time-input div[contenteditable]"));
		$(document).on("click","span.time",function(){
		if($(this).find("div[contenteditable] i").hasClass("time-start")){
            $("span.time").removeClass("selected");
		}else{
			$("span.time").removeClass("selected");
			$(this).addClass("selected");
				var $html = '<i class="time-start"></i>-<i class="time-end"></i>';
				$this = $(this);
				$("span.time.selected div[contenteditable]").html($html);			
		}
		});		
		
		
		// 添加年份
		function set_time_year(){
			var this_date = new Date();
	    	this_year = this_date.getFullYear() + 4;  // 得到今年
	        for(var i=0;i<=50;i++){
	            var html='<span>'+'<i>'+(this_year-i)+'</i>'+'</span>';
	            $(".dateBar-con .year_select").append(html);
	        }
            if(cvresume.info.language=="en"||common.main.getUrlParamsValue("language")=="en"){
                $(".end_time_li .year_select").prepend("<span><i>present</i></span>");
			}else{
                $(".end_time_li .year_select").prepend("<span><i>至今</i></span>");
			}
		}
		// 添加月份
		function set_time_month(){
			var en_mouth = ['1','2','3','4','5','6','7','8','9','10','11','12'];
			for(var i=0; i<en_mouth.length;i++){
				var html='<span>'+'<i>'+(en_mouth[i])+'</i>'+'<s>'+'月'+'</s>'+'</span>';
				$(".dateBar-con .month_select").append(html);
			}
		}
		set_time_year();
		set_time_month();
		
		// 日期显示
		$(document).on("click",".timeItem .dd-title span.time",function(){
			$this = $(this);
			$parent=$(this).parents(".timeItem");
			$siblings=$parent.siblings(".timeItem")
			$this.children(".dateBar").addClass("show");
			$siblings.children(".dd-title span.time").children(".dateBar").removeClass("show");
            if(cvresume.main.is_empty($("body").data("dateLisener"))){
                $("body").data("dateLisener",true);
                $("body").bind('click',dateLisener);
            }
		});
		// 自定义模块日期显示
		$(document).on("click",".custom-time-input .time",function(){
			$this = $(this);
			$this.children(".dateBar").addClass("show");
			if(cvresume.main.is_empty($("body").data("dateLisener"))){
				$("body").data("dateLisener",true);
                $("body").bind('click',dateLisener);
			}
		});
        function dateLisener(event){
            var $target = $(event.target);
            if($target.parents(".dateBar").length <= 0){
                $(".dateBar").removeClass("show");
                $(".year_select span,.month_select span").removeClass("checked");
                $(".year_select1 span,.month_select1 span").removeClass("checked");
                if($(".selected .dateBar .time-start").text()=="" && $(".selected .dateBar .time-end").text()==""){
                	$(".dd-title .time.selected div[contenteditable]").html("");
                }
                $("body").unbind('click',dateLisener);
                cvresume.main.delay_resume_save();
                $("body").data("dateLisener",false);
            }
        }
		// 时间插件选择时间
		$(document).on("click",".dateBar ul li",function(){
			var num = $(this).index();
			var $this = $(this).parents(".dateBar-title").siblings(".dateBar-con").children("ul").children("li");
			$(this).addClass("current").siblings().removeClass("current");
			$this.eq(num).css('display','block').siblings().css('display','none');
		});			
		$(document).on("click",".dateBar-con ul li span",function(){
			var $this =$(this);
			$this.addClass("checked").siblings().removeClass("checked");
			// 判断类型，是开始时间，还是结束时间
			var type="begintime";
			var i=$this.closest("li").index();
			if(i==1){
				type="endtime";
			}
			// 组合时间
			// 获取选中的年
			var year=$this.closest("li").find(".year_select").find("span.checked").find("i").text();
			var month=$this.closest("li").find(".month_select").find("span.checked").find("i").text();
			
		   // 获取回显的日期项
		   var opt_time;
		   if(type=="begintime"){
			   opt_time= $this.closest("span.time").find("i.time-start");
		   }else{
			   opt_time= $this.closest("span.time").find("i.time-end");
		   }
		   // 获取当前的时间
		   var cur_time=opt_time.text();
		   if(year=="至今" || year == "present"){
		   	opt_time.html(year);
		   }else{
		   var cur_time_year=cur_time.split(".")[0];
		   var cur_time_month=cur_time.split(".")[1];
		   var date=new Date;
		   if(year==null||year==""||year==undefined){
			   if(cur_time_year==null||cur_time_year==""||cur_time_year==undefined){
				   year=date.getFullYear();
			   }else{
				   year=cur_time_year;
			   }
		   }
		   if(month==null||month==""||month==undefined){
			   if(cur_time_month==null||cur_time_month==""||cur_time_month==undefined){
				   month=date.getMonth()+1;
			   }else{
				   month=cur_time_month;
			   }
		   }
		   opt_time.html(year+"."+month);
		   }
		});
	},	
	set_baseItem_sortable:function(){// 设置拖动功能
		cvmutual.main.create_resume_tool($("#itemTool"),$(".baseItem dl"));
		cvmutual.main.create_resume_tool($("#itemTool"),$(".coverItem dl"));
		cvmutual.main.create_resume_tool($("#itemTool"),$(".bInfoItem dl"));
		//在线编辑6.2.0 水平的 => horizontal ; 垂直的 => vertical
		$(".baseItem .handle").addClass("horizontal");
		$(".timeItem .handle").removeClass("horizontal").addClass("vertical");
		// 拖动排序 - 水平
		$("#bar").sortable({
            connectWith: "#foo",
		 	items: ".baseItem",
		 	handle: ".horizontal",
		 	cursor: "move",
		 	cancel:".inteItem",
		 	revert: 500,
		 	helper: "clone",
		 	scrollSensitivity: 100,
		 	scrollSpeed: 20,
		 	tolerance: "pointer",
		 	cursorAt: { left: 200,top:50 },
		 	activate:function(event,ui){
		 		var _obj = $("#foo").sortable("option", "handle");
		 		var _item_h = ui.item.height();
		 		var _resume_h = $(".wbdCv-resume").height();
		 		$(".wbdCv-resume").css("height",_resume_h+_item_h);
		 		ui.sender.css("height","inherit");
		 	},			 	
		 	update: function( event, ui ) {
		 		cvresume.main.delay_resume_save();
                cvmutual.main.resume_page();
                var id = ui.item.attr("id"); //获取当前选择项
                var id_str=$("#resume_modal_manager ul li a[for-id="+id+"]").siblings("span").attr("data-placeholder");
                common.main._500dtongji("PC-在线制作-"+cvmutual.info.resume_type+"编辑页-中间简历编辑-" + id_str + "-拖动");
		 	},
		 	stop:function(){
		 		cvmutual.main.resume_page();
		 	}
		});	 
		$("#foo").sortable({
            connectWith: "#bar",
		 	items: ".baseItem",
		 	handle: ".horizontal",
		 	cursor: "move",
		 	cancel:".inteItem",
		 	revert: 500,
		 	helper: "clone",
		 	scrollSensitivity: 100,
		 	scrollSpeed: 20,
		 	tolerance: "pointer",
		 	cursorAt: { left: 200,top:50 },
		 	activate:function(event,ui){
		 		var _obj = $("#foo").sortable("option", "handle");
		 		var _item_h = ui.item.height();
		 		var _resume_h = $(".wbdCv-resume").height();
		 		$(".wbdCv-resume").css("height",_resume_h+_item_h);
		 		ui.sender.css("height","inherit");
		 	},			 	
		 	update: function( event, ui ) {
		 		cvresume.main.delay_resume_save();
                cvmutual.main.resume_page();
		 	},
		 	stop:function(){
		 		cvmutual.main.resume_page();
		 	}		 	
		});
		// 点击handle时重设拖动为水平||垂直
        $(document).on("mousedown","#bar .vertical",function(){
            var vertical = {handle:".vertical",connectWidth:"",containment:"parent"};
            $( "#bar" ).sortable( "option", vertical);
        });
        $(document).on("mousedown","#bar .horizontal",function(){
            var horizontal = {handle:".horizontal",connectWith:"#foo",containment:"body"};
            $( "#bar" ).sortable( "option", horizontal);
        });
    },
	set_timeItem_moveup:function(obj){// 设置子模块向上移动
		var this_obj = $(obj);
		var prev_obj = $(obj).prev();
	    if(prev_obj.length == 0){
	        layer.msg("第一行,想移啥？");
	        return;
	    }else{  	    	
	        prev_obj.before(this_obj);
	    }		
	},
	set_timeItem_movedown:function(obj){// 设置子模块向下移动
		var this_obj = $(obj);
		var next_obj = $(obj).next();
	    if(next_obj.length == 0){
	        layer.msg("最后一行,想移啥？");
	        return;
	    }else{
	        next_obj.after(this_obj);
	    }	
	},	
	set_resume_editor:function(){// 设置富文本编辑器
        $("[data-toggle='tooltip']").tooltip();
		function Bold() {
			document.execCommand('Bold');
		}
		function Italic() {
			document.execCommand('Italic')
		}
		function Underline() {
			document.execCommand('Underline')
		}
		function JustifyLeft() {
			document.execCommand('JustifyLeft')
		}
		function Justifycenter() {
			document.execCommand('Justifycenter')
		}
		function JustifyRight() {
			document.execCommand('JustifyRight')
		}
		function CreateLink() {
			selRange = saveSelection();
			$("#createLink-modal").modal("show");
			Uinput.focus();
		}
        function InsertUnorderedList() {
            var css = window.getSelection().anchorNode.parentNode.style.cssText;
            document.execCommand('InsertUnorderedList');
            window.getSelection().anchorNode.parentNode.style.cssText = css;
        }
        function InsertOrderedList() {
            var css = window.getSelection().anchorNode.parentNode.style.cssText;
            document.execCommand('InsertOrderedList')
            window.getSelection().anchorNode.parentNode.style.cssText = css;
        }
		function Indent() {
			document.execCommand('Indent')
		}
		function Outdent() {
			document.execCommand('Outdent')
		}
		function Undo() {
			document.execCommand('Undo')
		}
		function Redo() {
			document.execCommand('Redo')
		}
		function FormatPainter() {
			if(window.getSelection()){
				var parentN = window.getSelection().anchorNode.parentElement;
				while (parentN.nodeName != "DIV") {
					pCss = pCss + parentN.style.cssText;
					parentN = parentN.parentNode;
				};
				if (pCss != '' && pCss != null && pCss != undefined) {
					$(this).attr('data_flag', true)
				} else {
					alert("Place select again")
				}
			}
		}
		function saveSelection() {
			// createLink First Steps
			if (window.getSelection) {
				sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					return sel.getRangeAt(0);
				}
			} else if (document.selection && document.selection.createRange) {
				return document.selection.createRange();
			}
			return null;
		}
		function addlink(){
			// createLink Second Steps
			var text = Uinput.value;
			$("#createLink-modal").modal("hide");
			$(".smallmodal .createLink-content .inputURL input").val("");
			restoreSelection(selRange, text);
		}
		function restoreSelection(range, text) {
			// createLink Third Steps
			if (range) {
				if (window.getSelection) {
					sel = window.getSelection();
					sel.removeAllRanges();
					sel.addRange(range);
					document.execCommand("createLink", false, text)
				} else if (document.selection && range.select) {
					range.select();
					document.execCommand("createLink", false, text)
				}
			}
		}
		function FormatMouseUp(){
			if ($(".FormatPainter").attr('data_flag') && window.getSelection().toString().length > 0) {
				var node = document.createElement("span");
				node.style.cssText = pCss;
				window.getSelection().getRangeAt(0).surroundContents(node);
				$(".FormatPainter").removeAttr('data_flag');
			} else {
				return
			}
		}
		var pCss = new String() , selRange;
		var Uinput = $(".inputURL input")[0];
		var test = document.getElementById("test");
		var userAgent = navigator.userAgent , isOpera = userAgent.indexOf("Opera") > -1;
		var fore_color_text = ''; 	//	要改变字体颜色的文本
		if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera){
			$("[contenteditable='true']").attr("contentEditable","true");
            $(".FormatPainter").hide();
            var CEA = document.querySelectorAll("[contenteditable='true]");
            CEA.onfocusin = function(){
                $("#textExecCommand").css("display","block");
			}
		}else{
			document.execCommand("styleWithCSS",false,null);
		}
		$(".Bold").click(Bold);
		$(".Italic").click(Italic);
		$(".Underline").click(Underline);
		$(".JustifyLeft").click(JustifyLeft);
		$(".Justifycenter").click(Justifycenter);
		$(".JustifyRight").click(JustifyRight);
		$(".CreateLink").click(CreateLink);
		$(".InsertUnorderedList").click(InsertUnorderedList);
		$(".InsertOrderedList").click(InsertOrderedList);
		$(".Indent").click(Indent);
		$(".Outdent").click(Outdent);
		$(".FormatPainter").click(FormatPainter);
		$(".Undo").click(Undo);
		$(".Redo").click(Redo);
		$("#addlink").click(addlink);
		document.addEventListener('mouseup',FormatMouseUp);

        //添加字体颜色 - 保存选择字段
		$(".foreColor").click(function(){
            fore_color_text = saveSelection();
            $(this).addClass('open');
			$(".foreColor_list").show();
			$(document).on('click',fore_color_listener)
		});
		$(".foreColor_list i").click(function(){
            var get_color, $selected_parent;
            if($(this).parent('.default_color').length > 0){
                // 添加字体颜色 - 选择默认颜色去除颜色
                $(this).addClass("selected");
                $(".other_color i").removeClass("selected");
                get_color = '#878686';
            }else{
                $(".default_color i").removeClass("selected");
                $(".default_color i").removeClass("selected");
                get_color = $(this).css('backgroundColor');
            }
            if (fore_color_text) {
                if (window.getSelection) {
                    sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(fore_color_text);
                    document.execCommand("foreColor", false, get_color)
                } else if (document.selection && fore_color_text.select) {
                    fore_color_text.select();
                    document.execCommand("foreColor", false, get_color)
                }
            }else{
                document.execCommand("foreColor", false, get_color)
            }
            $(".foreColor").removeClass("open");
            $(".foreColor_list").hide();
            $(document).off('click',fore_color_listener);
		});
		function fore_color_listener(e) {
			var $target = $(e.target);
			if($target.hasClass("foreColor_list") || $target.parents(".foreColor_list").length > 0 || $target.hasClass("foreColor")){}else{
                $(".foreColor").removeClass("open");
                $(".foreColor_list").hide();
                $(document).off('click',fore_color_listener);
			}
        }

		// 没完成 缺少准确的编辑状态 && IE下无法捕捉可编辑 div 的编辑状态
		$(document).on("focusin","[contenteditable = 'true']",function(){
	    	$(this).attr("contenteditable","true");
			$("#textExecCommand").css("display","block");
		});
		$(document).on("focusout","[contenteditable = 'true']",function(){
			if(document.getSelection().toString().length != 0 && $(".wbdCv-baseStyle .baseItem.current").length > 0){
				$("#textExecCommand").css("display","block");
			}else{
				$("#textExecCommand").css("display","none");
                $(".foreColor").removeClass("open");
                $(".foreColor_list").hide();
			}
		});
	},
	set_workItem_img:function(){// 设置作品展示上传图片cvmutual.main.set_workItem_img($(".portfolio-preview
								// .cropper img"),$("#inputImage"));
		// 图片裁剪
	  	var URL = window.URL || window.webkitURL;
		var $image = $(".portfolio-preview .cropper img");
	  	var uploadedImageURL;
	  	var upload_image_url;
	  	var $inputImage = $("#inputImage");    		
		var options = {
		    aspectRatio: 5/4,
            restore: false,
		    autoCropArea:1,
            checkCrossOrigin:false            
		};   
		// Import image
        $image.cropper(options);
		if (URL) {
		    $inputImage.change(function () {
		     	var files = this.files;
		      	var file;
			    if (!$image.data('cropper')) {
			   		return;
				}
				if (files && files.length) {
			    	file = files[0];
				    if (/^image\/\w+$/.test(file.type)) {
						uploadedImageURL = URL.createObjectURL(file);
						$image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
					} else {
				  		layer.msg('请重新选择一次图片');
					}
				}
			});
		} else {
			$inputImage.prop('disabled', true).parent().addClass('disabled');
		}
    	// 获取当前图片作品值
    	function getWorkListData(){
    		$(document).on("click",".workItem .work-con-img .work-list .work-edit",function(){
                clearWorkModal();
    			$(".portfolio-show .showTab a:last-child").removeClass("underlinebtn");
    			$(".portfolio-show .showTab a:first-child").addClass("underlinebtn");
    			$(".portfolio-show ul li:last-child").css("display","none");
    			$(".portfolio-show ul li:first-child").css("display","block");    			
    			$(".workItem .work-edit,.workItem .moduleItemList,#portfolio-modal").removeClass("selected");
    			$(this).addClass("selected");
    			$("#portfolio-modal").addClass("selected");
    			var $this = $(".work-edit.selected").parents(".moduleItemList");
    			var $thisList = $this.addClass("selected");
    			// 获取选中模块的值
    			var $imgUrl = $this.find("img").attr("src");
    			var $title = $this.find(".work-title").text();
    			var $text = $this.find(".work-text").text();
    			$("#portfolio-modal").modal("show");  
    			// 获取的值传入弹框    
                
    			$image.cropper(options).cropper('replace', $imgUrl);
                
    			$("#portfolio-modal #workList .tipsContent").val($text);
    			$("#portfolio-modal #workList .tipsTitle").val($title);
    			$("#portfolio-modal #linkList .tipsContent").val("");
    			$("#portfolio-modal #linkList .tipsTitle").val("");
    			$("#portfolio-modal #linkList .inlineTitle").text("www.example.com");
    			$("#portfolio-modal #linkList .inlineContent").text("这里是作品描述");
                cvmutual.main.portfolio_count();
    		});				
    	}
    	// 获取当前链接作品值
    	function getLinkListData(){
    		$(document).on("click",".workItem .work-con-link .link-list .work-edit",function(){
    			clearWorkModal();
    			$(".portfolio-show .showTab a:last-child").addClass("underlinebtn");
    			$(".portfolio-show .showTab a:first-child").removeClass("underlinebtn");
    			$(".portfolio-show ul li:last-child").css("display","block");
    			$(".portfolio-show ul li:first-child").css("display","none");
    			$(".workItem .work-edit,.workItem .moduleItemList,#portfolio-modal").removeClass("selected");
    			$(this).addClass("selected");
    			$("#portfolio-modal").addClass("selected");
    			var $this = $(".work-edit.selected").parents(".moduleItemList");
    			var $thisList = $this.addClass("selected");
    			// 获取选中模块的值
    			var $title = $this.find(".work-title").text();
    			var $text = $this.find(".work-text").text();
    			$("#portfolio-modal").modal("show");  
    			// 获取的值传入弹框
    			$("#portfolio-modal #linkList .inlineContent").text($text);
    			$("#portfolio-modal #linkList .inlineTitle").text($title);
    			$("#portfolio-modal #linkList .tipsContent").val($text);
    			$("#portfolio-modal #linkList .tipsTitle").val($title);
                cvmutual.main.portfolio_count()
    		});	    		
    	}  	

		// 清除内容
		function clearWorkModal(){
			$("#portfolio-modal #workList .cropper img").attr("src","");
			$("#portfolio-modal .tipsTitle").val("");
			$("#portfolio-modal .tipsContent").val("");
			$("#portfolio-modal .inlineTitle").text("www.example.com");
			$("#portfolio-modal .inlineContent").text("这里是作品描述");
			$image.cropper('destroy');
		}
		// 添加图片作品
		function addWorkList(){
		  	var result = $image.cropper("getCroppedCanvas");
		  	// var work_cropper_data = result.toDataURL("image/jpeg");
            var $workI = $("#workList .cropper-view-box img").attr("src");
            var $workIselected = $(".work-list.selected .img-preview img").attr("src");
			
			var work_title =$("#portfolio-modal #workList .tipsTitle").val();
			var work_text =$("#portfolio-modal #workList .tipsContent").val();
			var curr_list =$(".workItem .work-con-img .moduleItemList.selected");
            if($workI == $workIselected){
               var work_imgurl = $workIselected;
            }else{
               var work_imgurl = upload_image_url;
               
            }
			if($(".workItem .work-con-img .moduleItemList").hasClass("selected")){
				curr_list.find(".work-img img").attr("src",work_imgurl);
				curr_list.find(".work-title").text(work_title);
				curr_list.find(".work-text").text(work_text);
			}else{
				var html = '<div class="work-list moduleItemList">'+
							'<span class="work-img"><div class="work-img-inner"><div class="img-preview" style="width:inherit;height:inherit;"><img src='+ work_imgurl +'></div><div class="span-hover"></div></div></span>'+
							'<span class="work-title">'+ work_title +'</span>'+
							'<span class="work-text">'+ work_text +'</span>'+
							'<a class="delete"></a><a class="work-edit"></a>'+
							'</div>';
				$(html).appendTo($(".workItem .work-con-img"));
			}
			if($("#resume_portfolio .baseItem-null").css("display") != "none"){
                $("#resume_portfolio .baseItem-null").css("display","none");
			}
		}
		// 添加链接作品
		function addLinkList(){
			var link_title =$("#portfolio-modal #linkList .tipsTitle").val();
			var link_text =$("#portfolio-modal #linkList .tipsContent").val();
			var curr_list =$(".workItem .work-con-link .moduleItemList.selected");
			if ($(".workItem .work-con-link .moduleItemList").hasClass("selected")) {
				curr_list.find(".work-title").text(link_title);
				curr_list.find(".work-text").text(link_text);				
			}else if($("#portfolio-modal").hasClass("selected") && $(".portfolio-show ul li:last-child").hasClass("underlinebtn")){
					var html = '<div class="link-list moduleItemList">'+
								'<a class="work-title" href ='+'http://'+ link_title +' target="_blank">'+ link_title +'</a>'+
								'<span class="work-text">'+ link_text +'</span>'+
								'<a class="delete"></a><a class="work-edit"></a>'+
								'</div>';
					$(html).appendTo($(".workItem .work-con-link"));			
			}else{
				var html = '<div class="link-list moduleItemList">'+
							'<a class="work-title" href ='+'http://'+ link_title +' target="_blank">'+ link_title +'</a>'+
							'<span class="work-text">'+ link_text +'</span>'+
							'<a class="delete"></a><a class="work-edit"></a>'+
							'</div>';
				$(html).appendTo($(".workItem .work-con-link"));				
			}

		}
 		// 图片上传服务器
 		function uploadImg(){
			 // 把裁剪好的图片上传
			 var upload_file =document.getElementById("inputImage").files;
			 if(upload_file.length>0){
				 var upload_file_size=upload_file[0].size/1024;
				 if((upload_file_size/1024)>0.5){
					layer.msg("请上传小于500K的图片");
					return;
				 }
			 }			 
			$.post(wbdcnf.base + '/file/upload/cropper_image/',{"token" : getCookie("token"),"cropper_image":$image.cropper("getCroppedCanvas").toDataURL("image/jpeg")}, function(result){
				if(result == "error") {
					alert("修改失败！");
				} else if(result == "notlogin") {
					alert("上传图片请先登录！");
			 	} else if(result == "ntosuport") {
			 		alert("文件格式不支持！");
			 	} else if(result == "not_data") {
			 		layer.msg("图片太大，请压缩处理后继续！");
			 	} else {
			 		upload_image_url=result;
			 		addWorkList();
			 	}
				$(this).prop("disabled",false);	
			});	 	
 		}
				
    	$("#workList .imgPreview .preview-btn").on('click',function(){
			if($("html").hasClass("ie9")){
				alert("当前浏览器内核为ie9,无法上传图片,请更换浏览器,或切换至极速模式,体验更多功能.");
			}else{
    			$("#inputHeadImage").removeAttr("disabled");
				$(this).siblings("input").trigger("click");
			}    		

			$image.cropper(options);
			
		});	    	
    	$(document).on("click",".workItem .add ,.workItem .baseItem-null",function(){
    		if($(".workItem .work-list").length >= 8){
    			layer.msg("不能超过8个作品集");
    			return ;
    		}
			$(".portfolio-show .showTab a:last-child").removeClass("underlinebtn");
			$(".portfolio-show .showTab a:first-child").addClass("underlinebtn");
			$(".portfolio-show ul li:last-child").css("display","none");
			$(".portfolio-show ul li:first-child").css("display","block");      		
    		$(".workItem .work-edit,.workItem .moduleItemList,#portfolio-modal").removeClass("selected");
    		clearWorkModal();
    		cvmutual.main.portfolio_count()
    		$("#portfolio-modal").modal("show"); 
    	});
		
		// 调用
		$("#portfolio-modal button.submit").click(function(){
			var $linkT = $("#linkList .tipsTitle").val()=="";
			var $linkC = $("#linkList .tipsContent").val()=="";
			var $workT = $("#workList .tipsTitle").val()=="";
			var $workC = $("#workList .tipsContent").val()=="";
			var $workI = $("#workList .cropper-view-box img").attr("src");
            var $workIselected = $(".work-list.selected .img-preview img").attr("src");
			if($linkT && $linkC && $workT && $workC && $workI==" "){
				layer.msg("你什么都没有填写");
			}else{
                if($linkT && $linkC){
                    if($workI == " "){
                        layer.msg("请上传图片");
                    }else{
                        if($workIselected != $workI){
                            uploadImg();
                        }else{
                            addWorkList();
                        }
                        $("#portfolio-modal").modal("hide");
                    }                   
                }else if($workT && $workC && typeof $workI === "undefined"){
                     addLinkList(); 
                     $("#portfolio-modal").modal("hide");
                }else{
                     if($workI == " "){
                        layer.msg("请上传图片");
                    }else{
                        if($workIselected != $workI){
                             uploadImg();
                            addLinkList(); 
                        }else{
                            addWorkList();
                            addLinkList(); 
                        }                                            
                        $("#portfolio-modal").modal("hide");
                    }                     
                }                                
			}
			if($(".workItem .work-list").length >= 1 || $(".workItem .link-list").length >= 1){
			 	$(".workItem .baseItem-null").css('display','none');
			}
		});	
        $("#portfolio-modal button.cancel,#portfolio-modal button.close").click(function(){
            $("#portfolio-modal").modal("hide");
            setTimeout(function () { 
                $image.cropper('destroy');
            }, 500);
        });
		getWorkListData();	
		getLinkListData(); 		
		cvmutual.main.resume_page();
	},
	set_headItem_img:function(cropper_img,uploadimg){// 设置头像上传
	  	var URL = window.URL || window.webkitURL;
		var $image = cropper_img;
	  	var uploadedImageURL;
	  	var $inputImage = uploadimg;
	  	var aspectratio = $(".headItem .img-preview").width()/$(".headItem .img-preview").height();
		var options = {
		    aspectRatio: aspectratio,
		    responsive:false,
		    minContainerWidth:300,
		    minContainerHeight:200,
		    minCanvasHeight:200
		};
	  	// Cropper
	  	$image.cropper(options);
		// Import image
		if (URL) {
		    $inputImage.change(function () {
		     	var files = this.files;
		      	var file;
			    if (!$image.data('cropper')) {
			    return;
				}
				if (files && files.length) {
				    file = files[0];
				    if (/^image\/\w+$/.test(file.type)) {
						uploadedImageURL = URL.createObjectURL(file);
						$image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
						$inputImage.val('');
                    }else {
                      layer.msg('只能传JPG和PNG的图片格式');
                    }
                    var $as = $(".headItem .img-preview").width()/$(".headItem .img-preview").height();
                    $image.cropper("setAspectRatio",$as);
                    $("#headimg-modal").modal("show");
				}
			});
        } else {
            $inputImage.prop('disabled', true).parent().addClass('disabled');
        }

		$("#headimg-modal .button.submit").click(function(){
			var $isCoopered=$(".headimg-content .cropper").find("div");// 判断是否有上传
			if($isCoopered==null||$isCoopered.length==0){
				layer.msg("请先上传图片!");
				return;
			}
			var image_cropper = $image.cropper("getCroppedCanvas");
			var image_cropper_data=image_cropper.toDataURL("image/jpeg");			
			 // 把裁剪好的图片上传
			$.post(wbdcnf.base + '/file/upload/cropper_image/',{"token" : getCookie("token"),"cropper_image":image_cropper_data.toString()}, function(result){
				if(result == "error") {
					alert("修改失败！");
				} else if(result == "notlogin") {
					alert("上传头像请先登录！");
			 	} else if(result == "ntosuport") {
			 		alert("文件格式不支持！");
			 	} else if(result == "not_data") {
			 		layer.msg("图片太大，请压缩处理后继续！");
			 	} else {
			 		upload_image_url=result;
			 		$(".headItem .img-preview img").attr("src",upload_image_url).attr("style","");
			 	}
				$(this).prop("disabled",false);
				$("#headimg-modal").modal("hide");
			});	
			
		});
	},
    add_workItem_list:function(){// 添加作品展示
    	
    },
    edit_workItem_list:function(){

    },
    set_coverItem:function(){// 设置封面
    	function addCoverList(){   		
	        $(document).on("click",".coverItem .baseItem-toolbar .add",function(){
	        	var $coverlist = '<div class="cover-list moduleItemList"><a class="wbdfont divIconFont">&#xe88c;</a><div contenteditable="true" data-placeholder="自定义"></div><a class="delete 500dtongji" data_track="PC-在线制作-'+cvmutual.info.resume_type+'编辑页-中间简历编辑-{0}-删除"></a></div>';        		
        		var $conchild = $(".coverItem .cover-con");
        		$conchild.append($coverlist);
	        });    		
    	}		
		addCoverList();
    },
	set_infoItem:function(){
		function click_baseMsgModal_openMore(){
			var open =  $(this).attr("data-open");
			if(open == "false"){
				$(".moreMsg").eq(0).css("display","block");
				$(this).attr("data-open","true");
			}else{
				$(".moreMsg").eq(0).css("display","none");
				$(this).attr("data-open","false")
			}
		}
        function click_baseMsgModal_adddefind(){
            var dom = $("<div  data-panel='defind' class='add'></div>").html("<input type='text' placeholder='字段名称' class='defindName'><input type='text' placeholder='字段内容不超过20个字' maxlength='40' class='defindContent'><a href='javascript:;' class='closeDefind'></a>");
            dom.insertBefore($(this));
            if($("#openMore").css("margin-top") == "46px"){
                $("#openMore").removeAttr("style")
            }
        }
        function click_baseMsgModal_closeDefind(){
            $(this).parent("div").remove();
            if($(".defindItem").length <= 0){
                $("#openMore").css("margin-top","46px")
            }else if($("#addedSkill .item-content").length<=0){
                $("#addedSkill").css('display','none');
            }else if($(".addedHobby .item-content").length<=0){
                $(".addedHobby").css('display','none');
            }
        }
        $("#baseMsg-modal #openMore").on("click",click_baseMsgModal_openMore);
        $(document).on('click','#addDefind',click_baseMsgModal_adddefind);
        $(document).on('click','.closeDefind',click_baseMsgModal_closeDefind);
        $(document).on("click",".bInfoItem .baseItem-toolbar span.edit,.info-list span,.name-con div",function(){
            $("#baseMsg-modal").modal("show");
            cvmutual.main.get_infoToModal();
            if($(".tag_bar span").length == 0){
            	cvresume.main.commend_personal_tags(1);//个人信息标签
            }
            if($(this).parents(".socialItem").length > 0){
                $("#baseMsg-modal #openMore").attr("data-open","true");
				$(".moreMsg").eq(0).css("display","block");
				setTimeout(function(){
                    $("#baseMsg-modal .modal-dialog").scrollTop(400)
				},400)
			}else{
                setTimeout(function(){
                    $("#baseMsg-modal .modal-dialog").scrollTop(0)
                },400)
			}
        });
        $("#baseMsg-modal .modal-footer .submit").click(function(){
        	$(".wormItem").each(function(){
        		$(this).children().unwrap()
			});
        	var missAge, missDefind, missSelf, NaN, check_input;
        	if($("[data-panel='years']").prev().text() == "年份" && $("[data-panel='months']").prev().text() == "月份"){
				missAge = false;
			}else if($("[data-panel='years']").prev().text() != "年份" && $("[data-panel='months']").prev().text() != "月份"){
                missAge = false;
			}else{
				missAge = true;
			}
			if($("[data-panel='defind']").length > 0){
                $("[data-panel='defind']").each(function(){
                	if(($(this).children(".defindName").val() == "" && $(this).children(".defindContent").val() == "") || ($(this).children(".defindName").val() != "" && $(this).children(".defindContent").val() != "")){
                        missDefind = false;
					}else{
						missDefind = true;
						return missDefind;
					}
				})
			}else{
				missDefind = false;
			}
			if($("[data-panel='homePage']").length > 0){
				$("[data-panel='homePage']").each(function(){
					if(($(this).find("[name=homeUrl]").val() == "" && $(this).find("[name=homeDesc]").val() == "") || ($(this).find("[name=homeUrl]").val() != "" && $(this).find("[name=homeDesc]").val() != "")){
                        missSelf = false;
					}else{
						missSelf = true;
						return missSelf;
					}
				})
			}else{
				missSelf = false;
			}
            check_input = cvmutual.main.check_input();
            if($(".NaN").length > 0){NaN = true}else{NaN = false}
			if(missAge || missDefind || missSelf || NaN || check_input){
                if(missAge){
                    $("[data-panel='years']").prev().text() == "年份" ? $("[data-panel='years']").parent().wrap("<span class='wormItem' style='margin-right:20px;'></span>") : "";
                    $("[data-panel='months']").prev().text() == "月份" ? $("[data-panel='months']").parent().wrap("<span class='wormItem' style='margin-left:20px;'></span>") : "";
				}
                $("[data-panel='defind']").each(function () {
                    if(($(this).children(".defindName").val() == "" && $(this).children(".defindContent").val() == "") || ($(this).children(".defindName").val() != "" && $(this).children(".defindContent").val() != "")){}else{
                        $(this).children(".defindName").val() == "" ? $(this).children(".defindName").wrap("<span class='wormItem'></span>") : "";
                        $(this).children(".defindContent").val() == "" ? $(this).children(".defindContent").wrap("<span class='wormItem'></span>") : "";
                    }
                });
                $("[data-panel='homePage']").each(function(){
                    if(($(this).find("[name=homeUrl]").val() == "" && $(this).find("[name=homeDesc]").val() == "") || ($(this).find("[name=homeUrl]").val() != "" && $(this).find("[name=homeDesc]").val() != "")){}else{
                        $(this).find("[name=homeUrl]").val() == "" ? $(this).find("[name=homeUrl]").wrap("<span class='wormItem'></span>") : "";
                        $(this).find("[name=homeDesc]").val() == "" ? $(this).find("[name=homeDesc]").wrap("<span class='wormItem'></span>") : "";
                    }
                });
                $(".wormItem").children().hover(function(){
                    $(".wormItem").children().unwrap("<span class='wormItem'></span>");
				})
			}else{
                $("#baseMsg-modal").modal("hide");
                $(".name-con .name").text($("[data-panel = 'name']").val());
                $(".name-con .word").text($("[data-panel = 'one']").val());
				if($(".tag_item .pasted_tags .pasted_tag").length > 0){
                    $(".wbdCv-baseStyle .resume_tag").html("").removeClass("hidden");
                    $(".tag_item .pasted_tags .pasted_tag").each(function(){
                    	var text = $(this).text(), $tag = $("<span></span>").html(text);
                    	$tag.appendTo($(".wbdCv-baseStyle .resume_tag"));
					})
				}else{
					$(".wbdCv-baseStyle .resume_tag").html("").addClass("hidden");
				}		//tag
                if($("[data-panel = 'years']").val() != "" && $("[data-panel = 'months']").val() != ""){
                    var date = new Date();
                    var $thisYear = date.getFullYear(), $thisMonth = date.getMonth() +1;
                    var age = $thisYear - $("[data-panel = 'years']").val();
                    var brith = $("[data-panel = 'years']").val() + "." + $("[data-panel = 'months']").val();
                    if(cvresume.info.language=="en"||common.main.getUrlParamsValue("language")=="en"){
                        age = age + " years old"
                    }else{
                        age = age + "岁"
                    }
                    $(".info-age span").attr("data-value", brith).text(age);
                   $(".info-age").removeClass('hidden');
                }else{
                   $(".info-age span").text("").attr("data-value","");
                   $(".info-age").addClass('hidden');
                }       // age
                if($("[data-panel = 'city']").attr('data-name') == "" || $("[data-panel = 'city']").attr('data-name') == "意向城市"){
                   $(".info-city span").text("");
                   $(".info-city").addClass("hidden");
                }else{
                   $(".info-city span").text($("[data-panel = 'city']").attr('data-name')).attr("data-value",$("[data-panel = 'city']").val());
                   $(".info-city").removeClass("hidden");
                }       // city
                if($("[data-panel = 'phone']").val() == ""){
                   $(".info-phone span").text("");
                   $(".info-phone").addClass("hidden");
                }else{
                   $(".info-phone span").text($("[data-panel = 'phone']").val());
                   $(".info-phone").removeClass("hidden");
                }       // phone
                if($("[data-panel = 'email']").val() == ""){
                   $(".info-email span").text("");
                   $(".info-email").addClass("hidden");
                }else{
                   $(".info-email span").text($("[data-panel = 'email']").val());
                   $(".info-email").removeClass("hidden");
                }       // email
                if($("[data-panel = 'work']").siblings('span').text() == "选择工作年限"){
                   $(".info-work span").text("");
                   $(".info-work").addClass("hidden");
                }else{
                	var text;
                	if($("[data-panel = 'work']").siblings('span').text() == "No expericence" || $("[data-panel = 'work']").siblings('span').text() == "无工作经验"){
                		text = $("[data-panel = 'work']").siblings('span').text();
					}else if(cvresume.info.language=="en"||common.main.getUrlParamsValue("language")=="en"){
                		text = $("[data-panel = 'work']").siblings('span').text() + " expericence";
					}else{
                        text = $("[data-panel = 'work']").siblings('span').text() + "工作经验";
					}
                   $(".info-work span").text(text);
                   $(".info-work").removeClass("hidden");
                }       // work
                if($(".sexItem label :checked").length > 0){
                   $(".info-sex span").text($(".sexItem label :checked").prev().text());
                   $(".info-sex").removeClass("hidden");
                }else{
                   $(".info-sex span").text("");
                   $(".info-sex").addClass("hidden");
                }       // sex
                if($("[data-panel = 'highedu']").siblings('span').text() == "选择最高学历"){
                   $(".info-highedu span").text("");
                   $(".info-highedu").addClass("hidden");
                }else{
                   $(".info-highedu span").text($("[data-panel = 'highedu']").siblings('span').text());
                   $(".info-highedu").removeClass("hidden");
                }       // highedu
                if($("[data-panel = 'nation']").val() == ""){
                   $(".info-nation span").text("");
                   $(".info-nation").addClass("hidden");
                }else{
                   $(".info-nation span").text($("[data-panel = 'nation']").val());
                   $(".info-nation").removeClass("hidden");
                }       // nation
                if($("[data-panel = 'marital']").siblings('span').text() == "选择婚姻状况"){
                   $(".info-marital span").text("");
                   $(".info-marital").addClass("hidden");
                }else{
                   $(".info-marital span").text($("[data-panel = 'marital']").siblings('span').text());
                   $(".info-marital").removeClass("hidden");
                }       // marital
                if($("[data-panel = 'status']").siblings('span').text() == "选择政治面貌"){
                   $(".info-status span").text("");
                   $(".info-status").addClass("hidden");
                }else{
                   $(".info-status span").text($("[data-panel = 'status']").siblings('span').text());
                   $(".info-status").removeClass("hidden");
                }       // status
                if($("[data-panel = 'height']").val() == "" && $("[data-panel = 'weight']").val() == ""){
                    $(".info-height").addClass("hidden").children("span").attr("data-value","").text("");
                    $(".info-weight").addClass("hidden").children("span").attr("data-value","");
				}else if($("[data-panel = 'height']").val() != "" && $("[data-panel = 'weight']").val() != ""){
                    var HW = $("[data-panel = 'height']").val() + "cm/" +$("[data-panel = 'weight']").val() + "kg";
                    $(".info-height").removeClass("hidden").children("span").attr("data-value",$("[data-panel = 'height']").val()).text(HW);
                    $(".info-weight").addClass("hidden").children("span").attr("data-value",$("[data-panel = 'weight']").val());
				}else{
					if($("[data-panel = 'height']").val() != ""){
                        var HW = $("[data-panel = 'height']").val() + "cm";
                        $(".info-height").removeClass("hidden").children("span").attr("data-value",$("[data-panel = 'height']").val()).text(HW);
                        $(".info-weight").addClass("hidden").children("span").attr("data-value","");
					}else{
                        var HW = $("[data-panel = 'weight']").val() + "kg";
                        $(".info-height").removeClass("hidden").children("span").attr("data-value","").text(HW);
                        $(".info-weight").addClass("hidden").children("span").attr("data-value",$("[data-panel = 'weight']").val());
					}
				}				// height && weight
                if($("[data-panel = 'defind']").length > 0 && $("[data-panel = 'defind']").children("input").eq(0).val() != "" && $("[data-panel = 'defind']").children("input").eq(1).val() != ""){
                   $(".info-defind").remove();
                   $("[data-panel = 'defind']").each(function(){
                       if($(this).find('.defindContent').val() != ""){
                           var key = cvmutual.main.makeId();
                           var icon = $(this).attr('data-iconFont') == undefined ? "&#xe70f;" : $(this).attr('data-iconFont');
                           $(this).attr("data-value",key)
                           var inner = $("<div class='info-defind info-list' id='"+ key +"'></div>").html("<a title='"+ $(this).find(".defindName").val() +"' class='wbdfont divIconFont' for-key='"+ key +"'>"+ icon +"</a><span>"+ $(this).find(".defindContent").val() +"</span><a class='delete'></a>");
                           inner.appendTo($(".info-con"));
                       }
                   })
                }else{
                   $(".info-defind").remove();
                }       // defind
                if($("[data-panel = 'homePage']").length >0 && $("[data-panel = 'homePage']").eq(0).find("[name=homeUrl]").val() != "" && $("[data-panel = 'homePage']").eq(0).find("[name=homeDesc]").val() != ""){
                $(".homeItem").removeClass("hidden");
                   $(".home-con").html("");
                   var inner = "";
                   $("[data-panel = 'homePage']").each(function(){
                       var key = $(this).attr("data-value") == undefined ? cvmutual.main.makeId() : $(this).attr("data-value");
                       var icon = $(this).attr('data-iconFont') == undefined ? "&#xe8e6;" : $(this).attr('data-iconFont');
                       var $url;
                       if($(this).find('input').eq(1).val().indexOf("http://") >= 0 || $(this).find('input').eq(1).val().indexOf("https://") >= 0){
                           $url = $(this).find('input').eq(1).val();
					   }else{
                       		$url = "http://" + $(this).find('input').eq(1).val();
					   }
                       inner += "<div class='home-list moduleItemList' id='"+ key +"'><a class='wbdfont divIconFont' for-key='"+ key +"'>"+ icon +"</a><a class='name' href='"+ $url +"' target='_blank'>"+ $(this).find('input').eq(0).val() +"</a><a class='delete'></a></div>"
                   });
                   $(".home-con").html(inner);
                }else{
                    $(".homeItem").addClass("hidden")
                    $(".home-con").html("");
                }       // self
                if($(".infoItem .info-list.hidden").length<12){
                	$(".infoItem").removeClass("hidden");
                }
                cvresume.main.delay_resume_save();
			}
        });
        $("#baseMsg-modal .modal-footer .cancel").click(function(){
            $(".NaN").removeClass("NaN");
            $(".wrong_input").removeClass("wrong_input");
            cvmutual.main.get_infoToModal();
            $("#baseMsg-modal").modal("hide");
		});

        //标签事件绑定
		function add_resume_tag(text,fn){
		    var _text = text.replace(/(^\s*)|(\s*$)/g,"") || "", _fn = fn || "", _number = $(".tag_item .pasted_tags .pasted_tag").length;
		    if(_text.length>0 &&  _number < 3){
                var $new_pasted_tag = $('<div class="pasted_tag"></div>').html( _text + '<a href="javascript:;" class="delete_tag"></a>');
                $new_pasted_tag.appendTo($(".tag_item .pasted_tags"));
                $(".tag_item .pasted_tags .pasted_tips i").text(3 - (++_number));
                if(typeof  _fn == "function"){fn()}
            }else if(_number >= 3){
                layer.msg("最多只能贴三个标签哦，不能再多了~");
                return false
            }else if(_text.length == 0){
                layer.msg("标签内容不可为空");
                return false
            }
            return true;
		}
		$(document).on('click','.tag_item .tag_bar span',function(){
			var $this = $(this), text = $this.text();
            var _result = add_resume_tag(text,function(){
                $this.remove();
            });
            if(_result){
            	var id=$(this).attr("id");
            	cvresume.main.commend_personal_tags_update_use_num(id);
            	//如果当前已经没有标签可选择则换一批
            	if($(".tag_item .tag_bar span:visible").length <= 0){
            		batch_change();
            	}
            }
        }); //添加标签点击事件
		$(".tag_item .tag_search_bar input").on('keypress',function(e){
            if(e.keyCode==13){
                var $this = $(this), text = $this.val();
                add_resume_tag(text,function(){
                        $this.val('')
                    });
            }
		}); // 添加输入框回车事件
		$(".tag_item .tag_search_bar .pasted_get_tag").click(function(){
			var $this = $(".tag_item .tag_search_bar input"), text = $this.val();
            add_resume_tag(text,function(){
                    $this.val('')
                });
		}); // 添加按钮点击事件
		$(document).on('click',".tag_item .pasted_tags .delete_tag",function(){
			common.main._500dtongji("PC-在线制作-基本信息弹框（"+cvmutual.info.resume_type+"）-展开选填项-展开选填项-删除某标签");
            $(this).parent().remove();
            $(".tag_item .pasted_tags .pasted_tips i").text(3 - $(".tag_item .pasted_tags .pasted_tag").length);
		}); //	标签删除按钮点击事件
		$(".renovate_tag").on('click',function(){
			batch_change();
		}); // 换一批点击事件
		function batch_change(){//换一批
			var $readyShowDom = $(".tag_item .tag_bar").find("span:visible:last").nextAll(":lt(7)");
        	$(".tag_item .tag_bar").find("span").hide();
        	if($readyShowDom.length == 0){
        		$readyShowDom = $(".tag_item .tag_bar").find("span:lt(7)");
        	}
        	$readyShowDom.show();
		}
		$(".chose_button_bar a").on('click',function(){
			if($(this).hasClass("cancel_chose")){
                $(".chose_social_modal").fadeOut();
			}else if($(this).hasClass("ok_chose")){
				$(".chose_social_content .social_list").each(function(){
					var type = $(this).attr("data-social");
					if($(this).hasClass("checked")){
						$(".social_list input[data-panel="+type+"]").parents(".social_list ").removeClass("hidden")
					}else{
                        $(".social_list input[data-panel="+type+"]").parents(".social_list ").addClass("hidden")
					}
                    $(".chose_social_modal").fadeOut();
				})
			}
		}); 
	},
	set_inteItem:function(){
        $(document).on("click",".salaryItem .negotiable input[type='checkbox']",function(){
            if($(this).is(':checked')){
                $(".salaryItem .monthly input,.salaryItem .daily input").attr("disabled","disabled");
            }else{
                $(".salaryItem .monthly input,.salaryItem .daily input").removeAttr("disabled");
                 $(".salaryItem .monthly input:first-child,.salaryItem .daily input").focus();
            }            
        });
		function click_inteItem_workTypeLi() {
            if ($(this).text() == "兼职" || $(this).text() == "Part-time") {
                $(".salaryItem .daily").css("display","block");
                $(".salaryItem .monthly").css("display", "none").find("input").val("");
            }else{
                $(".salaryItem .daily").css("display","none").find("input").val("");
                $(".salaryItem .monthly").css("display", "block");
            };
        }
        $(".inte-content .worktypeItem .select li").on('click',click_inteItem_workTypeLi)
		$(document).on("click",".inteItem .baseItem-toolbar .edit,.inte-con span",function(){
			cvmutual.main.get_jobToModal();
			$("#jobIntension-modal").modal("show");
		});
		$("#jobIntension-modal .modal-footer .submit").click(function(){
			var missPrice, wormInput=false, staPrice=$(".monthly").find("input").eq(0).val(), endPrice=$(".monthly").find("input").eq(1).val(), $NaN;
			if($(".monthly").css("display") == "block" && ($(".monthly").find("input").eq(0).val() == "" && $(".monthly").find("input").eq(1).val() != "")){
				missPrice = true;
			}else{
				missPrice = false
			}
			if($(".monthly").css("display") == "block" && parseInt(staPrice) >= parseInt(endPrice)){
			    wormInput = true;
            }
			if($(".NaN").length >0){$NaN = true}else{$NaN = false}
            if(missPrice || wormInput || $NaN){
                if(missPrice){
                    $(".monthly").find("input").eq(0).wrap("<span class='wormItem'></span>");
                    $(".wormItem").hover(function(){
                        $(this).children().unwrap("<span class='wormItem'></span>")
                    })
                }       // 填写 endPrice 没有 staPrice 时提醒
                if(wormInput){
                    $(".monthly").find("input").eq(1).addClass("wormInput");
                    $(".monthly").find("input").eq(1).on("focus",function(){
                        $(this).removeClass("wormInput");
                    })
                }       // endPrice 小于 staPrice 时提醒
            }else{
                var inteType, intePrice;

                //判断意向职位val()是否空
                if(cvresume.main.is_empty($("[data-panel = 'inteJob']").val())){
                    $(".inte-job span").text("");
                    $(".inte-list.inte-job").addClass("hidden");
                }else{
                    $(".inte-job span").text($("[data-panel = 'inteJob']").val());
                    $(".inte-list.inte-job").removeClass("hidden");
                }

                //判断工作类型是否null
                if(cvresume.main.is_empty($("[data-panel = 'inteType']").val())){
                    inteType = "";
                    $(".inte-type span").text("").attr("data-value","");
                    $(".inte-list.inte-type").addClass("hidden");
                }else{
                    inteType = $("[data-panel = 'inteType']").prev("span").text();
                    $(".inte-type span").text(inteType).attr("data-value",$("[data-panel = 'inteType']").val());
                    $(".inte-list.inte-type").removeClass("hidden");
                }

                //判断意向城市val()是否空
                if($("[data-panel = 'chosecity']").prev().prev("span").text() == "选择意向城市"){
                    $(".inte-city span").text("").attr("data-value","");
                    $(".inte-list.inte-city").addClass("hidden");
                }else{
                    $(".inte-city span").text($("[data-panel = 'chosecity']").prevAll("span").text()).attr("data-value",$("[data-panel = 'chosecity']").val());
                    $(".inte-list.inte-city").removeClass("hidden");
                }

                //判断最快到岗时间是否null
                if(cvresume.main.is_empty($("[data-panel='inteTime']").val())){
                    $(".inte-time span").text("").attr("data-value","");
                    $(".inte-list.inte-time").addClass("hidden");
                }else{
                    $(".inte-time span").text($("[data-panel = 'inteTime']").prevAll("span").text()).attr("data-value",$("[data-panel = 'inteTime']").val());
                    $(".inte-list.inte-time").removeClass("hidden");
                }

                // 判断薪资要求
                if($(".salaryItem .negotiable input[type='checkbox']").is(':checked')){
                    var negotiable;
                    if(cvresume.info.language=="en"){
                        negotiable = 'Negotiable';
                    }else{
                        negotiable = '薪资面议';
                    }
                    $(".inte-price span").text(negotiable);
                    $(".inte-list.inte-price").removeClass("hidden");
                }else{
                    if(inteType != "兼职" && inteType != "Part-time"){
                        if($(".monthly input").eq(0).val() != "" && $(".monthly input").eq(1).val() != ""){
                            intePrice = $(".monthly input").eq(0).val() + "K-" + $(".monthly input").eq(1).val() + "K";
                            $(".inte-list.inte-price").removeClass("hidden");
                        }else if($(".monthly input").eq(0).val() != ""){
                            intePrice = $(".monthly input").eq(0).val() + "K";
                            $(".inte-list.inte-price").removeClass("hidden");
                        }else{
                            intePrice = "";
                            $(".inte-list.inte-price").addClass("hidden");
                        }
                    }else if(inteType == "兼职" || inteType == "Part-time"){
                        intePrice = $(".daily input").val() == "" ? "" : $(".daily input").val() + $(".daily span").text();
                        $(".inte-list.inte-price").removeClass("hidden");
                    }else{
                        intePrice = "";
                        $(".inte-list.inte-price").addClass("hidden");
                    }
                    $(".inte-price span").text(intePrice);
                }
                $("[data-panel='intePrice']").val(intePrice);

                $("#jobIntension-modal").modal("hide");
				cvresume.main.delay_resume_save();
            }
		});
        $("#jobIntension-modal .modal-footer .cancel").click(function(){
        	$(".NaN").removeClass("NaN");
            cvmutual.main.get_infoToModal();
            $("#jobIntension-modal").modal("hide");
        });
	},
	set_selectControl:function(){
        var $choseParent;
        function selectBoxClick(event){
            // 下拉框容器点击时 展示/隐藏 下拉框
            if(!$(this).attr("data-selected") || $(this).attr("data-selected") == "false"){
                $("div [data-selected]").attr("data-selected","false");
                $("div [data-chosecity]").attr("data-chosecity","false");
                $(this).attr("data-selected","true");
                if($(this).children(".select").css("display") == "block"){
                	if($(this).find(".select li[data-click='selected']").length > 0){
                        var top = $(this).find(".select li[data-click='selected']")[0].offsetTop;
                        $(this).find(".select").scrollTop(top);
					}else if($(this).attr("id") == "yearSelect"){
                        var top = $(this).find(".select li[data-value='1987']")[0].offsetTop;
                        $(this).find(".select").scrollTop(top);
					}else{
                        $(this).find(".select").scrollTop(top);
					}
				}
                $("body").bind("click",selectLisener);
            }else if($(this).attr("data-selected") && $(this).attr("data-selected") == "true"){
                $(this).attr("data-selected","false");
                $("body").unbind("click",selectLisener);
            }
            event.stopPropagation();
        }
        function selectLisener(event){
            // 监听 点击范围不在下拉框范围内时收起
            var s = "Select";
            if($("[data-selected = 'true']").length > 0 && event.target.className.indexOf(s) < 0){
                $("[data-selected = 'true']").attr("data-selected","false");
                $("body").unbind("click",selectLisener);
            }else{
                // 监听 选择城市
                var tagName = "LI" || "A";
                var name = event.target.parentNode.className || event.target.parentNode.parentNode.className;
                if($("[data-chosecity = 'true']").length > 0 && event.target.tagName != tagName && name.indexOf(s) < 0){
                    $("[data-chosecity = 'true']").attr("data-chosecity","false");
                    $("body").unbind("click",selectLisener);
                }
            }
        }
        function selectLiClick(event){
            var text, parent = $(this).parent().parent('div');
            if(parent.attr("id") == "yearSelect"){
                text = $(this).text()+ "年"
            }else if(parent.attr("id") == "monthSelect"){
                text = $(this).text()+ "月"
            }else{
                text = $(this).text();
            }
            if(parent.children("span").length <= 0){
                var span = $("<span></span>").text(text);
                parent.prepend(span);
            }else{
                parent.children("span").eq(0).text(text).css("color","black");
            }
            $(this).attr("data-click","selected").siblings().attr("data-click","");
            $(this).parents('[data-selected]').find("input[type='hidden']").val($(this).attr("data-value"));
            event.stopPropagation()
        }
        function choseCity(event){
            $choseParent = $(this).next();
            if(!$(this).attr("data-chosecity") || $(this).attr("data-chosecity") == "false" && !$(this).attr("data-inputcity")){
                $("div [data-selected]").attr("data-selected","false");
                $(this).attr("data-chosecity","true");
                $choseParent.children(".leftSelect").scrollTop($choseParent.children(".leftSelect").find(".leftclick").index()*$choseParent.children(".leftSelect").find(".leftclick").height());

            }else if($(this).attr("data-chosecity") && $(this).attr("data-chosecity") == "true"){
                $(this).attr("data-chosecity","false");
            }
            $choseParent.find(".rightSelect").children('li').eq($choseParent.find(".leftSelect").children(".leftclick").index()).css("display","block");
            $("body").bind("click",selectLisener);
            event.stopPropagation();
        }
        function click_choseCity_leftSelect() {
            var index = $(this).index();
			$(this).addClass('leftclick').siblings().removeClass('leftclick');
			$choseParent.find(".rightSelect").children().eq(index).css('display','block').siblings().css('display','none')

        }
        function click_choseCity_rightSelect(){
        	if($(this).attr('id') == "defindCity"){
                $choseParent.prev().attr({
                    'data-chosecity':'false',
                    'data-inputcity':'true'
                });
                $choseParent.prev().find(".inputcity").focus().val("");
			}else{
                var text ;
                if($choseParent.find(".leftSelect .leftclick").index() == 0){
                	var attrStr = ".rightSelect [data-value='"+$(this).attr("data-value")+"']";
					var $index = $choseParent.find(attrStr).eq(1).parent().index();
					text = $index > 0 ? $choseParent.find(".leftSelect").children().eq($index).text() + $(this).text() : $(this).text();
				}else if($choseParent.find(".leftSelect .leftclick").index() > 0){
                	text = $choseParent.find(".leftSelect .leftclick").text() + $(this).text();
				} 		// 判断 城市省份
                $choseParent.prev().find("[type= 'hidden']").val($(this).attr("data-value")).attr("data-name",text);
                $(this).addClass("rightclick").siblings().removeClass("rightclick");
                $choseParent.prev().attr('data-chosecity','false');
                $choseParent.prev().find("span").text(text).css("color","black");
			}
        }
        function keydown_choseCity_input(event) {
            if($(this).css('display') == 'block' && event.keyCode == "13"){
                var text = $(this).val();
                $(this).blur();
                $choseParent.prev().removeAttr('data-inputcity');
                $choseParent.prev().find("span").text(text).css("color", "black");
                $choseParent.prev().find("[type= 'hidden']").attr("data-name",text).val("");
            }
        }
        function blur_choseCity_input(){
            var text = $(this).val();
            $choseParent.prev().removeAttr('data-inputcity');
            $choseParent.prev().find("span").text(text).css("color", "black");
            $choseParent.prev().find("[type= 'hidden']").attr("data-name",text).val("");
		}
        $(document).on('click','.select li',selectLiClick);
        $(document).on('click','.bSelect,.sSelect',selectBoxClick);
        $(".citySelect").on('click',choseCity);
        $(".leftSelect").on('click',"li",click_choseCity_leftSelect);
        $(".rightSelect").on('click','a',click_choseCity_rightSelect);
        $(".inputcity").on('keypress',keydown_choseCity_input);
        $(".inputcity").on('blur',blur_choseCity_input);
	},
    set_skillItem:function(){
        function add_skill_item(text){
        	var select;
            if($("body").attr("data-lang") == "en"){
                select = "<ul class='select'><li data-value='average'>Average</li><li data-value='good'>Good </li><li data-value='advanced'>Advanced</li><li data-value='expert'>Expert</li></ul>"
            }else{
                select = "<ul class='select'><li data-value='average'>一般</li><li data-value='good'>良好</li><li data-value='advanced'>熟练</li><li data-value='expert'>精通</li></ul>";
            }
            var $html = $("<div class='item-content'></div>").html("<span>"+ text +"</span><div class='bSelect'><span>选择掌握程度</span><input type='hidden'>"+ select +"</div><a href='javascript:;' class='closeDefind'></a>");
            var $lastchild =$("#skills-modal .addedSkill");
            $html.appendTo($lastchild);
        }
        $(document).on("click","#skillistBody a",function(){
            $("#addedSkill").css('display','block');
            var $this = $(this);
            var $text =$this.text();
            $this.remove();
            add_skill_item($text);
            var id=$(this).attr("id");
            var useNum=$(this).attr("data");
            $.ajax({
	             type: "GET",
	             url: "/cvresume/skill/updateNum/",
	             data:{"id":id},
	             success: function(result){
	            	if(result.type == "success"){
	            	
	            	 } else {
	            	 	alert("err");
	            	 }
	            	 
	             }
			 })
        });
        $(".skill-content #skillInput").on('keypress',function(event){
            if(event.keyCode == "13"){
                $("#addedSkill").css('display','block');
                var $text = $(this).val();
                if($text == ""){
                	layer.msg("亲，输入的技能特长不能为空噢~");
                	return;
                }
                add_skill_item($text);
                $(this).val('');
            }
        });
        var skillArr=[];
        $(document).on("click",".skillItem .edit,.skillItem .baseItem-null,.skillItem .skill-title",function(){
            cvmutual.main.get_skillToModal();
            $("#skills-modal").modal("show");
            var _language='zh';
            if(cvresume.info.language=="en"||common.main.getUrlParamsValue("language")=="en"){
            	_language='en';
            }
            if($("#skillistBody a").length==0){
            	$.get("/cvresume/skill/",{"language":_language},function(result){
					 if(result!=null&&result!=""){
						$("#skillistBody").append(result);
						$("#skillistBody a").each(function(i){
							 skillArr[i]=$(this).html();
						});
					 if($("#skillistBody a").length!=0 ){
						 $("#skillistBody a").each(function(index){
							  if($(this).index() < 10){
								  $(this).show()
							  }else{
								  $(this).hide();
							  }
						  })
					   }
					 }
			     })
              }else{
            	   $("#skillistBody").css('display','block')
              }
           
        });
        $("#skills-modal .modal-footer .submit").on('click',function(){//技能特长模态框
            var unSelect = false;
            if($("#addedSkill .item-content").length > 0){
                $("#addedSkill .item-content").each(function(){
                    if($(this).find(".bSelect span").text() == "选择掌握程度" || $(this).find(".bSelect span").text() == "level"){
                        $(this).find(".bSelect").addClass("unSelect");
                        $(".unSelect").each(function(){
                        	$(this).hover(function(){
                        		$(this).removeClass("unSelect")
							})
						})
                        unSelect = true;
                    }else{
                        $(this).find(".bSelect").removeClass("unSelect")
                    }
                });
			}
			if(unSelect == false){
                $(".skillItem .skill-con .skill-list").remove();
                if($("#addedSkill .item-content").length > 0){
                	var skills = [];
                	$(".skillItem .baseItem-null").css("display","none");
                	$("#addedSkill .item-content").each(function(i,item){
                		var skill = {};
                		skill["name"] = $(item).children('span').text();
                		skill["masterLevel"] = $(item).find("[type = 'hidden']").val();
                		skill["masterLevelDesc"] = $(item).find(".bSelect span").text();
                		skills.push(skill);
                	});
                	$(skills).each(function(i,item){
                    	var inner = $("<div class='skill-list moduleItemList'></div>").html("<span class='skill-title item_title'> " +
                            item["name"] +
                            " </span><span class='skill-slider item_level' data_level='" +
                            item["masterLevel"] +
                            "'><s><i class=' "
                            + item["masterLevel"] +
                            " '></i></s><span>" +
                            item["masterLevelDesc"] +
                            "</span></span><a class='delete'></a>");
                        inner.appendTo($(".skillItem .skill-con"));
                    });
                }else{
                	$(".skillItem .baseItem-null").css("display","block");
                }
                $("#skills-modal").modal('hide');
			}
		});
        $("#skills-modal .modal-footer .cancel").on('click',function(){
        	$("#skills-modal").modal('hide');
        	cvmutual.main.get_skillToModal();
		});
       
        // 换一批功能
        var test=0;
        $("#hh").click(function(){
            if(test==0){
            	 $("#skillistBody a").each(function(index){
					  if(index>10&&index<=20){
						  $(this).show()
					  }else{
						  $(this).hide();
					  }
				 })
				test++;
			}else if(test==1){
           	 $("#skillistBody a").each(function(index){
					  if(index>20&&index<=30){
						  $(this).show()
					  }else{
						  $(this).hide();
					  }
				 })
				test++;
			}else if(test==2){
	           	 $("#skillistBody a").each(function(index){
					  if(index>30&&index<=40){
						  $(this).show()
					  }else{
						  $(this).hide();
					  }
				 })
				test++;
			}else if(test==3){
	           	 $("#skillistBody a").each(function(index){
					  if(index<10){
						  $(this).show()
					  }else{
						  $(this).hide();
					  }
				 })
				test=0;
			}
        })
		/*
		 * $("#skills-modal .listFooter").on("click",function(){
		 * 
		 * 
		 * var changeArr = cvmutual.main.get_randomArr(skillArr , 10);
		 * $("#skills-modal .listBody a").remove(); for(var i in changeArr){ var
		 * inner = $("<a href='javascript:;'></a>").text(changeArr[i]);
		 * inner.appendTo($("#skills-modal .listBody")); } })
		 */
    },
	set_hobbyItem:function(){
        function addHobbys(icon,name){
    	   // var $Hicon = eval("hobbyIcon." + text) == undefined ? "&#xe70f;" : eval("hobbyIcon." + text);
    	    //console.log($Hicon);
            var dom = $("<div class='item-content' data-iconFont='"+icon+"'></div>").html("<span>"+ name +"</span><a href='javascript:;' class='closeDefind'></a>");
            dom.appendTo($(".addedHobby"));
        }
        $("#hobbys-modal").on('click','.listBody a',function(){
        	$(".addedHobby").css('display','block');
        	$(this).remove();
            var $text = $(this).text();
            var id=$(this).attr("id");
            var useNum=$(this).attr("data");
            var icon=$(this).attr("data-icon");
            var name=$(this).text();
            addHobbys(icon,name);
           $.ajax({
	             type: "GET",
	             url: "/cvresume/hobby/updateNum/",
	             data:{"id":id},
	             success: function(result){
	            	if(result.type == "success"){
	            	
	            	 } else {
	            	 	alert("err");
	            	 }
	            	 
	             }
			 })
            
        });
        $("#hobbys-modal .skillInput").on('keypress',function(event){
            if(event.keyCode == "13"){
            	var name = $(this).val();
            	if(!cvresume.main.is_empty(name)){
            		var icon="";
            		$("#hobby a[data-icon]").each(function(index,ele){
            			if($(ele).text()==name){
            				icon=$(ele).attr("data-icon");
            			}
            		})
            		var inner ="";
            		if(!cvresume.main.is_empty(icon)){
            			inner= $("<div class='item-content' data-iconfont='"+icon+"'></div>").html("<span>"+ name+"</span><a href='javascript:;' class='closeDefind'></a>")
            		}else{
            			inner = $("<div class='item-content' data-iconfont='&#xe70f;'></div>").html("<span>"+ name +"</span><a href='javascript:;' class='closeDefind'></a>");
            		}
            		$(".addedHobby").append(inner);
            	}
                $(this).val('')
            }
        });
	        $(document).on("click",".hobbyItem .edit,.hobbyItem .baseItem-null,.hobbyItem .hobby-title",function(){
	            cvmutual.main.get_hobbyToModal();
	            $("#hobbys-modal").modal("show");
	            var _language='zh';
	            if(cvresume.info.language=="en"||common.main.getUrlParamsValue("language")=="en"){
	            	_language='en';
	            }
	            if($("#hobby a").length==0){
	            	$.get("/cvresume/hobby/",{"language":_language},function(result){
	            		if(result!=null&&result!=""){
	            			$("#hobby").append(result);
	            			if($("#hobby a").length!=0 ){
	            				 $("#hobby a").each(function(index){
	            					 if($(this).index() < 16){
	   								  $(this).show()
	   							  }else{
	   								  $(this).hide();
		   							  }
		            					 
		            			 })
				             }
				        }
				    })
				}
	
	        
	        
	        });

        $("#hobbys-modal .modal-footer .submit").on('click', function () {//兴趣爱好	 	
	        	$(".hobbyItem .hobby-list").remove();
	        	if($("#hobbys-modal .addedHobby .item-content").length > 0){
	        		$(".hobbyItem .baseItem-null").hide();
		        	var hobbies = [];
		        	$("#addedHobby .item-content").each(function(i,item){
		        		var hobby = {};
		        		hobby["name"] = $(item).children('span').text();
		        		hobby["iconFont"] = $(item).attr("data-iconFont");
		        		hobbies.push(hobby);
		        	});
		        	$(hobbies).each(function(i,item){
	                	var key = cvmutual.main.makeId();
	                    var inner = $("<div class='hobby-list moduleItemList' id='"+ key +"'></div>").html("" +
						"<a class='wbdfont divIconFont' for-key='"+ key +"'>"+item.iconFont+"</a><span class='hobby-title item_title'> " +item.name+ " </span><a class='delete'></a>");
	                    inner.appendTo($(".hobbyItem .hobby-con"));
	                });
	        	}else{
	                $(".hobbyItem .baseItem-null").show();
			    }
			$("#hobbys-modal").modal('hide');
        });
        $("#hobbys-modal .modal-footer .cancel").on('click',function(){
        	$("#hobbys-modal").modal('hide');
        	cvmutual.main.get_hobbyToModal();
		});
        // 换一批功能
        var hl=0;
        $("#swap").click(function(){
            if(hl==0){
            	 $("#hobby a").each(function(index){
					  if(index>16&&index<=32){
						  $(this).show()
					  }else{
						  $(this).hide();
					  }
				 })
				hl++;
			}else if(hl==1){
           	 $("#hobby a").each(function(index){
					  if(index>32&&index<=48){
						  $(this).show()
					  }else{
						  $(this).hide();
					  }
				 })
				hl++;
			}else if(hl==2){
	           	 $("#hobby a").each(function(index){
					  if(index<16){
						  $(this).show()
					  }else{
						  $(this).hide();
					  }
				 })
				hl=0;
			}
        })
    },
    set_copyToClipBoard:function (str) {
        // 复制到剪贴板
    	 var copyInput = $("<input type='text' value='"+ str +"' style='opacity:1;position:absolute;top:20px;z-index:999;' id='copyText'>");
         $(".in").length >0 ? dom = $(".in")[0] : dom = "body"
         copyInput.appendTo(dom);
         document.getElementById("copyText").select();
         document.execCommand("copy",false,null)
         $("#copyText").remove();
    },
    set_portfolioModal:function () {
        function tipsTitle(){
            var val = $(this).val();
            if(val == ""){
                $(".inlineTitle").html("www.example.com")
            }else{
                $(".inlineTitle").html(val)
            }
        }
        function tipsContent(){
            var val = $(this).val();
            if(val == ""){
                $(".inlineContent").html("这里是作品描述")
            }else{
                $(".inlineContent").html(val)
            }
            cvmutual.main.portfolio_count()
        }
        $(".tipsTitle").eq(1).on('input',tipsTitle);
        $(".tipsContent").eq(1).on('input',tipsContent);
        $(".tipsContent").eq(0).on('input',cvmutual.main.portfolio_count)
        $(".showTab .textbtn").on("click",function(){
            var num = $(this).index();
            $(this).addClass("underlinebtn").siblings().removeClass("underlinebtn");
            $(".portfolio-show ul li").eq(num).css('display','block').siblings().css('display','none');
        });
    },
    set_reCommentCase:function (){
        function carouselAnimate(index, newIndex){		// 动画判定
            if(index < newIndex){
                $(".carousel-list .item").eq(index).addClass('leftOut');
                $(".carousel-list .item").eq(newIndex).addClass('rightIn');
            }else if(index > newIndex){
                $(".carousel-list .item").eq(index).addClass('rightOut');
                $(".carousel-list .item").eq(newIndex).addClass('leftIn');
            }
            // 动画过程中不可点击
            $("[data-slide = 'next']").removeClass("carousel-control");
            $("[data-slide = 'prev']").removeClass("carousel-control");
            $(".carousel-pointe li").off('click',indicatorsClick);
            cIndex = newIndex;
            control(newIndex);
        }
        function control(index){		// 顺序判定
            $(".carousel-pointe li").eq(index).addClass("active").siblings().removeClass("active");
            setTimeout(function(){
                // 动画后恢复点击
                if(index >= $(".carousel-list .item").length -1){
                    $("[data-slide = 'next']").removeClass("carousel-control");
                    $("[data-slide = 'prev']").addClass("carousel-control");
                }else if(index <= 0){
                    $("[data-slide = 'next']").addClass("carousel-control");
                    $("[data-slide = 'prev']").removeClass("carousel-control");
                }else{
                    $("[data-slide = 'next']").addClass("carousel-control");
                    $("[data-slide = 'prev']").addClass("carousel-control");
                }
                $(".carousel-pointe li").on('click',indicatorsClick);

                $(".carousel-list .item").removeClass('leftIn leftOut rightIn rightOut');
                $(".carousel-list .item").eq(index).addClass("active").siblings().removeClass("active");
            },1000)
            if(index >= $(".carousel-list .item").length -1){
                $("[data-slide = 'next']").addClass("Uncarousel-control");
                $("[data-slide = 'prev']").removeClass("Uncarousel-control");
            }else if(index <= 0){
                $("[data-slide = 'next']").removeClass("Uncarousel-control");
                $("[data-slide = 'prev']").addClass("Uncarousel-control");
            }else{
                $("[data-slide = 'next']").removeClass("Uncarousel-control");
                $("[data-slide = 'prev']").removeClass("Uncarousel-control");
            }


            event.stopPropagation();
        }
        function indicatorsClick(){
            var newIndex = $(this).index();
            carouselAnimate(cIndex,newIndex);
        }
        $("body").on('click',".carousel-control",function(){
            var cIndex = $(".carousel-list .active").index();
            if($(this).attr("data-slide") == "next"){
                var newIndex;
                if(cIndex+1 >= $(".carousel-list .item").length -1){
                    newIndex = $(".carousel-list .item").length -1;
                    $(this).attr("data-slide", "").addClass("Uncarousel-control").removeClass("carousel-control");
                    $("#reCase-caeousel .left").attr("data-slide","prev").addClass("carousel-control").removeClass("Uncarousel-control");
                }else{
                    newIndex = cIndex+1;
                    $(this).attr("data-slide", "next");
                    $("#reCase-modal .left").attr("data-slide","prev");
                }
                carouselAnimate(cIndex, newIndex);
            }else if($(this).attr("data-slide") == "prev"){
                var newIndex;
                if(cIndex-1 <= 0){
                    newIndex = 0 ;
                    $(this).attr("data-slide","").addClass("Uncarousel-control").removeClass("carousel-control");
                    $("#reCase-caeousel .right").attr("data-slide","next").addClass("carousel-control").removeClass("Uncarousel-control");
                }else{
                    newIndex = cIndex -1;
                    $(this).attr("data-slide","prev");
                    $("#reCase-modal .right").attr("data-slide","next").addClass("carousel-control").removeClass("Uncarousel-control");
                }
                carouselAnimate(cIndex,newIndex);
            }
        });
        $(document).on('click','.carousel-pointe li', indicatorsClick);
    },
	set_changLanguage:function () {
        var a ="language";
		var langBar = {
			"name" : {"zh" : "你的名字", "en":"Your Name"},
            "word" : {"zh" : "一句话介绍自己，告诉HR为什么选择你而不是别人", "en" : "Please Enter a summary"},
            "age" : {"zh" : "生日", "en":"Birthday"},
            "city" : {"zh" : "所在城市", "en":"City"},
            "experience" : {"zh" : "工作年限", "en":"Experience"},
            "phone" : {"zh" : "联系电话", "en":"Mobile"},
            "email" : {"zh" : "电子邮箱", "en":"Email"},
            "baseMsg" : {"zh" : "基本信息", "en" : "Information"},
            "homePage" : {"zh" : "个人主页", "en" : "Home"},
            "social" : {"zh" : "社交账号", "en" : "Social account"},
            "job" : {"zh" : "求职意向", "en" : "Job preferences"},
            "jobFun" : {"zh" : "意向岗位", "en" : "Function"},
            "jobType" : {"zh" : "职业类型", "en" : "Job Type"},
            "jobCity" : {"zh" : "意向城市", "en" : "Location"},
            "jobSalary" : {"zh" : "薪资要求", "en" : "Target Salary"},
            "jobTime" : {"zh" : "入职时间", "en" : "Duty Time"},
			"head": {"zh" : "头像" , "en" : "Head"},
			"letter" : {"zh" : "自荐信" , "en" : "Letter"},
			"cover" : {"zh" : "封面" , "en" : "Cover"},
            "edu" : {"zh" : "教育背景", "en" : "Education"},
            "exper" : {"zh" : "工作经验", "en" : "Work experience"},
            "intexper" : {"zh" : "实习经验", "en" : "Internship experience"},
            "volexper" : {"zh" : "志愿者经历", "en" : "Volunteer experience"},
            "proexper" : {"zh" : "项目经验", "en" : "Project experience"},
            "honor" : {"zh" : "荣誉奖项", "en" : "Honors & Awards"},
            "skill" : {"zh" : "技能特长", "en" : "Skills"},
			"addSkills" : {"zh" : "添加我的技能特长" , "en" : "Add skills"},
            "hobby" : {"zh" : "兴趣爱好", "en" : "Interests"},
			"addHobby" : {"zh" : "添加我的兴趣爱好" , "en" : "Add interests"} ,
            "portfolio" : {"zh" : "作品展示", "en" : "Portfolio"},
			"addPortfolio" :{"zh" : "添加我的作品" , "en" : "Add portfolio items"},
            "self" : {"zh" : "自我评价", "en" : "Summary"},
            "recoment" : {"zh" : "推荐信", "en" : "Recommendations"},
			"code":{"zh" : "二维码", "en" : "QR code"},
			"requestRecomment" : {"zh" : "邀请别人为你写推荐信" , "en" : "request a recommendation"},
            "ewm" : {"zh" : "感谢您的阅读，扫一扫查看我的手机简历", "en" : "please scan my resume"},
            "contact" : {"zh" : "联系我", "en" : "Contact"},
            "send" : {"zh" : "发送" , "en" : "Send"},
			"custom" : {"zh" : "添加自定义模块" , "en" : "add new templates"},
			"junior" : {"zh" : "初中及以下" , "en" : "Junior High and Below"},
			"height" : {"zh" : "高中" , "en" : "High School"},
			"technical" : {"zh" : "中技", "en" : "Technical School"},
            "polytechnic" : {"zh" : "中专", "en" : "Polytechnic"},
            "associate" : {"zh" : "大专", "en" : "Associate"},
            "bachelor" : {"zh" : "本科", "en" : "Bachelor"},
            "master" : {"zh" : "硕士", "en" : "Master"},
            "doctorate" : {"zh" : "博士", "en" : "Doctorate"},
			"noExp" : {"zh" : "无工作经验", "en" : "No expericence"},
            "one" : {"zh" : "1年", "en" : "1year"},
            "two" : {"zh" : "2年", "en" : "2years"},
            "three" : {"zh" : "3年", "en" : "3years"},
            "four" : {"zh" : "4年", "en" : "4years"},
            "five" : {"zh" : "5年", "en" : "5years"},
            "six" : {"zh" : "6年", "en" : "6years"},
            "seven" : {"zh" : "7年", "en" : "7years"},
            "eight" : {"zh" : "8年", "en" : "8years"},
            "nine" : {"zh" : "9年", "en" : "9years"},
            "ten" : {"zh" : "10年", "en" : "10years"},
            "moreTen" : {"zh" : "10年以上", "en" : "More than 10 years"},
			"male" : {"zh" : "男", "en" : "Male"},
            "female" : {"zh" : "女", "en" : "Female"},
            "umMarried" : {"zh" : "未婚", "en" : "Unmarried"},
            "married" : {"zh" : "已婚", "en" : "Married"},
            "private" : {"zh" : "保密", "en" : "Private"},
            "party" : {"zh" : "中共党员", "en" : "Party Member"},
            "probationaryParty" : {"zh" : "中共预备党员", "en" : "Probationary Party"},
            "league" : {"zh" : "共青团员", "en" : "League Member"},
            "demo" : {"zh" : "民主党派人士", "en" : "Democratic Party"},
            "noParty" : {"zh" : "无党派民主人士", "en" : "No Party"},
            "citizen" : {"zh" : "普通公民", "en" : "Citizen"},
            "full" : {"zh" : "全职", "en" : "Full-time"},
            "part" : {"zh" : "兼职", "en" : "Part-time"},
            "intern" : {"zh" : "实习", "en" : "Intern/Trainee"},
            "immediately" : {"zh" : "随时", "en" : "immediately"},
            "oneW" : {"zh" : "1周内", "en" : "within 1 week"},
            "oneM" : {"zh" : "1个月内", "en" : "within 1 month"},
            "threeM" : {"zh" : "3个月内", "en" : "within 3 month"},
            "determined" : {"zh" : "待定", "en" : "to be determined"},
            "average" : {"zh" : "一般", "en" : "Average"},
            "good" : {"zh" : "良好", "en" : "Good"},
            "advanced" : {"zh" : "熟练", "en" : "Advanced"},
            "expert" : {"zh" : "精通", "en" : "Expert"},
			"RMB" : {"zh" : "元/日" , "en" : "RMB/day"},
            "time" : {"zh" : "设置时间", "en" : "Time period"},
            "school" : {"zh" : "学校名称", "en" : "School name"},
            "major" : {"zh" : "专业名称", "en" : "Major..."},
            "description" : {"zh" : "描述", "en" : "Description..."},
            "organization" : {"zh" : "公司名称", "en" : "organization..."},
            "JobTitle" : {"zh" : "", "en" : "Job title..."},
            "contactTip" : {"zh" : "Hi，感谢您愿意花费一些时间来阅读我的简历，如果看完简历之后您对我仍然有兴趣，可以电话联系我，也可以直接在这里留言，我收到消息后会第一时间回复您。" , "en" : "Send me a message, and I'll get back to you shortly."},
            "contactName" : {"zh" : "怎么称呼您..." , "en" : "Enter your name..."},
            "contactEmail" : {"zh" : "填写您的联系方式..." , "en" : "Enter your email..."},
            "contactMsg" : {"zh" : "在这里填写正文..." , "en" : "Type a message..."}
		};
		// 切换英文简历
		function changeLang(){
			if(cvresume.info.language=="en"){
				$("body").attr("data-lang","en");
				if($("[data-textLang]").length > 0){
                    if(cvresume.main.is_empty(cvresume.info.resumeid)){
						$("[data-textLang]").each(function(){
							var key = $(this).attr("data-textLang"), text = eval("langBar." + key +".en");
                            $(this).text(text);
						});
                        $(".skill-list").eq(0).find(".skill-title").text("Skill");
                        $(".skill-list").eq(0).find(".skill-slider").find("span").text("level");
                        $(".hobby-list").eq(0).find("span").text("Intersts");
					}else{
                        $("[data-textLang]").each(function(){
                        	var classStr = "'"+$(this).attr("class")+"'";
                        	if (classStr.indexOf("module_item_title") < 0){
                                   var key = $(this).attr("data-textLang"), text = eval("langBar." + key +".en");
                                   $(this).text(text);
							}
						});
                        $(".headItem [data-textLang]").text(eval("langBar." +$(".headItem [data-textLang]").attr("data-textLang")+ ".en"));
                        $(".infoItem [data-textLang]").text(eval("langBar." +$(".infoItem [data-textLang]").attr("data-textLang")+ ".en"));
                        //$(".contactItem [data-textLang]").text(eval("langBar." +$(".contactItem [data-textLang]").attr("data-textLang")+ ".en"));
					}
					$("[data-placeLang]").each(function(){
						var key = $(this).attr("data-placeLang");
						var text = eval("langBar." + key + ".en");
						$(this).attr("data-placeholder",text);
					});
				}
			}
		};
		if(cvresume.info.language=="en"||common.main.getUrlParamsValue("language")=="en"){
			cvresume.main.set_language("en");
            changeLang();
            $(".r-createywbar a").find("span").text("创建中文简历");
		};
        // 创建英文简历提示
        $(document).on("click",".r-createywbar a",function(){
        	var $title = "确定创建英文简历吗？", $text = "当前简历我们将自动为你进行保存";
        	var language="en";
        	if(cvresume.info.language=="en"){
        		$title = "确定创建中文简历吗？";
        		language="";
        	}
        	var href="/cvresume/edit/?itemid="+cvresume.info.itemid+"&language="+language;
        	if(cvresume.main.is_empty(cvresume.info.resumeid)){
        		location.href=href;
        	}else{
        		cvmutual.main.resume_confirm({
                    title:$title,
                    content:$text,
                    onOk:function(){
    					location.href=href;
                    }
                });
        	}
        });

    },
	makeId:function(){
		var uuid = "";
           for (var i = 1; i <= 32; i++){
               var n = Math.floor(Math.random() * 16.0).toString(16);
               uuid += n;
               if(i == 8 || i == 12 || i == 16 || i == 20)
        		uuid += "";
        	}
        	return uuid;
	},                             
	get_randomArr:function (arr , length) {
        var indexArr=[];
        for (var num,i=0; i<length; i++){
            do{
                num=Math.floor(Math.random()*arr.length);
            }while(arr[num]==null);
            indexArr.push(arr[num]);
            arr[num]=null;
        }
        return indexArr;
    },
    get_infoToModal:function(){
        $(".wormItem").each(function(){
            $(this).children().unwrap()
        });
        if($(".name-con .name").text() == "你的名字" || $(".name-con .name").text() == "Your Name"){
            $("[data-panel='name']").val("")
        }else{
            $("[data-panel='name']").val($(".name-con .name").text())
        };      // name
        if($(".name-con .word").text() == "" || $(".name-con .word").text() ==  "Please Enter a summary"){
            $("[data-panel='one']").val("")
        }else{
            $("[data-panel='one']").val($(".name-con .word").text())
        }       // word
		if($(".resume_tag span").length > 0){
            $(".tag_item .pasted_tags .pasted_tag").remove();
        	$(".resume_tag span").each(function(){
        		var text = $(this).text(), $pasted_tag = $('<div class="pasted_tag"></a>').html(text + '<a href="javascript:;" class="delete_tag">');
        		$pasted_tag.appendTo($(".tag_item .pasted_tags"))
			})
            $(".tag_item .pasted_tags .pasted_tips i").text(3-$(".resume_tag span").length);
		}else{
			$(".tag_item .pasted_tags .pasted_tag").remove();
			$(".tag_item .pasted_tags .pasted_tips i").text(3);
		}		// tag
        if($(".info-age span").text() == "生日" || $(".info-age span").text() == "" || $(".info-age span").text() == "Birthday"){
            $("[data-panel='years']").prev().text("年份").removeAttr("style");
            $("[data-panel='years']").next().children().removeAttr("data-click");
            $("[data-panel='years']").val("");
            $("[data-panel='months']").prev().text("月份").removeAttr("style");
            $("[data-panel='months']").next().children().removeAttr("data-click");
            $("[data-panel='months']").val("");
        }else{
            // var age = $(".info-age span").text(), Bindex = age.indexOf(".");
            var age = $(".info-age span").attr("data-value"), Bindex = age.indexOf(".");
            $("[data-panel='years']").attr("value",age.substring(0,Bindex)).prev().text(age.substring(0,Bindex) + "年").css("color","black");
            $("[data-panel='months']").attr("value",age.substring(Bindex+1)).prev().text(age.substring(Bindex+1) + "月").css("color","black");
            $("[data-panel='years']").next().children("[data-value='"+age.substring(0,Bindex)+"']").attr("data-click","selected").siblings().removeAttr("data-click");
            $("[data-panel='months']").next().children("[data-value='"+age.substring(Bindex+1)+"']").attr("data-click","selected").siblings().removeAttr("data-click");
        }       // age
        if($(".info-city span").text() == "所在城市" || $(".info-city span").text() == "" || $(".info-city span").text() == "City"){
            $("[data-panel='city']").prev().prev().text("选择城市").removeAttr("style");
            $("[data-panel='city']").val("").attr("data-name", "");
            $("[data-panel='city']").parent().next().children().children().eq(0).addClass("leftclick").siblings().removeAttr("class");
            $("#baseMsg-modal [data-inputcity='true']").removeAttr("data-inputcity");
        }else{
            var city = $(".info-city span").text();
            $("[data-panel='city']").prev().prev().text(city).css("color","black");
            if(cvresume.main.is_empty($(".info-city span").attr("data-value"))){
            	$("#baseMsg-modal .doubleSelect .leftSelect").children().eq(0).addClass("leftclick").siblings().removeClass("leftclick");
                $("#baseMsg-modal .doubleSelect .rightSelect").children().eq(0).show().siblings().hide();
                $("#baseMsg-modal .doubleSelect .rightclick").removeClass("rightclick");
                $("[data-panel='city']").attr("data-name",city);
			}else{
                $("[data-panel='city']").attr({"data-name" : city, "value": $(".info-city span").attr("data-value")});
                var $right = $("[data-panel='city']").parent().next().find("[data-value='"+$(".info-city span").attr("data-value")+"']");
                var $index = $right.parent().index();
                $right.addClass("rightclick").siblings().removeClass("rightclick").parent().show().siblings().hide();
                $("[data-panel='city']").parent().next().children().eq(0).children().eq($index).addClass("leftclick").siblings().removeClass("leftclick");
			}
            $("#baseMsg-modal [data-inputcity='true']").removeAttr("data-inputcity");
        }       // city
        if( $(".info-phone span").text() == "联系电话" || $(".info-phone span").text() == "" || $(".info-phone span").text() == "Mobile"){
            $("[data-panel='phone']").val("")
        }else{
            $("[data-panel='phone']").val($(".info-phone span").text())
        }       // phone
        if($(".info-email span").text() == "电子邮箱" || $(".info-email span").text() == "" || $(".info-email span").text() == "Email"){
            $("[data-panel='email']").val("")
        }else{
            $("[data-panel='email']").val($(".info-email span").text())
        }       // email
        if( $(".info-work span").text() == "工作年限" || $(".info-work span").text() == ""){
            $("[data-panel='work']").prev().text("选择工作年限").removeAttr("style");
            $("[data-panel='work']").next().children().removeAttr("data-click");
            $("[data-panel='work']").val("");
        }else{
        	var Tindex, text;
        	if($(".info-work span").text() == "无工作经验" || $(".info-work span").text() == "No expericence"){
                text = $(".info-work span").text()
			}else if(cvresume.info.language=="en"||common.main.getUrlParamsValue("language")=="en"){
                Tindex = $(".info-work span").text().indexOf("expericence");
                text = $(".info-work span").text().substring(0, Tindex)
			}else{
                Tindex = $(".info-work span").text().indexOf("工作经验");
                text = $(".info-work span").text().substring(0,Tindex);
			};
            $("[data-panel='work']").attr("value",$(".info-work span").attr("data-value")).prev().text(text).css("color","black");
            $("[data-panel='work']").next().children("[data-value='"+$(".info-work span").attr("data-value")+"']").attr("data-click","selected").removeAttr("data-click");
        }       // work
        if( $(".info-sex span").text() == "性别" || $(".info-sex span").text() == ""){
            $("#sexB , #sexG").removeAttr("checked");
            $("[data-panel='sex']").val("")
        }else if($(".info-sex span").text() == "男"){
            $("#sexB").click();
            $("[data-panel='sex']").val(sex)
        }else if($(".info-sex span").text() == "女"){
            $("#seG").click();
            $("[data-panel='sex']").val(sex)
        }       // sex
        if($(".info-highedu span").text() == "最高学历" || $(".info-highedu span").text() == ""){
            $("[data-panel='highedu']").prev().text("选择最高学历").removeAttr("style");
            $("[data-panel='highedu']").next().children().removeAttr("data-click");
            $("[data-panel='highedu']").val("");
        }else{
            $("[data-panel='highedu']").attr("value",$(".info-highedu span").attr("data-value")).prev().text($(".info-highedu span").text()).css("color","black");
            $("[data-panel='highedu']").next().children("[data-value='"+$(".info-highedu span").attr("data-value")+"']").attr("data-click","selected").siblings().removeAttr("data-click");
        }       // highedu
        if($(".info-nation span").text() == "民族" || $(".info-nation span").text() == ""){
            $("[data-panel='nation']").val("");
        }else{
            $("[data-panel='nation']").val($(".info-nation span").text())
        }       // nation
        if($(".info-marital span").text() == "婚姻状况" || $(".info-marital span").text() == ""){
            $("[data-panel='marital']").prev().text("选择婚姻状况").removeAttr("style");
            $("[data-panel='marital']").next().children().removeAttr("data-click");
            $("[data-panel='marital']").val("")
        }else{
            $("[data-panel='marital']").attr("value",$(".info-marital span").attr("data-value")).prev().text($(".info-marital span").text()).css("color","black");
            $("[data-panel='marital']").next().children("[data-value='"+$(".info-marital span").attr("data-value")+"']").attr("data-click","selected").siblings().removeAttr("data-click");
        }       // marital
        if($(".info-status span").text() == "政治面貌" || $(".info-status span").text() == ""){
            $("[data-panel='status']").prev().text("选择政治面貌").removeAttr("style");
            $("[data-panel='status']").next().children().removeAttr("data-click");
            $("[data-panel='status']").val("")
        }else{
            $("[data-panel='status']").attr("value",$(".info-status span").attr("data-value")).prev().text($(".info-status span").text()).css("color","black");
            $("[data-panel='status']").next().children("[data-value='"+$(".info-status span").attr("data-value")+"']").attr("data-click","selected").siblings().removeAttr("data-click");
        }       // status
        if(cvresume.main.is_empty($(".info-height span").attr("data-value"))){
            $("[data-panel='height']").val("");
        }else{
            var height = $(".info-height span").attr("data-value");
            $("[data-panel='height']").val(height);
        }       // height
        if(cvresume.main.is_empty($(".info-weight span").attr("data-value"))){
            $("[data-panel='weight']").val("");
        }else{
            var weight = $(".info-weight span").attr("data-value");
            $("[data-panel='weight']").val(weight)
        }       // weight
        if($(".info-defind").length > 0){
            $(".defindItem").html("");
            var inner = "";
            $(".info-defind").each(function () {
                inner += "<div data-panel='defind' class='add' data-value='"+ $(this).attr("id") +"' data-iconFont='"+$(this).children(".divIconFont").text()+"'><input type='text' placeholder='字段名称' value='"
                    + $(this).find('a').attr('title')+
                    "' class='defindName' maxlength='5'><input type='text' placeholder='字段内容不超过20个字' maxlength='20' value='"
                    + $(this).find("span").text() +
                    "' class='defindContent'><a href='javascript:;' class='closeDefind'></a></div>";
            });
            inner += "<a href='javascript:;' class='openDefind' id='addDefind'>自定义字段</a>";
            $(".defindItem").html(inner);
        }else{
            // var inner = "<div data-panel='defind' class='add'><input type='text' placeholder='字段名称' class='defindName' maxlength='5'><input type='text' placeholder='字段内容不超过20个字' maxlength='20' class='defindContent'><a href='javascript:;' class='closeDefind'></a></div><a href='javascript:;' class='openDefind' id='openDefind'>自定义字段</a>";
            // $(".defindItem").html(inner);
        }       // defind
        if($(".home-con .home-list").length > 0){
        	$(".self_bar .self_list").remove();
            $(".home-con .home-list").each(function(){
        		var $self_list = $('<li class="self_list" data-panel="homePage"></li>').attr({
                    "data-value":$(this).find(".divIconFont").attr("for-key"),
					"data-iconFont":$(this).find(".divIconFont").text()
				}).html('<div class="self_list_header"></div><div class="self_list_body">' +
					'<input type="text" name="homeDesc" placeholder="添加主页描述（10字以内）" maxlength="10" value="' + $(this).find('.name').text() + '">' +
					'<input type="text" name="homeUrl" placeholder="输入个人主页" value="' + $(this).find('.name').attr('href') + '">' +
					'</div><div class="self_list_footer"></div>');
        		$self_list.appendTo($(".self_bar"))
			});
        }else{
            $(".self_bar .self_list").remove();
        }       // self
	},
	get_jobToModal:function(){
        $(".wormItem").each(function(){
            $(this).children().unwrap()
        });
        $(".inte-job span").text() == "意向岗位" || $(".inte-job span").text() == "Function" ? $("[data-panel= 'inteJob']").val("") : $("[data-panel= 'inteJob']").val($(".inte-job span").text());         // inteJob
        if($(".inte-type span").text() == "" || $(".inte-type span").text() == "Job Type"){
            $("[data-panel='inteType']").val("");
            $("[data-panel='inteType']").prev().text("选择职业类型").removeAttr("style");
            $(".salaryItem .daily").css("display","none");
            $(".salaryItem .monthly").css("display", "block");
        }else{
            var inteType = $(".inte-type span").text();
            $("[data-panel = 'inteType']").attr("value",$(".inte-type span").attr("data-value")).parent().find("span").text(inteType).css("color","black");
            $("[data-panel = 'inteType']").next().find("[data-value='"+$(".inte-type span").attr("data-value")+"']").attr("data-click","selected").siblings().attr("data-click","");
            if(inteType == "兼职" || inteType == "Part-time"){
                $(".salaryItem .daily").css("display","block");
                $(".salaryItem .monthly").css("display", "none");
            }else{
                $(".salaryItem .daily").css("display","none");
                $(".salaryItem .monthly").css("display", "block");
            }
        }               // inteType
        if($(".inte-city span").text() == "" || $(".inte-city span").text() == "Location"){
            $("[data-panel='chosecity']").val("").attr("data-name", "");
            $("[data-panel='chosecity']").parent().find("span").text("选择意向城市").removeAttr("style");
            $("[data-panel='chosecity']").parent().next().children().children().eq(0).addClass("leftclick").siblings().removeAttr("class");
            $("#jobIntension-modal [data-inputcity='true']").removeAttr("data-inputcity");
        }else{
            var city = $(".inte-city span").text();
            $("[data-panel='chosecity']").prev().prev().text(city).css("color","black");
            if(cvresume.main.is_empty($(".inte-city span").attr("data-value"))){
                $("#jobIntension-modal .doubleSelect .leftSelect").children().eq(0).addClass("leftclick").siblings().removeClass("leftclick");
                $("#jobIntension-modal .doubleSelect .rightSelect").children().eq(0).show().siblings().hide();
                $("#jobIntension-modal .doubleSelect .rightclick").removeClass("rightclick");
                $("[data-panel='chosecity']").attr("data-name",city);
            }else{
                $("[data-panel='chosecity']").attr({"data-name" : city, "value": $(".inte-city span").attr("data-value")});
                var $right = $("[data-panel='city']").parent().next().find("[data-value='"+$(".inte-city span").attr("data-value")+"']");
                var $index = $right.parent().index();
                $right.addClass("rightclick").siblings().removeClass("rightclick").parent().show().siblings().hide();
                $("[data-panel='chosecity']").parent().next().children().eq(0).children().eq($index).addClass("leftclick").siblings().removeClass("leftclick");
            }
            $("#jobIntension-modal [data-inputcity='true']").removeAttr("data-inputcity");
        }               // inteCity
        if($(".inte-price span").text() == "" || $(".inte-price span").text() == "Target Salary"){
            $(".salaryItem .daily input").val("");
            $(".salaryItem .monthly input").val("");
        }else if($(".inte-price span").text() == "薪资面议" || $(".inte-price span").text() == "Negotiable"){
                $(".salaryItem .negotiable input[type='checkbox']").prop("checked", true);
                $(".salaryItem .monthly input,.salaryItem .daily input").attr("disabled","disabled");
        }else{
            var intePrice = $(".inte-price span").text() , inteType = $(".inte-type span").text();
            if(inteType != "兼职" && inteType != "Part-time"){
                var Findex = intePrice.indexOf("K");
                var Sindex = intePrice.indexOf("-") == -1 ? -1: intePrice.indexOf("-") +1;
                $(".monthly input").eq(0).val(intePrice.substring(0, Findex));
                Sindex == -1? $(".monthly input").eq(1).val("") :  $(".monthly input").eq(1).val(intePrice.substring(Sindex, intePrice.length -1));
            }else if(inteType == "兼职"){
                var index = intePrice.indexOf("元");
                $(".salaryItem .daily input").val(intePrice.substring(0,index));
            }else if(inteType == "Part-time"){
                var index = intePrice.indexOf("RMB");
                $(".salaryItem .daily input").val(intePrice.substring(0,index));
                $(".salaryItem .daily span").text("RMB/day")
            }
        } 
        // intePrice
        if($(".inte-time span").text() == "" || $(".inte-time span").text() == "Duty Time"){
            $("[data-panel='inteTime']").val("");
            $("[data-panel='inteTime']").prev().text("选择入职时间").removeAttr("style");
        }else{
            $("[data-panel='inteTime']").attr("value",$(".inte-time span").attr("data-value")).prev().text($(".inte-time span").text()).css("color","black");
            $("[data-panel='inteTime']").next().find("[data-value='"+$(".inte-time span").attr("data-value")+"']").attr("data-click","selected").siblings().attr("data-click","")
        }               // inteTime
	},
	get_skillToModal:function(){
        $(".unSelect").each(function(){
            $(this).hover(function(){
                $(this).removeClass("unSelect")
            })
        })
        var editSkill = [];
        var select;
        if($("body").attr("data-lang") == "en"){
            select = "<ul class='select'><li data-value='average'>Average</li><li data-value='good'>Good </li><li data-value='advanced'>Advanced</li><li data-value='expert'>Expert</li></ul>"
		}else{
            select = "<ul class='select'><li data-value='average'>一般</li><li data-value='good'>良好</li><li data-value='advanced'>熟练</li><li data-value='expert'>精通</li></ul>";
		}
        if($(".skill-list").length > 0){
            $(".skill-list").each(function(){
                var skill = [];
                $(this).find(".skill-title").text() != "填写技能名称" ? skill.push($(this).find(".skill-title").text()) : skill = skill;
                $(this).find("[data_level]").length >0 && $(this).find("[data_level]").attr('data_level') != "" ? skill.push($(this).find("[data_level]").attr('data_level')) : skill = skill;
                skill.push($(this).find(".skill-slider").find("span").text());
                if(skill.length == 3){
                    editSkill.push(skill)
                }
            })
        }
        if(editSkill.length >0){
            $("#addedSkill .item-content").remove();
            for(var i=0; i<editSkill.length; i++){
                var str = $("<div class='item-content'></div>").html("<span >" + editSkill[i][0] + "</span><div class='bSelect' data-selected='false'><span style='color:black;'>" + editSkill[i][2] + "</span><input type='hidden' value='" + editSkill[i][1] + "'>"+ select +"</div><a href='javascript:;' class='closeDefind'></a>");
                str.find(".select").find("[data-value='"+editSkill[i][1]+"']").attr("data-click","selected");
                str.appendTo($("#addedSkill"));
            }
        }else{
            $("#addedSkill .item-content").remove();
        }
	},
	get_hobbyToModal:function(){
        $("#hobbys-modal .addedHobby .item-content").remove();
        if($(".hobbyItem .hobby-list").length >0){
            $(".hobbyItem .hobby-list").each(function(){
                var inner =  $("<div class='item-content' data-iconFont='"+$(this).children(".divIconFont").text()+"'></div>").html("<span>" + $(this).children(".hobby-title").text() + "</span><a href='javascript:;' class='closeDefind'></a>");
                inner.appendTo($("#hobbys-modal .addedHobby"))
            })
        }
	},
	caclulate_resume_scale:function(resume){// 计算简历制作进度
		if(!resume){
			resume = cvresume.main.get_resume();
		}
		var org_resume=null;
		if(window.localStorage){
			org_resume=JSON.parse(localStorage.getItem("resumeContentData"));
		}
		if(cvresume.main.is_empty(org_resume)){
			org_resume=cvmutual.main.init_default_resume();
		}
		var grade = 0;
		try{
			//基本信息
			if(common.main.isEffect(resume.resume_base_info.name,org_resume.resume_base_info.name)){//姓名
				grade+=3;
			}
			if(common.main.isEffect(resume.resume_base_info.birthYear,org_resume.resume_base_info.birthYear)){//生日
				grade+=3;
			}
			if(common.main.isEffect(resume.resume_base_info.cityName,org_resume.resume_base_info.cityName)){//所在城市
				grade+=2;
			}
			if(common.main.isEffect(resume.resume_base_info.jobYear,org_resume.resume_base_info.jobYear)){//工作年限
				grade+=2;
			}
			if(common.main.isEffect(resume.resume_base_info.mobile,org_resume.resume_base_info.mobile)){//电话号码
				grade+=3;
			}
			if(common.main.isEffect(resume.resume_base_info.email,org_resume.resume_base_info.email)){//联系邮箱
				grade+=3;
			}
			if(common.main.isEffect(resume.resume_base_info.minSummary,org_resume.resume_base_info.minSummary)){//一句话介绍自己
				grade+=1;
			}
			if(grade != 0){//当默认信息有填写时，补充信息分数才生效
				if(common.main.isEffect(resume.resume_base_info.sex,org_resume.resume_base_info.sex)){//性别
					grade+=1;
				}
				if(common.main.isEffect(resume.resume_base_info.education,org_resume.resume_base_info.education)){//学历
					grade+=1;
				}
				if(common.main.isEffect(resume.resume_base_info.nation,org_resume.resume_base_info.nation)){//民族
					grade+=1;
				}
				if(common.main.isEffect(resume.resume_base_info.marriageStatus,org_resume.resume_base_info.marriageStatus)){//婚姻
					grade+=1;
				}
				if(common.main.isEffect(resume.resume_base_info.politicalStatus,org_resume.resume_base_info.politicalStatus)){//政治面貌
					grade+=1;
				}
				if(common.main.isEffect(resume.resume_base_info.weight,org_resume.resume_base_info.weight) || common.main.isEffect(resume.resume_base_info.height,org_resume.resume_base_info.height)){//身高体重
					grade+=1;
				}
				if(common.main.isEffect(resume.resume_base_info.personalTags,org_resume.resume_base_info.personalTags)){//个人标签
					grade+=1;
				}
			}
			if((resume.resume_head.indexOf("1.jpg") == -1 && resume.modul_show.headShow == true)&&common.main.isEffect(resume.resume_head,org_resume.resume_head)){//头像
				grade+=3;
			}
			if(common.main.isEffect(resume.resume_job_preference.jobFunction,org_resume.resume_base_info.jobFunction)){//求职信息
				grade+=3;
			}
			if(common.main.isEffect(resume.resume_job_preference.jobType,org_resume.resume_base_info.jobType)){//求职类型
				grade+=2;
			}
			if(common.main.isEffect(resume.resume_job_preference.jobMinSalary,org_resume.resume_base_info.jobMinSalary)){//最低薪资
				grade+=2;
			}
			if(common.main.isEffect(resume.resume_job_preference.jobCityName,org_resume.resume_base_info.jobCityName)){//最高薪资
				grade+=2;
			}
			if(common.main.isEffect(resume.resume_job_preference.jobTime,org_resume.resume_base_info.jobTime)){//工作年限
				grade+=1;
			}
			if(resume.modul_show.resume_edu.isShow == true&&common.main.isEffect(resume.resume_edu,org_resume.resume_edu)){//教育背景
				grade+=10;
			}
			if(resume.modul_show.resume_work.isShow == true&&common.main.isEffect(resume.resume_work,org_resume.resume_work)){//工作经验
				var wordCount = 0;
				$.each(resume.resume_work,function(i,item){
					wordCount+=item.job.replace(/<[^>]+>/g,"").length;
					wordCount+=item.unit.replace(/<[^>]+>/g,"").length;
					wordCount+=item.content.replace(/<[^>]+>/g,"").length;
					
				});
				wordCount > 100 ? grade+=20 : grade+=12;
			}
			if(resume.modul_show.resume_internship.isShow == true&&common.main.isEffect(resume.resume_internship,org_resume.resume_internship)){//实习经验
				var wordCount = 0;
				$.each(resume.resume_internship,function(i,item){
					wordCount+=item.job.replace(/<[^>]+>/g,"").length;
					wordCount+=item.unit.replace(/<[^>]+>/g,"").length;
					wordCount+=item.content.replace(/<[^>]+>/g,"").length;
					
				});
				wordCount > 100 ? grade+=20 : grade+=12;
			}
			if(resume.modul_show.resume_project.isShow == true&&common.main.isEffect(resume.resume_project,org_resume.resume_project)){//项目经验
				var wordCount = 0;
				$.each(resume.resume_project,function(i,item){
					wordCount+=item.job.replace(/<[^>]+>/g,"").length;
					wordCount+=item.unit.replace(/<[^>]+>/g,"").length;
					wordCount+=item.content.replace(/<[^>]+>/g,"").length;
					
				});
				wordCount > 100 ? grade+=20 : grade+=12;
			}
			if(resume.modul_show.resume_volunteer.isShow == true&&common.main.isEffect(resume.resume_volunteer,org_resume.resume_volunteer)){//自愿者经验
				grade+=6;
			}
			if(resume.modul_show.resume_summary.isShow == true&&common.main.isEffect(resume.resume_summary,org_resume.resume_summary)){//自我评价
				grade+=8;
			}
			if(resume.modul_show.resume_honor.isShow == true&&common.main.isEffect(resume.resume_honor,org_resume.resume_honor)){//奖项荣誉
				grade+=8;
			}
			if(resume.modul_show.resume_hobby.isShow == true&&common.main.isEffect(resume.resume_hobby,org_resume.resume_hobby)){//兴趣爱好
				grade+=6;
			}
			if(resume.modul_show.resume_skill.isShow == true&&common.main.isEffect(resume.resume_skill,org_resume.resume_skill)){//技能特长
				grade+=8;
			}
			if(resume.modul_show.resume_portfolio.isShow == true&&(common.main.isEffect(resume.resume_portfolio.img,org_resume.resume_portfolio.img)||common.main.isEffect(resume.resume_portfolio.link,org_resume.resume_portfolio.link))){//作品展示
				grade+=5;
			}
			if(resume.modul_show.coverShow == true&&common.main.isEffect(resume.resume_cover,org_resume.resume_cover)){//封面
				grade+=3;
			}
			if(resume.modul_show.letterShow == true&&common.main.isEffect(resume.resume_letter,org_resume.resume_letter)){//自荐信
				grade+=3;
			}
			if(resume.custom.length > 0){
				grade+=6;
			}
			var _falseGrade;
			if(grade <= 80){
				_falseGrade = grade;
			}else{//80-160
				_falseGrade = 80 + Math.ceil((grade - 80) / 5);
			}
			$(".resume_power .power_level_name").text(_falseGrade + "分");
			$(".resume_power .resume_power_progress i").css("width", _falseGrade + "%");
			$(".r-viewbar .number").attr("data-value", grade);
			if(_falseGrade>=0 && _falseGrade<=30){
			    $(".wbdCv-leftbar .resume_power_p").html("简历是展示自己的第一<br>舞台，快用心填写吧！")
            }else if(_falseGrade>30 && _falseGrade<=50){
                $(".wbdCv-leftbar .resume_power_p").html("您的简历能多吸引hr两秒<br>啦，继续努力吧！")
            }else if(_falseGrade>50 && _falseGrade<=70){
                $(".wbdCv-leftbar .resume_power_p").html("再仔细检查下哦，一定还<br>可以继续完善呢！")
            }else if(_falseGrade>70 && _falseGrade<=85){
                $(".wbdCv-leftbar .resume_power_p").html("真是棒棒哒，但简历内容<br>还可以更充实哦！")
            }else if(_falseGrade>85 && _falseGrade<=100){
                $(".wbdCv-leftbar .resume_power_p").html("您的简历竞争力不错呢，<br>快去申请职位吧！")
            }
		}catch(e){
			console.log("计算比例出错~"+e);
		}
	},
	resume_download:function(){
		$(document).on("click","#downloadPDFBtn:not(.wbd-vip-lock)",function(){
			if(cvresume.main.is_empty(cvresume.info.resumeid)){
				layer.msg("亲，没有编辑简历不能导出哦~");
				return;
			}
			if(!cvresume.info.downloadFlag){
				// 请求判断一下是否具有下载权限，没有，则弹框提示
				$.ajax({type : "get",
    	    		cache: false,
    	    		async : false,
    	    		url : "/cvresume/get_download_url/"+cvresume.info.resumeid+"/",
    	    		success : function(message) {
    	    			if(message.type=="success"){
							cvresume.info.downloadUrl=message.content;
							cvresume.info.downloadFlag=true
						}else{
							layer.msg(message.content);
						}
    	    		}
    	    	});
			}
			if(cvresume.info.downloadFlag){
				var timestr=new Date().getTime();
				var reg=/_\d*\.pdf/;
				cvresume.info.downloadUrl=cvresume.info.downloadUrl.replace(reg,"_"+timestr+".pdf");
				window.open(cvresume.info.downloadUrl);
				$("#downloadPDF").modal("show");
				setTimeout(function(){
					$("#downloadPDF").modal("hide");
				},1000)
			}
		});
	},
	content_data_put_local_stroage:function(){
		if(!cvresume.main.is_empty(cvresume.info.resumecontentid)){
			if (window.localStorage) {
			    localStorage.setItem("resumeContentData",JSON.stringify(cvresume.main.get_resume()));	
			} else {
			   console.log("浏览器版本太低，无法使用localStorage");	
			}
		}
	},
	init_default_resume:function(){// 获取初始化的resume结构
		var resume=JSON.parse('{"resume_language":"zh","resume_set":{"color":"j2","font":"yahei","fontSize":"14","padding":"1.5","fontType":"0"},"modul_show":{"letterShow":false,"coverShow":false,"headShow":true,"contactShow":false,"resume_head":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"头像","key":"resume_head"},"base_info":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"基本信息","key":"base_info"},"base_home":{"isShow":false,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"个人主页","key":"base_home"},"base_social":{"isShow":false,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"社交账号","key":"base_social"},"resume_skill":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"技能特长","key":"resume_skill"},"resume_hobby":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"兴趣爱好","key":"resume_hobby"},"resume_job_preference":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"求职意向","key":"resume_job_preference"},"resume_edu":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"教育背景","key":"resume_edu"},"resume_work":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"工作经验","key":"resume_work"},"resume_internship":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"实习经验","key":"resume_internship"},"resume_volunteer":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"志愿者经历","key":"resume_volunteer"},"resume_project":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"项目经验","key":"resume_project"},"resume_honor":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"荣誉奖项","key":"resume_honor"},"resume_summary":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"自我评价","key":"resume_summary"},"resume_portfolio":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"作品展示","key":"resume_portfolio"},"resume_recoment":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"推荐信","key":"resume_recoment"},"resume_qrcode":{"isShow":true,"isTitleShow":true,"isTimeShow":true,"isContentShow":true,"title":"二维码","key":"resume_qrcode"}},"iconFontMap":{"resume_head":"","base_info":"","birth":"","city":"","mobile":"","email":"","jobYear":"","sex":"","education":"","nation":"","marriageStatus":"","politicalStatus":"","height":"","weight":"","base_home":"","base_social":"","resume_skill":"","resume_hobby":"","resume_name":"","resume_job_preference":"","jobFunction":"","jobType":"","jobCity":"","jobSalary":"","jobTime":"","resume_edu":"","resume_work":"","resume_internship":"","resume_volunteer":"","resume_project":"","resume_honor":"","resume_summary":"","resume_portfolio":"","resume_recoment":"","resume_qrcode":""},"resume_cover":[],"resume_head":"http://static.test.com/resources/500d/cvresume/images/1.jpg","resume_base_info":{"customMsg":[],"customWebsite":[]},"resume_job_preference":{},"resume_skill":[],"resume_hobby":[],"resume_edu":[],"resume_work":[],"resume_internship":[],"resume_volunteer":[],"resume_project":[],"resume_portfolio":{"img":[],"link":[]},"custom":[],"sort":{"left":["resume_head","base_info","base_home","base_social","resume_skill","resume_hobby"],"top":[],"right":["resume_name","resume_job_preference","resume_edu","resume_work","resume_internship","resume_volunteer","resume_project","resume_honor","resume_summary","resume_portfolio","resume_recoment","resume_qrcode"],"bottom":[]},"resume_contact":{},"resume_qrcode":{"qrcodeTips":"感谢您的阅读，扫一扫查看我的手机简历"}}');
		return resume;
	},
	check_input: function(){
		var check_input = false;
        var phone = $("[data-panel='phone']").val().trim(),
			email = $("[data-panel='email']").val(),
			check_tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
			check_phone = /^((\+86)|(86))?(-| )*(1)\d{2}(-| )*\d{4}(-| )*\d{4}$/,
			check_email = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

        $("[data-panel='height'], [data-panel='weight'], .monthly input, .daily input").on('input',function(){
			var val = $(this).val();
			if(isNaN(Number(val))){
				$(this).addClass("NaN");
			}else{
                $(this).removeClass("NaN");
			}
		});

		if(phone.length > 0 && (!check_tel.test(phone) && !check_phone.test(phone))){
            $("[data-panel='phone']").parent().addClass("wrong_input");
            check_input = true;
		}else{
            $("[data-panel='phone']").parent().removeClass("wrong_input");
		}
		if(email.length > 0 && !check_email.test(email)){
            $("[data-panel='email']").parent().addClass("wrong_input");
            check_input = true;
		}else{
            $("[data-panel='email']").parent().removeClass("wrong_input");
		}
		return check_input;
	},
    portfolio_count:function(){
		$("#portfolio-modal textarea").each(function(){
			var number = $(this).val().length;
			$(this).parent(".portfolio-tips").find("span").text(number)
		})
	},
    tips_event:function(){//小贴士       
        //点击小贴士显示按钮事件
        $(document).on("click",".cvresume_right_bar .tips_bar",function(){
            $(".tips_bar_modal").css("right","0px");
        });       
        //点击小贴士关闭按钮事件
        $(document).on("click",".tips_bar_modal .close,.headimg .close,.headimg-content .modal-footer .button",function(){
        	cvmutual.tips_show = false;
            cvmutual.main.close_tips_event();
        });       
        //点击小贴士内容列表显示隐藏事件
        $(document).on("click",".tips_content_text .list .title",function(){
            var $thislist = $(this).parent(".list");
            if($thislist.hasClass("show")){
                $thislist.removeClass("show");
                $thislist.siblings(".list").removeClass("show");
            }else{
                $thislist.addClass("show");
                $thislist.siblings(".list").removeClass("show");               
            }
        });
        //点击小贴士选择下拉框事件
        $(document).on("click",".tips_content_select span",function(){
            if($(this).siblings("ul").css("display") == "none"){
                $(this).siblings("ul").css("display","block");
            }else{
                $(this).siblings("ul").css("display","none");
            }            
            return false;
        });
        $(document).on('click',function(){
            $(".tips_content_select ul").css("display","none");
        });        
        $(document).on("click",".tips_content_select ul li",function(){
            var $text = $(this).text();
            var $id = $(this).attr("data-select-id");
            $(this).addClass("selected").siblings().removeClass("selected");
            $(this).parent("ul").css("display","none");
            $(this).parent("ul").siblings("span").text($text);
            $(".tips_content_text ul li[data-list-id="+$id+"]").addClass("selected").siblings().removeClass("selected");
        });
        //点击模块显示小贴士事件
        $(document).on("click",".moduleItem",function(){
        	if($(this).hasClass("customItem")){
        		return;
        	}
            if($(this).hasClass("bInfoItem")){
                $(".tips_content_select ul li[data-select-id='base_info']").addClass("selected").siblings().removeClass("selected");                                
                $(".tips_content_select span").text("基本信息");
                $(".tips_content_text ul li[data-list-id='base_info']").addClass("selected").siblings().removeClass("selected");                             
            }else if($(this).hasClass("ewmItem")){
            }else{
            	var $id;
                if($(this).hasClass("coverItem") || $(this).hasClass("letterItem")){
                    $id = $(this).parent().attr("id"); 
                }else{
                    $id = $(this).attr("id");
                }
                var $text = $(".tips_content_select ul li[data-select-id="+$id+"]").text();
                $(".tips_content_select ul li[data-select-id="+$id+"]").addClass("selected").siblings().removeClass("selected");                                
                $(".tips_content_select span").text($text);
                $(".tips_content_text ul li[data-list-id="+$id+"]").addClass("selected").siblings().removeClass("selected");
            }
            if(!cvmutual.tips_show){
        		return;
        	}
            $(".tips_bar_modal").css("right","0px");
        });      
    },
    close_tips_event:function(){
        setTimeout(function () { 
            $(".tips_bar_modal").css("right","-320px");
            setTimeout(function () { 
                //初始化
                $(".tips_content_select ul li[data-select-id='base_info']").addClass("selected").siblings().removeClass("selected");                                
                $(".tips_content_select span").text("基本信息");
                $(".tips_content_text ul li[data-list-id='base_info']").addClass("selected").siblings().removeClass("selected");                             

            }, 500);
        }, 200);	
    },
    change_style:function(){
        $(".moduleItem").each(function(){
            if($(this).find(".recovery_style").length > 0 && $(this).hasClass("template_css")){
                $(this).find(".recovery_style").addClass("no_revert")
            }
        }); // 遍历模块，判断恢复样式按钮是否可点击
 	    $(document).on("click",".baseItem-toolbar span.change_style",function(){
 	    	var $this=$(this).parents(".moduleItem");
 	    	var _type = $this.attr("id");
 	    	if($("html").hasClass("ie9")){
 	    		layer.msg("当前浏览器内核为ie9,请更换浏览器,或切换至极速模式,体验更佳.");
 	    	}
 	    	if($this.hasClass("customItem")){
 	    		if($this.hasClass("descItem")){
 	    			_type="resume_custom_descItem";
 	    		}else{
 	    			_type="resume_custom_timeItem";
 	    		}
 	    	}
 	    	var _modelType=$(".itemType").val();
 	        $("#change_parts_style").modal("show").attr("data-selected",_type);
 	       $("#change_parts_style").find(".modal-body div").remove();
 	        // 异步加载模块样式
 	        $.get("/cvresume/model_list/",{"type":_type,"moType":_modelType},function(result){
 	        	if(result!=null){
					$("#change_parts_style").find(".modal-body").append(result);
				}
 	        })
        }); // 点击唤醒更换模块弹框
 	    $(document).on("click",".change_parts_style .parts_style_list a",function(){
            $("#change_parts_style").modal("hide");
 	    	var _type = $("#change_parts_style").attr("data-selected"), _parts_css = $(this).parent().attr("data-parts"), $target = $("#"+_type);
 	    	var _data=$target.attr("data-parts");
 	    	if($("html").hasClass("ie9")){
 	    		layer.msg("当前浏览器内核为ie9,请更换浏览器,或切换至极速模式,体验更佳.");
 	    	}	    	
 	    	if(getCookie("change_confirm") == undefined){
                // 弹出确认弹框，确认后才替换模块样式
                common.main.resume_confirm({
                    title:"确定更换此模块样式？",
                    content_html:"<span class='tips-content'>更换后当前内容不变，但样式将被替换，如需恢复初始样式请在设置中操作。</span><label class='neverNotfy'><input type='checkbox' id='checkedNotfy' class='checkedNotfy'><span>不再提醒</span></label>",
                    tips_modal_class:"confirm_modal",
                    modal_class:"tips-modal-content change_parts_confirm",
                    onOk:function(){
                        if($(".tips-modal-content .neverNotfy>input:checked").length > 0){
                        	addCookie("change_confirm",true);
						}
                        if(_data!=""&&_data!=null){
                        	$target.removeClass(_data).addClass(_parts_css).attr("data-parts",_parts_css);
                        }else{
                        	$target.removeClass("template_css").addClass(_parts_css).attr("data-parts",_parts_css);
                        }
                        $target.find(".recovery_style").removeClass("no_revert");
                        cvresume.main.delay_resume_save();
                    }
                });
			}else{
                // 不弹出确认弹框，直接替换模块样式
                $("#change_parts_style").modal("hide");
                $target.removeClass(_data).addClass(_parts_css).attr("data-parts",_parts_css);
                $target.find(".recovery_style").removeClass("no_revert");
                cvresume.main.delay_resume_save();
			}

        }); // 替换模块样式
 	    $(document).on("click",".baseItem-toolbar .recovery",function(){
 	    	var _data=$(this).parents(".moduleItem").find(".module_item_title").attr("data-placeholder");
	    	common.main._500dtongji(_data);
	    	$(this).attr("data_track",_data);
 	        if($(this).parents(".recovery_style").hasClass("no_revert")){
 	            return null
            }else{
                var $this = $(this).parents(".moduleItem"), _parts = $this.attr("data-parts");
                if(!common.main.is_empty(_parts) && _parts != "template_css"){
                    $this.removeClass(_parts).addClass("template_css").attr("data-parts","template_css");
                    $(this).parents(".recovery_style").addClass("no_revert")
                }
            }
        }); // 恢复模块样式
    },
	change_head_size:function(){
 		function head_size_lisener(e) {
			var $target = $(event.srcElement);
            if($target.hasClass("head_size_option")){
                $(".wbdCv-baseStyle .headItem").attr("data-size",$target.attr("data-size"));
                $target.addClass("checked").siblings().removeClass("checked");
                $(".head_size_selector").hide();
                cvresume.main.delay_resume_save();
            } else if(!$target.hasClass("head_size_selector") && !$target.parent().hasClass("head_size_selector") && !$target.hasClass("head_size_edit")){
                $(".head_size_selector").hide();
            }
            $(document).off("click",head_size_lisener);
        }
        $(".head_size_edit").on("click",function(e){
        	common.main._500dtongji("PC-CV6.5.0-在线制作-文档编辑页-简历编辑区-简历头像-设置按钮");
            var _head_size = $(".wbdCv-baseStyle .headItem").attr("data-size") ? $(".wbdCv-baseStyle .headItem").attr("data-size") : "rectangle";
            if($(".head_size_selector").is(":hidden")){
                $(".head_size_option[data-size="+_head_size+"]").addClass("checked").siblings().removeClass("checked");
                $(".head_size_selector").show();
                $(document).on("click",head_size_lisener);
            }else{
                $(".head_size_selector").hide();
                $(document).off("click",head_size_lisener);
            }
            e.stopPropagation()
        });
 		$(".wbdCv-baseStyle .headItem").mouseleave(function(){
            $(".head_size_selector").hide();
            $(document).off("click",head_size_lisener);
        })

    },
	resume_diagnose:function(){
 	    var _diagnose_arr = [];
 	    function check_time_modul(modal_arr,min_length, max_length){
 	        var _result = {};
 	        _result._has_time = true;   //  判断是否存在 时间
 	        _result._has_unit = true;   //  判断是否存在 学校|公司
 	        _result._has_job = true;   //  判断是否存在 职位|角色|专业
 	        _result._has_content = true;   //  判断是否存在内容
 	        _result._un_less_content = true;   //  判断内容是否过短
 	        _result._un_over_content = true;   //  判断内容是否超出
 	        _result._time_sort = true;   //  判断时间排序是否正确
 	        _result._un_key_word = true;   //  判断是否存在关键词
 	        var _max_time = "";
 	        for(var i in modal_arr){
 	            var _time = modal_arr[i].beginTime, _unit = modal_arr[i].unit, _job = modal_arr[i].job, _content = modal_arr[i].content.replace(/&nbsp;| |<\/?.+?>/g,"");
 	            if(common.main.is_empty(_time)){_result._has_time = false}
                if(common.main.is_empty(_unit)){_result._has_unit = false}
                if(common.main.is_empty(_job)){_result._has_job = false}
                if(common.main.is_empty(_content)){
 	                _result._has_content = false
 	            }else{
 	                if(common.main.is_empty(min_length) && _content.length < min_length){_result._un_less_content = false}
 	                if(common.main.is_empty(max_length) && _content.length > max_length){_result._un_over_content = false}
 	                if(_content.indexOf("我") || _content.indexOf("我们") || _content.indexOf("你") || _content.indexOf("你们") || _content.indexOf("他") || _content.indexOf("他们") || _content.indexOf("她") || _content.indexOf("她们") || _content.indexOf("它") || _content.indexOf("它们")){
 	                    _result._un_key_word = false;
                    }
                }
            }   //  遍历数组，判断时间、公司、职位和内容
            if(_result._has_time){
 	            for(var j in modal_arr){
                    var _time = modal_arr[i].beginTime;
                    if(_max_time !=="" && _time>_max_time){
                        _result._time_sort = false;
                    }else{
                        _max_time = _time;
                    }
                }
            }   // 单独判断时间排序
            return _result;
        }
 	    function diagnose(){
 	        /**
             * 针对分数 type：default
             * 针对模块 type：modal_title
             *
             * {        type:"modal_title",
                        modal_title:"【头像】",
                        content:"还没有上传照片哦！}
             * */

            var _resume =cvresume.main.get_resume(), _grade = Number($(".power_level_name").attr("data-value"));
            var _diagnose_arr = [];
            var _un_key_word = true;
            if(_grade > 80){
                // 简历诊断空状态
                _diagnose_arr.push({
                    type:"default",
                    modal_title:"",
                    content:"你的简历已经很好了，智能系统暂时无它改进建议，或许您可以邀请HR行家帮您的简历进行进一步优化。<a href='http://www.500d.me/customize/'>立即前往></a>"
                })
            }else{
                if(_grade < 40){
                    _diagnose_arr.push({
                        type:"default",
                        modal_title:"",
                        content:"你的简历可能太简单了，多参考一下贴士，想想怎样更好地介绍自己吧！"
                    })
                }
                if(_resume.modul_show.letterShow && undefined != _resume.resume_letter && common.main.is_empty(_resume.resume_letter.replace(/&nbsp;| |<\/?.+?>/g,""))){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【自荐信】",
                        content:"你还没有对自荐信进行描述哦！如不需要该模块，可选择隐藏。"
                    })
                } // 判断自荐信
                if(_resume.modul_show.headShow){
                    if(_resume.resume_head === "/resources/500d/cvresume/images/1.jpg"){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【头像】",
                            content:"还没有上传照片哦！"
                        })
                    }   //  判断简历头像是否为空
                }else{
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【头像】",
                        content:"添加头像能让hr更好地记住你！"
                    })  //  判断简历头像是否隐藏
                }   // 判断简历头像
                if(common.main.is_empty(_resume.resume_base_info.name)){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【基本信息】",
                        content:"还没有写姓名！"
                    })
                }else if(_resume.resume_base_info.name === "五百丁"){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【基本信息】",
                        content:"简历上写明自己的真实姓名。"
                    })
                }   //  判断输入姓名是否合法
                if(common.main.is_empty(_resume.resume_base_info.city)){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【基本信息】",
                        content:"写明所在城市能更好的吸引同地区企业的关注！"
                    })
                }   //  判断是否选择城市
                if(common.main.is_empty(_resume.resume_base_info.jobYear)){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【基本信息】",
                        content:"写明工作年限能提高与hr的沟通效率！"
                    })
                }   //  判断是否选择工作年限
                if(common.main.is_empty(_resume.resume_base_info.mobile)){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【基本信息】",
                        content:"不写电话号码小心接不到面试通知哦！"
                    })
                }   //  判断是否填写电话号码
                if(common.main.is_empty(_resume.resume_base_info.email)){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【基本信息】",
                        content:"写明常用邮箱能更方便hr联系到你。"
                    })
                }   //  判断是否填写邮箱
                if(common.main.is_empty(_resume.resume_base_info.minSummary)){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【基本信息】",
                        content:"一句话介绍自己，告诉HR为什么选择你而不是别人。"
                    })
                }   //  判断是否填写一句话描述
                if(_resume.modul_show.resume_job_preference.isShow){
                    if(common.main.is_empty(_resume.resume_job_preference.jobFunction)){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【求职意向】",
                            content:"结合简历内容写明意向岗位能让hr一眼看到你的简历！"
                        })
                    }else if(_resume.resume_job_preference.jobFunction.length > 10){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【求职意向】",
                            content:"建议一份简历只针对一个意向岗位，请检查是否需要修改。"
                        })
                    }   //  判断求职岗位是否合法
                    if(common.main.is_empty(_resume.resume_job_preference.jobType)){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【求职意向】",
                            content:"职业类型能体现你的目标工作性质，帮助hr更好地进行筛选。"
                        })
                    }   //  判断是否填写职业类型
                    if(common.main.is_empty(_resume.resume_job_preference.city)){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【求职意向】",
                            content:"意向城市可以强调你想工作的地区。"
                        })
                    }   //  判断是否填写意向城市
                    if(common.main.is_empty(_resume.resume_job_preference.jobTime)){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【求职意向】",
                            content:"如实填写到岗时间可以让hr更好地与您协作!"
                        })
                    }   //  判断是否添加入职时间
                    if(common.main.is_empty(_resume.resume_job_preference.jobMinSalary) && common.main.is_empty(_resume.resume_job_preference.jobMaxSalary)){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【求职意向】",
                            content:"写明薪资要求，降低与hr的沟通成本!"
                        })
                    }   //  判断是否添加薪资要求
                }else{
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【求职意向】",
                        content:"添加求职意向，让整张简历的重点更突出！"
                    })  //  判断求职意向隐藏
                }   // 判断求职意向
                if(_resume.modul_show.resume_edu.isShow){
                    //  当教育背景模块显示时判断内容是否合法
                    if(_resume.resume_edu.length <= 0){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【教育背景】",
                            content:"时间模块必须按照真实经历准确填写。"
                        },{
                            type:"modal_title",
                            modal_title:"【教育背景】",
                            content:"学校名称在教育背景中不可或缺，请补充填写。"
                        },{
                            type:"modal_title",
                            modal_title:"【教育背景】",
                            content:"别忘记正确填写专业名称。"
                        },{
                            type:"modal_title",
                            modal_title:"【教育背景】",
                            content:"描述应尽量简洁、突出重点，建议参考贴士学习填写。"
                        })
                    }else{
                        var _result = check_time_modul(_resume.resume_edu,"",150);
                        if(!_result._has_time){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【教育背景】",
                                content:"时间模块必须按照真实经历准确填写。"
                            })
                        }
                        if(!_result._has_unit){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【教育背景】",
                                content:"学校名称在教育背景中不可或缺，请补充填写。"
                            })
                        }
                        if(!_result._has_job){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【教育背景】",
                                content:"别忘记正确填写专业名称。"
                            })
                        }
                        if(!_result._has_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【教育背景】",
                                content:"描述应尽量简洁、突出重点，建议参考贴士学习填写。"
                            })
                        }
                        if(!_result._un_over_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【教育背景】",
                                content:"教育背景的描述应尽量简洁、突出重点，不必罗列过多与岗位相关性不强的专业课程，篇幅不宜过长。建议重新整理下语言，如无需修改，请忽略。"
                            })
                        }
                        if(!_result._time_sort){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【教育背景】",
                                content:"各子模块应按时间顺序倒叙排列，最近的经历写在前面，建议重新调整子模块位置，如无需修改，请忽略。"
                            })
                        }
                        if(!_result._un_key_word){_un_key_word = false}
                    }
                }else{
                    //  当教育背景模块隐藏
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【教育背景】",
                        content:"简洁地写明教育背景，让hr更好地认识你！"
                    })
                }   // 判断教育背景
                if(_resume.modul_show.resume_work.isShow || _resume.modul_show.resume_internship.isShow){
                    if(_resume.modul_show.resume_work.isShow){
                        if(_resume.resume_work.length <= 0){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【工作经验】",
                                content:"时间模块必须按照真实经历准确填写。"
                            },{
                                type:"modal_title",
                                modal_title:"【工作经验】",
                                content:"公司名称不应为空。"
                            },{
                                type:"modal_title",
                                modal_title:"【工作经验】",
                                content:"请补充填写职位名称。"
                            },{
                                type:"modal_title",
                                modal_title:"【工作经验】",
                                content:"工作描述是hr的重要参考项，应尽量具体简洁，请参考贴士认真填写。"
                            })
                        }else{
                            var _result = check_time_modul(_resume.resume_work,20,500);

                            if(!_result._has_time){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【工作经验】",
                                    content:"时间模块必须按照真实经历准确填写。"
                                })
                            }
                            if(!_result._has_unit){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【工作经验】",
                                    content:"公司名称不应为空。"
                                })
                            }
                            if(!_result._has_job){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【工作经验】",
                                    content:"请补充填写职位名称。"
                                })
                            }
                            if(!_result._has_content){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【工作经验】",
                                    content:"工作描述是hr的重要参考项，应尽量具体简洁，请参考贴士认真填写。"
                                })
                            }
                            if(!_result._un_over_content){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【工作经验】",
                                    content:"工作描述应尽量具体简洁，多以数据+关键词形式呈现，篇幅不宜过长。建议重新整理下语言，如无需修改，请忽略。"
                                })
                            }
                            if(!_result._un_less_content){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【工作经验】",
                                    content:"应该为简历的主体内容，目前这部分篇幅和其他内容相比较少，建议增加一些内容。"
                                })
                            }
                            if(!_result._time_sort){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【工作经验】",
                                    content:"各子模块应按时间顺序倒叙排列，最近的经历写在前面，建议重新调整子模块位置。"
                                })
                            }
                            if(!_result._un_key_word){_un_key_word = false}
                        }
                    } //  当工作经验模块显示时判断内容是否合法
                    if(_resume.modul_show.resume_internship.isShow){
                        if(_resume.resume_internship.length <= 0){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【实习经验】",
                                content:"时间模块必须按照真实经历准确填写。"
                            },{
                                type:"modal_title",
                                modal_title:"【实习经验】",
                                content:"公司名称不应为空。"
                            },{
                                type:"modal_title",
                                modal_title:"【实习经验】",
                                content:"请补充填写职位名称。"
                            },{
                                type:"modal_title",
                                modal_title:"【实习经验】",
                                content:"实习描述是hr的重要参考项，应尽量具体简洁，请参考贴士认真填写。"
                            })
                        }else{
                            var _result = check_time_modul(_resume.resume_internship,20,500);

                            if(!_result._has_time){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【实习经验】",
                                    content:"时间模块必须按照真实经历准确填写。"
                                })
                            }
                            if(!_result._has_unit){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【实习经验】",
                                    content:"公司名称不应为空。"
                                })
                            }
                            if(!_result._has_job){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【实习经验】",
                                    content:"请补充填写职位名称。"
                                })
                            }
                            if(!_result._has_content){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【实习经验】",
                                    content:"实习描述是hr的重要参考项，应尽量具体简洁，请参考贴士认真填写。"
                                })
                            }
                            if(!_result._un_over_content){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【实习经验】",
                                    content:"实习描述应尽量具体简洁，多以数据+关键词形式呈现，篇幅不宜过长。建议重新整理下语言，如无需修改，请忽略。"
                                })
                            }
                            if(!_result._un_less_content){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【实习经验】",
                                    content:"应该为应届生简历的主体部分，建议增加一些内容。"
                                })
                            }
                            if(!_result._time_sort){
                                _diagnose_arr.push({
                                    type:"modal_title",
                                    modal_title:"【实习经验】",
                                    content:"各子模块应按时间顺序倒叙排列，最近的经历写在前面，建议重新调整子模块位置。"
                                })
                            }
                            if(!_result._un_key_word){_un_key_word = false}
                        }
                    } //  当实习经验模块显示时判断内容是否合法
                }else{
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【工作/实习经验】",
                        content:"工作/实习经验是个人简历的重中之重，是企业招聘负责人最重视的部分！"
                    })
                }   // 判断工作经验 & 实习经验
                if(_resume.modul_show.resume_project.isShow){
                    if(_resume.resume_project.length <= 0){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【项目经验】",
                            content:"时间模块应按照实际情况准确填写。"
                        },{
                            type:"modal_title",
                            modal_title:"【项目经验】",
                            content:"项目名称不应为空。"
                        },{
                            type:"modal_title",
                            modal_title:"【项目经验】",
                            content:"请补充填写角色名称。"
                        },{
                            type:"modal_title",
                            modal_title:"【项目经验】",
                            content:"项目描述是hr的重要参考项，应注意内容清晰、结果导向，请参考贴士认真填写。"
                        })
                    }else{
                        var _result = check_time_modul(_resume.resume_project,20,500);

                        if(!_result._has_time){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【项目经验】",
                                content:"时间模块应按照实际情况准确填写。"
                            })
                        }
                        if(!_result._has_unit){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【项目经验】",
                                content:"项目名称不应为空。"
                            })
                        }
                        if(!_result._has_job){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【项目经验】",
                                content:"请补充填写角色名称。"
                            })
                        }
                        if(!_result._has_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【项目经验】",
                                content:"项目描述是hr的重要参考项，应注意内容清晰、结果导向，请参考贴士认真填写。"
                            })
                        }
                        if(!_result._un_over_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【项目经验】",
                                content:"项目描述应注意内容清晰、结果导向，同时要与目标申请岗位相结合，升华内容，篇幅不宜过长。建议重新整理下语言，如无需修改，请忽略。"
                            })
                        }
                        if(!_result._un_less_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【项目经验】",
                                content:"的描述太过简单，建议增加描述具体的工作内容和成果，能够用数据来说明成绩更好。"
                            })
                        }
                        if(!_result._un_key_word){_un_key_word = false}
                    }
                } //  判断项目经验
                if(_resume.modul_show.resume_volunteer.isShow){
                    if(_resume.resume_volunteer.length <= 0){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【志愿者经历】",
                            content:"时间模块应按照实际情况准确填写。"
                        },{
                            type:"modal_title",
                            modal_title:"【志愿者经历】",
                            content:"单位信息不应为空。"
                        },{
                            type:"modal_title",
                            modal_title:"【志愿者经历】",
                            content:"请补充填写角色名称。"
                        },{
                            type:"modal_title",
                            modal_title:"【志愿者经历】",
                            content:"描述模块应尽量用数据说话，请参考贴士认真填写。"
                        })
                    }else{
                        var _result = check_time_modul(_resume.resume_volunteer,20,500);

                        if(!_result._has_time){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【志愿者经历】",
                                content:"时间模块应按照实际情况准确填写。"
                            })
                        }
                        if(!_result._has_unit){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【志愿者经历】",
                                content:"单位信息不应为空。"
                            })
                        }
                        if(!_result._has_job){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【志愿者经历】",
                                content:"请补充填写角色名称。"
                            })
                        }
                        if(!_result._has_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【志愿者经历】",
                                content:"描述模块应尽量用数据说话，请参考贴士认真填写。"
                            })
                        }
                        if(!_result._un_over_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【志愿者经历】",
                                content:"描述模块应多用数据说话，篇幅不宜过长。建议重新整理下语言，如无需修改，请忽略。"
                            })
                        }
                        if(!_result._un_less_content){
                            _diagnose_arr.push({
                                type:"modal_title",
                                modal_title:"【志愿者经历】",
                                content:"的描述太过简单，建议增加具体的工作内容及相关成果，最好用数据进行说明。"
                            })
                        }
                        if(!_result._un_key_word){_un_key_word = false}
                    }
                } //  判断志愿者经历
                if(_resume.modul_show.resume_summary.isShow && !common.main.is_empty(_resume.resume_summary)){
                    var _content = _resume.resume_summary.replace(/&nbsp;| |<\/?.+?>/g,"");
                    if(common.main.is_empty(_content)){
                        // 显示模块但内容为空
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【自我评价】",
                            content:"描述模块应做到突出自身符合目标岗位要求的“卖点”，建议参考贴士认真填写。"
                        })
                    }else if(_content.length > 500){
                        //  显示模块但是内容超出
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【自我评价】",
                            content:"自我评价的篇幅不要太长，注意结合简历整体的美观度，如果真的有很多话要说，建议以求职信的形式附上，篇幅不宜过长。建议重新整理下语言，如无需修改，请忽略。"
                        })
                    }
                    if(_content.indexOf("我") >= 0 || _content.indexOf("我们") >= 0 || _content.indexOf("你") >= 0 || _content.indexOf("你们") >= 0 || _content.indexOf("他") >= 0 || _content.indexOf("他们") >= 0 || _content.indexOf("她") >= 0 || _content.indexOf("她们") >= 0 || _content.indexOf("它") >= 0 || _content.indexOf("它们") >= 0){
                        _un_key_word = false;
                    }
                }else{
                    //  隐藏模块
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【自我评价】",
                        content:"添加自我评价，向hr更好地介绍自己！深刻剖析自己+列出自己与求职岗位相关的特质+实事求是不说空话大话！"
                    })
                }   // 判断自我评价模块
                if(_resume.modul_show.resume_honor.isShow && !common.main.is_empty(_resume.resume_honor)){
                    var _content = _resume.resume_honor.replace(/&nbsp;| |<\/?.+?>/g,"");
                    if(common.main.is_empty(_content)){
                        _diagnose_arr.push({
                            type:"modal_title",
                            modal_title:"【荣誉奖项】",
                            content:"你还没有描述你所获得的奖项荣誉哦！如不需要该模块，可选择隐藏。"
                        })
                    }if(_content.indexOf("我") >= 0 || _content.indexOf("我们") >= 0 || _content.indexOf("你") >= 0 || _content.indexOf("你们") >= 0 || _content.indexOf("他") >= 0 || _content.indexOf("他们") >= 0 || _content.indexOf("她") >= 0 || _content.indexOf("她们") >= 0 || _content.indexOf("它") >= 0 || _content.indexOf("它们") >= 0){
                        _un_key_word = false;
                    }
                }  // 判断荣誉奖项
                if(_resume.modul_show.resume_hobby.isShow && _resume.resume_hobby.length <= 0){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【兴趣爱好】",
                        content:"还没有添加兴趣爱好哦！如不需要该模块，可选择隐藏。"
                    })
                }  // 判断兴趣爱好
                if(_resume.modul_show.resume_skill.isShow && _resume.resume_skill.length <= 0){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【技能特长】",
                        content:"还没有添加技能特长哦！如不需要该模块，可选择隐藏。"
                    })
                }  // 判断技能特长
                if(_resume.modul_show.resume_portfolio.isShow && _resume.resume_portfolio.img.length <= 0 && _resume.resume_portfolio.link.length <= 0){
                    _diagnose_arr.push({
                        type:"modal_title",
                        modal_title:"【作品展示】",
                        content:"还没有添加作品哦！如不需要该模块，可选择隐藏。"
                    })
                }  // 判断作品展示
                if(!_un_key_word){
                    _diagnose_arr.push({
                        type:"default",
                        modal_title:"",
                        content:"简历中请尽可能不要使用任何人称，避免使用你、我、他、他们等代词进行描述。"
                    })
                }   // 判断是否存在关键词
            }
            return _diagnose_arr;
        }
        function build_html(arr){
			$("#resume_diagnose_modal").find("ul").html("");
            var diagnose_html = "";
            for(var i in arr){
                if(arr[i].type == "default"){
                    diagnose_html += '<li class="diagnosis_list"><span><i>'+(Number(i)+1)+'.</i> '+arr[i].content+'</span><a href="javascript:;" class="close_list">已修改</a></li>'
                }else{
                    diagnose_html +='<li class="diagnosis_list"><span><i>'+(Number(i)+1)+'.</i><i>'+arr[i].modal_title+'</i>'+arr[i].content+'</span><a href="javascript:;" class="close_list">已修改</a></li>'
                }
			}
            $("#resume_diagnose_modal").find(".diagnosis_count").text("共"+_diagnose_arr.length+"条");
            $("#resume_diagnose_modal").find("ul").html(diagnose_html);
            $(".diagnose_body .diagnosis_list").each(function(){
                if($(this).find("span").height() <= 30){
                    $(this).find("span").css("lineHeight","28px")
                }
            })
        }

 	    $(document).on("click",".diagnose_bar",function(){
			$('.diagnose_body .loading').show ().delay (1000).fadeOut ();
 	        $("#resume_diagnose_modal").css("right","0");
            _diagnose_arr = diagnose();
            build_html(_diagnose_arr);
        }); // 右侧诊断按钮点击事件
        $(document).on("click",".diagnose_body .diagnosis_list",function(e){
        	if($(".diagnose_body .diagnosis_list").length <= 1){
        	    return null
            }else{
                $(this).find("a").toggleClass("show_button");
                e.stopPropagation();
            }
        }); // 诊断项点击展开
        $(document).on("click",".diagnose_body .diagnosis_list .show_button",function(e){
            var _index = $(this).parents("li").index();
            $(this).parents("li").animate({"opacity": "0"},function(){
				_diagnose_arr.splice(_index,1);
                build_html(_diagnose_arr);
                e.stopPropagation();
            })
        });     // 诊断项按钮点击事件
        $(document).on("click",".diagnose_body .diagnose_aging",function(){
			$('.diagnose_body .loading').show ().delay (1000).fadeOut ();
        	var _grade = Number($(".power_level_name").attr("data-value"));
            _diagnose_arr = [];
            _diagnose_arr = diagnose();
        	if(_grade > 80){
        	    setTimeout(function(){build_html(_diagnose_arr);}, 300)
            }else{
                build_html(_diagnose_arr);
            }
            $(".diagnose_modal .diagnose_content").scrollTop(0)
        }); // 重新诊断按钮点击事件
        $(document).on("click",".diagnose_head .close",function(){
            $("#resume_diagnose_modal").css("right","-320px");
        })
    },
    modail_listener:function(e){
	    var $this = $(e.target);
	    if($this.parents("#setStyleModal").length<=0 && $this.parents("#resume_modal_manager").length<=0 && $this.parents("#cvListModal").length<=0 && $this.parents("#historyModal").length<=0 && $this.parents("#changeResumeModal").length<=0){
            $(".litemodal").css('left','-240px');

            // 单独写隐藏更换模板弹框
            $(".litemodal.change_template").css("left","-344px");

            $(document).off("click",cvmutual.main.modail_listener);
        }
        e.stopPropagation();
    }
};
$(function(){
	cvmutual.main.init_();// 初始化
	cvmutual.main.caclulate_resume_scale();
});