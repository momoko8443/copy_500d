/**
 * 全局通用js文件
 * common.info:存放全局通用属性
 * 目录的对应js交互， 请写在对应的cvresume.main.xxx_event方法里去，如要新增,命名规则：cvresume.main.目录名_event
 */
var common = common || {};
common.main = common.main || {};
//全局参数绑定
common.info={
	//异步加载
	isReload:true,//是有已加载，默认是已加载
	isMaxPage:false,//是否是最大页码
	reloadWallfulPage:2//页码	
};
//PC/WAP链接映射
//注意：匹配规则顺序问题
common.urlMapping={
	"^/member/myresume/$" : {url:"/mobile/member/",params:[]},//个人中心-我的简历
	"^/member/message_notification/$" : {url:"/mobile/member/message/",params:[]},//个人中心-消息中心
	"^/member/set/$" : {url:"/mobile/member/set/",params:[]},//个人中心-我的设置
	"^/member/hr/center/(\\d*)/$" : {url:"/mobile/member/hr/index/",params:[]},//求职行家-我是HR
	"^/member/hr/detail/$" : {url:"/mobile/member/hr/order_detail/",params:[{"id":"orderId"}]},//求职行家-订单详情
	"^/member/hr/eval/$" : {url:"/mobile/member/hr/eval/",params:[]},//求职行家-评价管理
	"^/member/hr/hr_task/$" : {url:"/mobile/member/hr/hr_task/",params:[]},//求职行家-求职任务
	"^/member/hr/earning_record/$" : {url:"/mobile/member/hr/earning_record/",params:[]},//求职行家-收益记录
	"^/member/hr/job_management/$" : {url:"/mobile/member/hr/job_management/",params:[]},//求职行家-岗位管理
	"^/member/hr/job_handle/$" : {url:"/mobile/member/hr/job_handle/",params:[]},//求职行家-岗位处理	
	"^/member/order/$" : {url:"/mobile/member/order/",params:[]},//个人中心-我的订单
	"^/member/workOrder/$" : {url:"/mobile/member/workOrder/",params:[]},//个人中心-我的工单
	"^/member/workOrder/create/$" : {url:"/mobile/member/workOrder/create/",params:[]},//个人中心-我的工单-创建工单
	"^/member/workOrder/([A-Za-z\\d]*)/$" : {url:"/mobile/member/workOrder/{0}/",params:[]},//个人中心-我的工单-工单详情
	"^/hr/$" : {url:"/mobile/hr/index/",params:[]},//求职行家
	"^/customize/$" : {url:"/mobile/hr/index/",params:[]},//求职行家
	"^/hr/hr_list/$" : {url:"/mobile/hr/list/",params:[]},//求职行家-hr列表
	"^/hr/select_publish_type/$" : {url:"/mobile/hr/select_publish_type/",params:[]},//求职行家-选择发布任务类型
	"^/hr/case_detail/(\\d*)/$" : {url:"/mobile/hr/case_detail/?caseId={0}",params:[]},//求职行家-案例详情
	"^/hr/publish_([A-Za-z]*)/$" : {url:"/mobile/hr/publish_{0}/",params:[]},//求职行家-发布需求
	"^/hr/job_detail/(\\d*)/$" : {url:"/mobile/hr/job_detail/{0}/",params:[]},//求职行家-岗位详情
	"^/hr/([A-Za-z\\d]*)/$" : {url:"/mobile/hr/{0}/",params:[]},//求职行家-hr详情
	"^/login/$" : {url:"/mobile/login/",params:[]},//登录
	"^/template/$" : {url:"/mobile/template/",params:[]},//模板商城
	"^/template/find([-A-Za-z\\d]*)/$": {url:"/mobile/template/",params:[]},//模板商城
	"^/template/(\\d*).html$": {url:"/mobile/template/{0}.html",params:[]},//商品详情
	"^/cvresume/edit/$": {url:"/mobile/cvresume/edit/",params:[]},//文档编辑器
}
common.main = {
		init_:function(){//事件初始化
			common.main.event_();//全局事件初始化
			common.main.dropresume_event();//自由编辑事件
			common.main.cvresume_event();//在线简历事件
			common.main.editresume_event();//在线简历事件
			common.main.hr_event();//定制商城事件
			common.main.print_event();//打印商城事件
			common.main.member_event();//个人中心事件
			common.main.team_vip_event();//集体会员子会员管理事件
			common.main.urlMapping();
			common.main.onlineKefu();//在线客服
		},
	    event_: function () {//全局事件绑定
	    	//如果是ie9添加class
			if(common.main.isIE9()){
				$("html").addClass("ie9");
			}	    	
	    	//导航选中
	    	var pathName = location.pathname;
	    	if(pathName.indexOf("cvresume") > 0 || pathName.indexOf("editresume") > 0){
	    		$(".nav-li").removeClass("current").eq(0).addClass("current");
	    	}else if(pathName.indexOf("template") > 0 || pathName.indexOf("ppt") > 0) {
	    		$(".nav-li").removeClass("current").eq(1).addClass("current");
	    	}else if(pathName.indexOf("hr") > 0 || pathName.indexOf("customize") > 0 ) {
	    		$(".nav-li").removeClass("current").eq(2).addClass("current");
	    	}else {
	    		$(".nav-li").removeClass("current").eq(4).addClass("current");
	    	}
	    	//鼠标覆盖和离开头像事件
	    	$('.jl-touxiang').hover(function(){
	    		$('.jl-user-info').stop().show();					
	    	},function(){
	    		$('.jl-user-info').stop().hide();					
	    	});	
	    	//获取消息个数
	    	if(getCookie("memberEmail")||getCookie("memberId")){
	    		$.get(wbdcnf.base+"/common/get_message_notification_count/",function(data){
	    			var $message_notification=$("#user_center i");
	    			if(data>0){
	    				$message_notification.show();
	    			}else{
	    				$message_notification.hide();
	    			}
	    		});
	    	}else{
	    		$("#user_center i").hide();
	    	}
	    	//百度打点数据
	    	try{
	    		$(document).on("click",".500dtongji",function(){
	    			var lable=$(this).attr("data_track");
	    			if(lable!=null&&lable!=""&&lable!=undefined){
	    				window._hmt && window._hmt.push(['_trackEvent', lable, 'click']);
	    			}
	    		});
	    	}catch(e){
	    		console.log("统计埋点错误~");
	    	}
	    	//百度推广统计来源记录
	    	try{
	    		var sparam="";
	    		var f = common.main.getUrlParamString("f");
	    		var from =common.main.getUrlParamString("from");
	    		//特殊连接处理--PC推广追踪
	    		if(from && from!=undefined&&(from=="22661"||from=="22662"||from=="22663")){
	    			f=from;
	    			from=undefined;
	    		}
	    		if (f && f!=undefined){
	    			sparam="f="+f;
	    		}
	    		if (from && from!=undefined){
	    			if (f && f!=undefined){
	    				sparam=sparam+"&";
	    			}
	    			sparam=sparam+"code="+from+"&isCover=true";
	    		}
	    		
	    		if (sparam && sparam!=undefined &&sparam!=""){
	    			$.getScript("http://www.500d.me/index/setSource/?"+sparam,function(){});
	    		}
	    	}catch(e){
	    			
	    	}
	    	//图片延迟加载
	    	try{
	    		$("img.lazy").lazyload({
	    		    threshold : 200
	    		});
	    	}catch(e){
	    		console.log("图片延迟加载错误~");
	    	}
	    	//商桥客服处理，如果没有没有在线人工客服标记，则隐藏客服
	    	try{
	    		var $onlineFlag=$("#onlineFlag");
	    		if($onlineFlag==null||$onlineFlag==undefined||$onlineFlag.length<=0){
	    			var style_css='<style>#newBridge{display:none !important}</style>'
	    			$("body").after($(style_css));
	    		}
	    	}catch(e){
	    		console.log("商桥客服处理错误~");
	    	}
	    	//全局复制事件
	    	$(".copy_url_btn").click(function(){
	    		var str = $(".ym-input").val();
	    		common.main.copyToClipBoard(str);
	    	})
	    	//全局登录信息绑定
	    	common.main.loginMsg();
	    	//全局二维码扫码事件
	    	$(document).on("click",".jl-header .jl-ej-nav .sj-btn",function(){
				common.main.resume_confirm({
					title:"",
					content_html:"<span></span><p>微信扫一扫，开始制作你的简历</p>",	
                    tips_modal_class:"mobile_ewm_modal",
					modal_class:"index-mobile-content",
					ok:"",
					cancel:"",
					onOk:function(){
					
					}
			   });		    		
			});	
	    },
	    index_event:function(){
			var baseNum = 2484369;//用户基数
			var incrementNum = 8888;//用户增长数
			var baseDate = '2017-10-09';//日期基数
			var currentDate = common.main.GetDateStr(0)//当前日期
			//天数计算
            var day = common.main.DateDiff(baseDate,currentDate);
			if(day > 0){
			    baseNum += incrementNum * day;
			}
			//秒数计算
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var second =  parseInt((new Date().getTime() - today.getTime())/8000);
            if(second > 0){
                baseNum += 2 * second;
			}
			var clock1 = $('.jl-index-num').FlipClock(baseNum, {
				clockFace: 'Counter',
				autoStart: false
			});
			setTimeout(function() {
		        setInterval(function() {
                    //baseNum+=parseInt(5+Math.random()*10);
                    baseNum+=1;
		            clock1.setValue(baseNum);
		        }, 2000);
			});	    	
	    	$(".index_left_adv1 span.close").click(function(){
	    		$(this).parent(".index_left_adv1").animate({"bottom":"-160px"},500);
	    		return false;
	    	});
	    	$(".jl-index-search .search-keyword").focusin(function(){
		        setTimeout(function() {
		    		$(".search-img").animate({"top":"-10px","opacity":"1"},300);
		        }, 200);
		    	$(this).siblings("button").css("background-position","-238px 8px");
	    	});
	    	$(".jl-index-search .search-keyword").focusout(function(){
		        setTimeout(function() {
		        	$(".search-img").animate({"top":"13px"},300);
		        }, 100);	    		

	    		$(this).siblings("button").css("background-position","-205px 8px")
	    	});	    	
		    $(window).scroll(function(){
		        var s = $(window).scrollTop();
		        if(s > 918){
		            $(".jl-header").parent("div").removeClass("index_header").addClass("index_header_fixed");
		        }else{
		            $(".jl-header").parent("div").addClass("index_header").removeClass("index_header_fixed");;
		        };
		    });	    	
			var owl = $("#owl-demo");
			owl.owlCarousel({
			      items :4, //10 items above 1000px browser width
			      itemsDesktop : [1000,5], //5 items between 1000px and 901px
			      itemsDesktopSmall : [900,3], // betweem 900px and 601px
			      itemsTablet: [600,2], //2 items between 600 and 0
			      itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
			});
			$(".jl-index-box .next").click(function(){
	    		owl.trigger('owl.next');
	  		});
		    $(".jl-index-box .prev").click(function(){
		        owl.trigger('owl.prev');
		    });
		    owl.trigger('owl.play',3000);
			$(".jl_temp_nav a").click(function(){
				var num = $(this).index();
				$("ul.dl_index_Template").eq(num).css('display','block').siblings().css('display','none');
				$(this).addClass("current").siblings().removeClass("current");
				//4-18 修改
				if($(this).attr("rel") == "nofollow"){
					$(window).scrollTop(911);
				}
			});	 
		  	var opt	=	{
				"speed":"fast",	//变换速度,三速度可选 slow,normal,fast;
				"by":"mouseover",
				"auto":false,
				"sec":3000,
				"maxWidth":571,
				"minWidth":82
		  	};
		    $(".roundabout_box_ul").IMGDEMO(opt);   

			$(document).on("mouseleave",".jl_temp_slider",function(){
				$(this).find(".roundabout-moveable-item").eq(1).addClass("active").siblings().removeClass("active");			
				$(this).find(".roundabout-moveable-item").eq(1).css({
					"opacity":"1"

				}).siblings().css({
					"opacity":"0.5"
				})		
						
			});
	      			
	    },
		hr_page_init_event:function(){
		},
	    dropresume_event:function(){
	    	$(document).on("click","#dropdownloadPdfBtn:not(.wbd-vip-lock)",function(){
	       		var id=$("#hidden_data_resume_id").val();
	       		if(common.main.is_empty(id)){
	       			layer.msg("请先保存简历~");
	       			return false;
	       		}
	       		var downloadUrl="";
		    	$.ajax({type : "get",
				   	cache: false,
				   	async : false,
				   	url : "/cvresume/get_download_url/"+id+"/",
				   	success : function(message) {
				   		if(message.type=="success"){
				   			downloadUrl=message.content;
						}else{
							layer.msg(message.content);
						}
				   	}
				});
	    		if(!common.main.is_empty(downloadUrl)){
	    			var timestr=new Date().getTime();
	    			var reg=/_\d*\.pdf/;
	    			downloadUrl=downloadUrl.replace(reg,"_"+timestr+".pdf");
	    			window.open(downloadUrl);
	    		}
	    	});
	    },
	    template_down_event:function(){	
	    	$(document).on("click","#template_download_btn:not(.wbd-vip-lock)",function(){
	    		var _id=$(this).attr("data-id");
	    		//检查是否超过限制
	    		var result="0";
	    		$.ajax({
	    			url: wbdcnf.base + "/order/check_product_downtimes/",
	    			type: "GET",
	    			dataType: "json",
	    			data:{"pid":_id},
	    			cache: false,
	    			async: false,
	    			success: function(data) {
	    				result = data;
	    			}
	    		});
	    		if(result.type=="error"&&result.content=="0"){
	    	     		//未登录
	    	         	show_login_modal();
	    	    }else if(result.type=="error"&&result.content=="1"){
	    	        	//没有权限
	    	        	 common.main.vip_opt_tips("template");
	    	    }else if(result.type=="error"&&result.content=="-1"){
	    	        	//商品不存在
	    				layer.msg("商品不能存在，请刷新重试");
	    	    }else if(result.type=="error"&&result.content=="3"){
	    	        	//提示超过每天限制
	    				common.main.temp_download_modal();
	    	     }else if(result.type=="success"){
	    	        	//可以下载
	    				window.open(result.content);
	    	     }
	    	});
	    },
	    cvresume_event:function(){	    	
	    	//发布页面的下载按钮
	        $(document).on("click","#releaseDownloadPDFBtn:not(.wbd-vip-lock)",function(){
	       		var visitid=$(this).attr("data_visitid");
	       		var id=$(this).attr("data_id");
	       		var downloadFlag=false;
	       		var downloadUrl="";
	    		if(!downloadFlag){
	    			$.ajax({type : "get",
			    		cache: false,
			    		async : false,
			    		url : "/cvresume/get_download_url/"+id+"/",
			    		success : function(message) {
			    			if(message.type=="success"){
								downloadUrl=message.content;
								downloadFlag=true
							}else{
								layer.msg(message.content);
							}
			    		}
			    	});
	    		}
	    		if(downloadFlag){
	    			var timestr=new Date().getTime();
	    			var reg=/_\d*\.pdf/;
	    			downloadUrl=downloadUrl.replace(reg,"_"+timestr+".pdf");
	    			window.open(downloadUrl);
	    			//下载提示
	    			var param=location.search;
	    			if(param!=""&&visitid!=""&&visitid!=undefined){
		    			var rclid=common.main.getUrlParamString("rclid");
	    				$.post("/cvresume/resume_email_track/",{"rclid":rclid,"replyType":"hrDownload"},function(data){
	    			   		
	    				})
	    			}
	    		}
	    	});

	    
	    },
	    editresume_event:function(){
			//简历同步导入
	    	common.main.resume_import();
	    	//简历导入
	    	$(document).on("click",".import_resume_btn:not(.wbd-vip-lock),.show_import_btn:not(.wbd-vip-lock)",function(){
	    		if($.checkLogin()){
	    			$("#importRModal").modal("show");
	    		}else{
	    			show_login_modal();
	    			return;
	    		}
	    	});
	    	//登录
	    	$(".unlogin a").click(function(){
	    		show_login_modal();
	    	});
	    	//简历分享
	    	common.main.resume_share()
    	
	    },
        resume_cases_event:function(){
        	var _isPreview = false;//是否预览案例
        	common.info.isReload = true;
        	common.info.isMaxPage=false;
            var nav=$(".zx-mblist-nav"); //得到导航对象
            var win=$(".zx-con-box"); //得到窗口对象
	    	win.scroll(function(){
	         	if(_isPreview){
	         		return;
	         	}
	           	win_scroll();
			}); 
				
			// 滚动条兼容性处理（除了Webkit内核，其他隐藏滚动条）
			if (!(navigator.userAgent.indexOf('Chrome') >= 0 || navigator.userAgent.indexOf('Safari') >= 0)){
				$(".zx-con-box").css({"width":"102%","padding-right":"10px"})
			}

            //左侧导航二级显示隐藏事件
            $(document).on("mouseover",".zx-mblist-nav .nav-box",function(){
                $(this).addClass("current");
            });
            $(document).on("mouseleave",".zx-mblist-nav .nav-box",function(){
                $(this).removeClass("current");
            });
            //加载案例
			function get_cases(href,keyword){
				common.info.isReload = true;
				common.info.isMaxPage = false;
            	common.info.reloadWallfulPage=1;
            	$(".list").remove();
				$.get(href,{"keyword":keyword,"itemid":cvresume.info.itemid},function(result){
					$(".zx_caselist .zx_case_box").append(result);
					$('.zx_case_box').attr("data-url",href);
				});
			};
            //左侧导航点击事件
            $(".zx-mblist-nav .nav-box a").click(function(){
            	common.main._500dtongji("PC-CV6.7.0-在线制作-案例库弹窗页-行业类型选区-通用-行业");
            	$(this).addClass("checked").siblings().removeClass("checked");
				$(this).parents("dl").siblings().find("a.checked").removeClass('checked')
            	$(this).parents(".nav-box").siblings().find("a.checked").removeClass('checked')
            	var url_tag = $(this).attr("data_url");;
            	var href="/cvresume/cases/"+url_tag+"/";
            	get_cases(href,null);
			});
			//右侧搜索按钮点击事件
			$("#seachBtn").click(function(){
				common.main._500dtongji("PC-CV6.7.0-在线制作-案例库弹窗页-搜索区-左上-搜索");
				var _keyword = $("#keyword").val();
				var href="/cvresume/cases/";
				get_cases(href,_keyword);
			});
			//右侧搜索输入框回车事件
			$("#keyword").keypress(function(){
				common.main._500dtongji("PC-CV6.7.0-在线制作-案例库弹窗页-搜索区-左上-搜索");
				if(event.keyCode == 13){
					var _keyword = $("#keyword").val();
					var href="/cvresume/cases/"
					get_cases(href,_keyword);
				}
			});
			// 中英文选择事件
			$(".case_modal .language button").on("click",function(){
				$(this).addClass("checked").siblings().removeClass("checked");
				var href=$(this).attr("data_href");
				$("#keyword").val("");
				get_cases(href,null);
				if($(this).text()=="中文"){
					common.main._500dtongji("PC-CV6.7.0-在线制作-案例库弹窗页-语言类型选区-通用-中文");
				}else{
					common.main._500dtongji("PC-CV6.7.0-在线制作-案例库弹窗页-语言类型选区-通用-英文");
				}
				
			})
			// 行业展开事件
			$(".case_modal .modal-body .doc_category i").on("click",function(){
		    	$(".doc_category>i").toggleClass("checked")
		    	$(".zx-mblist-nav").toggleClass("checked")
		    })
			//滚动加载
			function win_scroll(){
				//计算所有瀑布流块中距离顶部最大，进而在滚动条滚动时，来进行ajax请求，
				var _itemNum=$('.zx_caselist').find('.zx_case_box .list').length;
				if(_itemNum>=15&&common.info.isReload&&!common.info.isMaxPage){
					var _itemArr=[];
					_itemArr[0]=$('.zx_caselist').find('.zx_case_box .list').eq(_itemNum-1).offset().top+$('.zx_caselist').find('.zx_case_box .list').eq(_itemNum-1)[0].offsetHeight;
					_itemArr[1]=$('.zx_caselist').find('.zx_case_box .list').eq(_itemNum-2).offset().top+$('.zx_caselist').find('.zx_case_box .list').eq(_itemNum-1)[0].offsetHeight;
					_itemArr[2]=$('.zx_caselist').find('.zx_case_box .list').eq(_itemNum-3).offset().top+$('.zx_caselist').find('.zx_case_box .list').eq(_itemNum-1)[0].offsetHeight;
					if  ($('.zx-con-box').scrollTop() > $('.zx_case_box').height() - $('.zx-con-box').height()-50){
						common.info.isReload=false;
			        	reload()
			        }
				}
			};
			//加载数据
		   	function reload(){
		   		var _dataUrl = $('.zx_case_box').attr("data-url");
		   		var _itemid  = $('.zx_case_box').find('.list').eq(0).attr("data_itemid");
		   		var _resumeid  = $('.zx_case_box').find('.list').eq(0).attr("data_resumeid");
		   		var _requetUrl;
		   		if(_dataUrl.indexOf("?")!=-1){
			   		_requetUrl = _dataUrl + "&pageNumber=" + common.info.reloadWallfulPage;
		   		}else{
			   		_requetUrl = _dataUrl + "?keyword=" + $("#keyword").val() + "&pageNumber=" + common.info.reloadWallfulPage;
		   		}
		   		$.get(_requetUrl, function(result){
		   			if(result.indexOf("jl_search_null")!=-1){
		   				common.info.isMaxPage = true;
		   			}else{
		   				$('.zx_case_box').append(result);
		   				common.info.isReload = true;
		   				common.info.reloadWallfulPage=common.info.reloadWallfulPage+1;
		   				$('.list').attr("data_itemid",_itemid);
		   				$('.list').attr("data_resumeid",_resumeid);
		   			}
		   		});
			}
            //案例详情显示隐藏
            $(document).on("click", ".zx_case_detail .return", function(){
				var scrollTo =  $(".zx_case_box .list.checked");
				$(".zx_case_detail").removeClass("show");
				// $(".zx_caselist").css("display","block");
				$(".zx_caselist").css({"opacity":"1"},{"z-index":"120"},{"transition":"all 0.3s"});
                $(".case_modal .modal-header").css("display","block");
            	$(".case_modal .modal-body").css("display","block");
                _isPreview = false;
            });
            $(document).on("click", ".list .preview", function(){
				var $list = $(this).closest(".list");
                var _dataUrl = $list.attr("data-url");
                var _dataStyle=$list.attr("data-style");
                var _contentId= $list.attr("data_resume_contentid");
                var _itemid=$list.attr("data_itemid");
                var _href;
                if(_itemid!=null&&_itemid==535){
                	_href="/dropcvresume/edit/?resumeContentId="+_contentId+"&resumeId="+cvresume.info.resumeid+"&itemid="+_itemid;
                }else{
                	_href="/cvresume/edit/?resumeContentId="+_contentId+"&resumeId="+cvresume.info.resumeid+"&itemid="+_itemid;
                }
                $list.addClass("checked").siblings().removeClass("checked");
                $("#dongtaicss").attr("href", _dataStyle);
                 $.get("/cvresume/resume_case_detail/",{"resumeContentId":_contentId}, function(dataHtml){
                	$(".zx_case_detail").empty();
					$(".zx_case_detail").append(dataHtml);
					$(".zx_case_detail").addClass("show");
                	$(".select_case").attr("data_href",_href);
                	preview_resume_module_sort();
                	$(".zx_caselist").css({"opacity":"0"},{"z-index":"-1"},{"transition":"all 0.3s"});
                	$(".case_modal .modal-header").css("display","none");
                	$(".case_modal .modal-body").css("display","none");
                	_isPreview = true;
                });
                $(".zx-mblist-nav").removeClass("fixednav");
                
            });
            // 应用案例详情
			$(document).on("click",".zx_case_detail .select_case",function(){
				var _href=$(this).attr("data_href");
				$(".modal-backdrop").remove();
				$("#case-modal").css("display","none")
                common.main.resume_confirm({
                    title:"",
                    content_html:"<span class='tips_title'>确定应用此内容范文？</span><span class='tips-content'>应用后已编辑的简历内容将被覆盖。</span><label class='neverNotfy'><input type='checkbox' id='checkedNotfy' class='checkedNotfy'><span>不再提醒</span></label>",
                    tips_modal_class:"confirm_modal",
                    modal_class:"tips-modal-content change_content_confirm case_confirm_modal",
                    onOk:function(){
                    	common.main._500dtongji("PC-CV6.7.0-在线制作-案例库弹窗页-范文选区-通用-范文查看-应用此范文");
						location.href=_href;
                    },
                    onCancel:function(){
                    	$("#case-modal").css("display","block")
						$("#case-modal").css({"background":"rgba(0,0,0,0.85)"})
						$("#case-modal").css("animation","none")
                    }
                });
                $(".case_confirm_modal .close").on("click",function(){
                	$("#case-modal").css("display","block")
					$(".case_confirm_modal").modal("hide");
					$(".case_confirm_modal").remove();
					$("#tips-common-modal").remove()
					$("body").removeClass("suggestModal");
					$("body").removeClass("modal-open");
	                	return false
                });
            });
            function preview_resume_module_sort(){
			    var _sortPosition = new Array("Left","Top","Right","Bottom")
			    var _resume_sort=$("#resume_base").attr("resume_sort");
			    var _template_set=$("#resume_base").attr("template_set");
			    if(!common.main.is_empty(_resume_sort)){
			        var _sort = JSON.parse(_resume_sort);
			        if(_sort){
			            var _classStr="#resume_base .wbdCv-base";
			            $(_sortPosition).each(function(i,item){//遍历方位
			                var _pos = _sort[item.toLocaleLowerCase()];
			                var $preModuleId;
			                $(_pos).each(function(j,jtem){//遍历各方位的id
			                    if(common.main.is_empty($preModuleId)){
			                        $(_classStr+item).prepend($("#"+jtem));//在所在方位的div开头添加节点
			                    }else{
			                        $($preModuleId).after($("#"+jtem));//在前一个节点后添加节点
			                    }
			                    $preModuleId=$("#"+jtem);//把当前节点作为下次循环的子节点
			                });
			            });
			        }
			    }else if(!common.main.is_empty(_template_set)){
			        var _settings = JSON.parse(_template_set);
			        if(_settings){
			            var _classStr="#resume_base .wbdCv-base";
			            $(_sortPosition).each(function(i,item){//遍历方位
			                var _pos_set = _settings[item.toLocaleLowerCase()];
			                var $preModuleId;
			                $(_pos_set).each(function(j,jtem){
			                    //隐藏
			                    if(!jtem.isShow){
			                        $("#"+jtem.key).addClass("hidden");
			                    }
			                    //移位
			                    if(common.main.is_empty($preModuleId)){
			                        $(_classStr+item).prepend($("#"+jtem.key));
			                    }else{
			                        $($preModuleId).after($("#"+jtem.key));
			                    }
			                    $preModuleId=$("#"+jtem.key);
			                });
			            });
			        }
			    }
			}           
        },
        agreement_event:function(){
            //设置标杆
			var _line=parseInt($(window).height()/3);
			$(window).scroll(function(){
				$('.agreement_nav li').eq(0).addClass('active');
				//滚动到标杆位置,左侧导航加active
				$('.agreement_content li').each(function(){
					var _target=parseInt($(this).offset().top-$(window).scrollTop()-_line);
					var _i=$(this).index();
					if (_target<=0) {
						$('.agreement_nav li').removeClass('active');
						$('.agreement_nav li').eq(_i).addClass('active');
					}
					//如果到达页面底部，给左侧导航最后一个加active
					else if($(document).height()==$(window).scrollTop()+$(window).height()){
						$('.agreement_nav li').removeClass('active');
						$('.agreement_nav li').eq($('.agreement_content li').length-1).addClass('active');
					}
				});
			});
			$('.agreement_nav li').click(function(){
				$(this).addClass('active').siblings().removeClass('active');
				var _i=$(this).index();
				 $('body, html').animate({scrollTop:$('.agreement_content li').eq(_i).offset().top-_line},500);
			});
        },
        resume_import:function(){//简历导入
	    	//导入简历tab切换
			$(".importRnav ul li").find("input").click(function(){
				$(this).parent().siblings("li").find("input").attr("checked");
				$(this).parent().find("input").attr("checked","checked");
				var num = $(this).parent().index();
				var $this = $(".importRcon ul li").eq(num)
				$this.addClass("current");
				$this.siblings("li").removeClass("current");
				$(this).parent().addClass("chose").siblings().removeClass("chose");
				if($(this).attr("id")=="fz"){
					$("#copy_resume_id option").remove();
					$.get("/cvresume/resume_list/",{},function(result){
						if(result!=null){
							$("#copy_resume_id").append(result);
						}
					})
					
				}
			});			
			//点击"选择HTML文件按钮"进行导入本地已经下载了的html格式简历文件
			$(".importRcon .a-input").click(function(){
				$(this).siblings("input").trigger("click");
			});
			//导入简历提示,显示文件名
			$("input[name='filename']").on('change', function(){
				var name = $(this).val();
				$(this).siblings("span.addr").text(name);
			});
			//51导入
			$("#51job_import").click(function(){
				var $this=$(this);
				var name = $this.closest("li").find("input").val();
				if(name==""||name==null){
					layer.msg("请选择文件上传");
					return;
				}
				if(typeof cvresume != "undefined"&&cvresume.main.is_empty(cvresume.info.memberid)){
	        		layer.msg("亲，登录后才可以导入简历哦~");
	        		return false;
	        	}
				var fileName = name.substring(name.lastIndexOf("\\") + 1);
				var fileType = name.substring(name.lastIndexOf(".") + 1);
				//校验文件格式是否正确
				if(fileType.toLocaleLowerCase() != "html" && fileType.toLocaleLowerCase() != "htm") {
					$("#importResetModal").modal("show");
					$("#importResetModal").find(".tips_show").text("只支持HTML，HTM格式，请重新选择导入");
					$("#importRModal").modal("hide");
					return;
				}
				$this.prop("disabled",true);
    			show_pro($this.closest("li").find("div.progressbar"),1);
    			read_local_file($this.closest("li").find("input")[0],"206","");
    			setTimeout(function(){
    				$this.prop("disabled",false);
    			},2000);
			});
			
			//智联简历导入
			$("#zhilian_import").click(function(){
				var $this=$(this);
				var name = $this.closest("li").find("input").val();
				if(name==""||name==null){
					layer.msg("请选择文件上传");
					return;
				}
				if(typeof cvresume != "undefined"&&cvresume.main.is_empty(cvresume.info.memberid)){
	        		layer.msg("亲，登录后才可以导入简历哦~");
	        		return false;
	        	}
				var fileName = name.substring(name.lastIndexOf("\\") + 1);
				var fileType = name.substring(name.lastIndexOf(".") + 1);
				//校验文件格式是否正确
				if(fileType.toLocaleLowerCase() != "html" && fileType.toLocaleLowerCase() != "htm") {
					$("#importResetModal").modal("show");
					$("#importResetModal").find(".tips_show").text("只支持HTML，HTM格式，请重新选择导入");
					$("#importRModal").modal("hide");
					return;
				}
				//判断用户权限
				$this.prop("disabled",true);
				show_pro($this.closest("li").find("div.progressbar"),1);
				read_local_file($this.closest("li").find("input")[0],"206",""); 
				setTimeout(function(){
					$this.prop("disabled",false);
				},2000);
			});
			//拉勾简历导入
			$("#laggou_import").click(function(){
				var $this=$(this);
				var name = $this.closest("li").find("input").val();
				if(name==""||name==null){
					layer.msg("请选择文件上传");
					return;
				}
				if(typeof cvresume != "undefined"&&cvresume.main.is_empty(cvresume.info.memberid)){
	        		layer.msg("亲，登录后才可以导入简历哦~");
	        		return false;
	        	}
				var fileName = name.substring(name.lastIndexOf("\\") + 1);
				var fileType = name.substring(name.lastIndexOf(".") + 1);
				//校验文件格式是否正确
				if(fileType.toLocaleLowerCase() != "html" && fileType.toLocaleLowerCase() != "htm") {
					$("#importResetModal").modal("show");
					$("#importResetModal").find(".tips_show").text("只支持HTML，HTM格式，请重新选择导入");
					$("#importRModal").modal("hide");
					return;
				}
				$this.prop("disabled",true);
				show_pro($this.closest("li").find("div.progressbar"),1);
				read_local_file($this.closest("li").find("input")[0],"206","");
				setTimeout(function(){
					$this.prop("disabled",false);
				},2000);
			});
			//本地简历复制
			$("#copyt_import").click(function(){
				var $this=$(this);
				var resumeid=$("#copy_resume_id").val();
				if(resumeid==null||resumeid==undefined||resumeid==""){
					layer.msg("请选择你需要复制的简历");
					return;
				}
				show_pro($this.closest("li").find("div.progressbar"),1);
				if(typeof cvresume != "undefined"){
					common.main.resumeOperationLogUpload(resumeid,"copyresume","","复制至简历（ID："+cvresume.info.resumeid+"）");
					if (window.localStorage && cvresume.localStorage) {
						sessionStorage.removeItem("historyid");
	                }else{
	                	cvresume.main.resume_save_history();
	                }
					location.href="/cvresume/clone/"+resumeid+"/?clone2ResumeId="+cvresume.info.resumeid;
				}else{
					common.main.resumeOperationLogUpload(resumeid,"copyresume","","创建简历");
					location.href="/cvresume/clone/"+resumeid+"/";
				}
			});
			//简历导入的进度条显示
			function show_pro(tag,time){
				if(time==null||time==undefined){
					time=1;
				}
				tag.show();
				var ss_pro=100/(time*10);
				var sum_width=0;
				intervalid=setInterval(function(){
					sum_width=sum_width+ss_pro;
					console.log(Math.round(sum_width));
					update_pro(Math.round(sum_width)+"%",tag);
					if(sum_width>=95){
						sum_width=0;
						clearInterval(intervalid);
						//hide_pro();
					}
				},100);
				
			}	
			function update_pro(width,tag){
				tag.find("i").css("width",width);
				tag.find("span").text(width);
			}
			function hide_pro(){
				update_pro("100%",$("div.progressbar").find("div.progressbar"));
				clearInterval(intervalid);
				setTimeout(function(){
					$("div.progressbar").fadeOut("slow");
				},1000);
				setTimeout(function(){
					$("div.progressbar").find("i").css("width","0%");
					$("div.progressbar").find("span").text("0%");
				},2000);
			}
			$(".zx-dr-tips .span-close").click(function(){			
	    		$(".zx-dr-tips").css('display','none');
	    		return false;
	    	});
		},
	    hr_event:function(){
	    	//离线提示框
	    	$('.hr-detail-fwnr .hr-lx a').click(function(){
	    		var $this=$(this);
				var caseid=$(this).attr("data_casesid");
				common.main.resume_confirm({
					title:"",
					content_html:"<span class='delete-title'>提示</span><span class='delete-tips'>这位HR老师好像暂时没有时间接单，你可以先去了解一下其他HR老师哟~</span>",					
					modal_class:"delete-content",
					ok:"确定",
					cancel:"取消",
					onOk:function(){
					$.get("/member/hr/deleteCases/?caseid="+caseid,function(message){
							if(message.type=="success"){
								window.location.reload();
							}else{
								$.message("warn",message.content);
							}
						});
					
					}
			    });	    		
	    	});	
	    	$('.hr-detail-fwnr .hr-ml #pay_btn').click(function(){
	    		var $this=$(this);
				var caseid=$(this).attr("data_casesid");
				common.main.resume_confirm({
					title:"",
					content_html:"<span class='delete-title'>提示</span><span class='delete-tips'>这位HR老师手上正在处理的订单太多啦，暂时不接受下单，亲可以去看看其他HR老师哦~</span>",					
					modal_class:"delete-content",
					ok:"确定",
					cancel:"取消",
					onOk:function(){
					$.get("/member/hr/deleteCases/?caseid="+caseid,function(message){
							if(message.type=="success"){
								window.location.reload();
							}else{
								$.message("warn",message.content);
							}
						});
					
					}
			    });	    		
	    	});		    	
	    },
	    print_event:function(){
	    	
	    },
	    member_event:function(){
	    	//我的简历下载
	    	var _href,_html;
	    	$(document).on("click",".member-resume-con .zxjl-ul .text .down_btn",function(){
	    		var $this = $(this);
				$.get("/member/down_ad_data/",function(message){
					
					if(message.type=="success"){					
						var _content = JSON.parse(message.content);
						if(_content.adList == undefined){
							console.log(_content)
							if(_content.can_down){
								
								_href = $this.attr("data-href");
								window.location.href = _href;
							}else{
								_href = "http://www.500d.me/order/vip_member/";
								window.location.href = _href;	
							}

						}else if(_content.adList){
							var adv_info = _content.adList[0];
							if(_content.can_down){
								_href = $this.attr("data-href");
								_html = '<div><a class="a_img" href="'+adv_info.url+'" target="_blank"><img src="'+adv_info.imgUrl+'" width="320" height="160"/></a><a class="a_download_reusme" href="'+_href+'"><i></i>下载简历</a></div>'
								common.main.resume_confirm({
									tips_modal_class:"wbd_resume_download_modal",
									content_html:_html,
									ok:"下载简历",
									onOk:function(){
									}								
								});									
							}else{
								_href = "http://www.500d.me/order/vip_member/";
								_html = '<div><a class="a_img" href="'+adv_info.url+'" target="_blank"><img src="'+adv_info.imgUrl+'" width="320" height="160"/></a><a class="a_download_reusme" href="'+_href+'"><i></i>下载简历</a></div>'
								common.main.resume_confirm({
									tips_modal_class:"wbd_resume_download_modal",
									content_html:_html,
									ok:"下载简历",
									onOk:function(){
									}								
								});									
							}							
						}
					}
				}); 
	    	});		    	
			$(document).on("click",".wbd_resume_download_modal .a_download_reusme,.wbd_resume_download_modal .a_img",function(){
				$(".wbd_resume_download_modal").modal("hide");
			});
	    	//个人在线会员升级操作
	    	$(".member-hy .huiyuan-upload").click(function(){
				common.main.vip_opt_tips("super");
	    	});
	    	//个人中心设置弹框隐藏
	    	$("#setResumeModal .wbd-vip-lock").click(function(){
	    		$("#setResumeModal").modal("hide");
	    	});
	    	//我的主页select	    	
			$(".myhome-select-cv .select-btn").on('click',function(event){
			    event.stopPropagation();
			    event.preventDefault();
			    if($(this).siblings(".select-box").hasClass('hidden')){
			         $(this).siblings(".select-box").removeClass("show");
			    }else{
			        $(this).siblings(".select-box").addClass("show");
			    }
			});
			$(".myhome-select-cv .select-box li").on('click',function(){
				//设置主页
				var _dataId = $(this).attr("data-id");
				$.ajax({
		    		type: "POST",
		            url: "/member/set_home_page_resume/",
		            data:{
		            	resumeId:_dataId
		            },
		           	success:function(message){
		           		if(message.type != "success"){
		           			layer.msg(message.content);
		           		}else{
		           			window.location.reload();
		           		}
		           	}
		    	});
			});
	    	//我的简历
	    	$(document).on("click",".zxjl-ul .set-btn",function(event){
	    		event.stopPropagation();
				event.preventDefault();
			    $(this).parents(".item").siblings().find(".set-box").removeClass("show");
			    $(this).find(".set-box").toggleClass("show");
			});
			$(".zxjl-ul .item").each(function(){
	    		if ($(this).hasClass("doc_resume")) {
	    			$(this).find(".set-btn .set-box-list.qh b").text("切换手机简历");
	    			$(this).find(".set-btn .set-box-list.qh s").removeClass("web").addClass("wap");			
	    		}else if($(this).hasClass("wap_resume")) {
	    			$(this).find(".set-btn .set-box-list.qh b").text("切换文档简历");
	    			$(this).find(".set-btn .set-box-list.qh s").removeClass("wap").addClass("web");	
	    		}
			});
	    	$(document).on("click",".set-box-list.qh s",function(event){
	    		if ($(this).hasClass("wap")) {
	    			$(this).removeClass("wap").addClass("web");
	    			$(this).siblings("a").find("b").text("切换文档简历");
	    			
	    		}else{
	    			$(this).addClass("wap").removeClass("web");
	    			$(this).siblings("a").find("b").text("切换手机简历");
	    		}
			});					
	    	//旧版删除简历提示（winna）
			$('.del_resume').click(function() {
				var $this=$(this);
				var data_id=$(this).attr("data_id");				
				common.main.resume_confirm({
					title:"",
					content_html:"<span class='delete-title'>确定删除当前简历吗？</span><span class='delete-tips'>简历删除后将无法恢复。</span>",
					modal_class:"delete-content",
					ok:"确定",
					cancel:"取消",
					onOk:function(){
						var url="/editresume/delete/?resumeId="+data_id;
						$.get(url, function(message) {
							if(message.type == "success"){
								$this.closest("div.item").remove();
								$("#web_size").html($('#web_size').eq(0).text()-1);
							}else{
								layer.msg(message.content);
							}
						});
					}
				});
			});	 
			$('.del_cvresume').click(function() {
				var $this=$(this);
				var data_id=$(this).attr("data_id");	
				common.main.resume_confirm({
					title:"",
					content_html:"<span class='delete-title'>确定删除当前简历吗？</span><span class='delete-tips'>简历删除后将无法恢复。</span>",					
					modal_class:"delete-content",
					ok:"确定",
					cancel:"取消",
					onOk:function(){
						common.main.resumeOperationLogUpload(data_id,"delete","","");//日志上报      
			            var url="/cvresume/delete/"+data_id + "/";
			            $.get(url, function(message) {
			                if(message.type == "success"){
			                    $this.closest("div.item").remove();
			                    $("#web_size").html($('#web_size').eq(0).text()-1);			
			                }else{
			                    layer.msg(message.content);
			                }
			            });
					}
				});
			});				
	    	//我是hr回复评论
	    	$('.hr_eval .eval_list .eval_btn').click(function(){
	    		var $this=$(this);
				var data_id=$(this).attr("data_id");
				var reply=$(this).attr("data");
				common.main.resume_confirm({
					title:"回复评论",
					content_html:"<div contenteditable='true'></div>",					
					modal_class:"hr_eval_content",
					ok:"确定",
					cancel:"取消",
					onOk:function(){
						var content = $(".hr_eval_content div[contenteditable]").text();
						if(content.length==0){
							layer.msg("字数不能为空");
							return ;
						}
						if(content.length>200){
							layer.msg("字数不能超过200字");
							return ;
						}
						$.post("/member/hr/reply/",{"id":data_id,"content":content},function(message){
							if(message.type=="success"){
								layer.msg("回复成功");
								window.location.reload();
							}else{
								$.message("warn",message.content);
							}
						});
						
					}
				});	 
				$(".hr_eval_content div[contenteditable]").text(reply)
	    	});
	    	//删除案例提示框
	    	$('.hr_case_content .span_btn .del').click(function(){
	    		var $this=$(this);
				var caseid=$(this).attr("data_casesid");
				common.main.resume_confirm({
					title:"",
					content_html:"<span class='delete-title'>确定删除当前案例吗？</span><span class='delete-tips'>案例删除后将无法恢复。</span>",					
					modal_class:"delete-content",
					ok:"确定",
					cancel:"取消",
					onOk:function(){
					$.get("/member/hr/deleteCases/?caseid="+caseid,function(message){
							if(message.type=="success"){
								window.location.reload();
							}else{
								$.message("warn",message.content);
							}
						});
					
					}
			    });	    		
	    	});	
	    	//警告弹框
	    	$(document).on("click",".ts",function(){
	    	  common.main.resume_confirm({
					title:"",
					content_html:"<span class='delete-title'>提醒</span><span class='delete-tips'>您选择的HR尚未上传已完成简历，无法确认订单。</span>",					
					modal_class:"delete-content",
					ok:"确定",
					cancel:"取消",
					onOk:null
			    });	    		
	    	});
	    	//专家服务完成案例提示框
	    	$(document).on("click",".hr_li .complete:not(.yituikuan),.task_hr_li .complete:not(.yituikuan)",function(){
	    		var $this=$(this);
	    		var sn=$(this).attr("data_sn");
				common.main.resume_confirm({
					title:"",
					content_html:"<span class='delete-title'>确认完成订单？</span><span class='delete-tips'>认可服务结果并确认，确认后无法撤销。</span>",					
					modal_class:"delete-content",
					ok:"确定",
					cancel:"取消",
					onOk:function(){					
						$.post("/member/order/confrim_receive_order/",{"token":getCookie("token"),"sn":sn},function(message){
							layer.msg(message.content);
							if(message.type=="success"){
							   	   var id=$this.attr("date_id");
							   	   var orderName=$this.parents("li").find(".orderName").text();
							   	   if(!common.main.is_empty(orderName)){
								   	    var reg=new RegExp("/$");    
								   	    if(reg.test(orderName)){
								   	     	orderName=orderName.substring(0,orderName.length-1)
								   	    } 
							   	   }
							  	   $.get("/member/review/hrReview/",{"id":id,"orderName":orderName},function(result){
									     $("#hr-eval-modal div").remove();
								         if(result.div!=-1){
								            $("#hr-eval-modal").append(result);
								         }
						  		   });
							   	  $("#hr-eval-modal").modal("show")
							}
						});					
					}
				});	    		
	        });
	        //订单下拉框
            $(".wdddDiv .orderHead .info").click(function()  
		    {  
		        $(this).css({backgroundImage:"url(down.png)"}).next("ul.select-box").slideToggle(300).siblings("ul.select-box").slideUp("slow");  
		        $(this).siblings().css({backgroundImage:"url(left.png)"});  
		    });

	    	//工单列表状态
	    	$(document).on("click",".workorder_head .span_select s",function(){
	    		if($(this).find(".select_box").css("display") == "none"){
	    			$(this).find(".select_box").css("display","block");
	    			$(this).find("i").css({
	    				"transform":"rotate(180deg)",
	    				"top":"-1px"
	    			});
	    		}else{
	    			$(this).find(".select_box").css("display","none");
	    			$(this).find("i").css({
	    				"transform":"rotate(0deg)",
	    				"top":"5px"
	    			});
	    		}
	    		return false
	    	});	   

	    	$(document).on("click",".workorder_head .select_box s",function(){
	    		var s_text = $(this).text();
	    		$(this).addClass("current").siblings().removeClass("current");
	    		$(this).parent("s").find("b").text(s_text);
	    		$(".workorder_head .span_select i").css({
	    			"transform":"rotate(0deg)",
	    			"top":"5px"
	    		});	    		
	    		$(this).parents(".select_box").css("display","none");
	    	});    	
	    	//工单创建
	    	$(document).on("click",".create_step .create_item a",function(){
	    		var data_create = $(this).attr("data_create");
	    		$(".member_workorder_create .create_tab span").eq(1).addClass("current").siblings().removeClass("current");
	    		$(".create_content .create_step").eq(1).addClass("current").siblings().removeClass("current");
			});
			$(document).on('click',function(){
				$(".myhome-select-cv .select-box").removeClass("show");
				$(".zxjl-ul .set-box").removeClass("show");
			    $(".workorder_head .select_box").css("display","none");
	    		$(".workorder_head .span_select i").css({
	    			"transform":"rotate(0deg)",
	    			"top":"5px"
	    		});	
			});
			
	    	$(document).on("click",".reply_form_div",function(){
	    		$(this).hide();
	    		$(".reply_form .textarea_editor").css("display","block");
	    	});	
	    	//工单类型选择点击事件
	    	$(document).on("click", ".create_item a", function(){
	    		$(this).closest("div.create_item").addClass("type_selected");
	    	});
	    	//创建工单操作
	    	var _workOrderIsSubmit = true;
	    	$(document).on('click', '.create_btn button', function(){
	    		var $this = $(this);
	    		if(!_workOrderIsSubmit){
	            	return;
	          	}
	    		//获取工单类型
	    		var type = $(".type_selected a").attr("data_create");
	    		//获取工单标题
	    		var title = $(".create_form [name=title]").val();
	    		//获取工单描述
	    		var description = $(".create_form [name=description]").val();
	    		//获取微信号
	    		var weixin = $(".create_form [name=weixin]").val();
	    		//获取工单附件
	    		var attachment = $(".create_form [name=attachment]").val();
	    		if(title == "" || description == "" || weixin == ""){
	    			layer.msg("标题   | 问题描述 | 微信号都不能为空喔！");
	    			return;
	    		}
                $this.text('正在提交...');
                _workOrderIsSubmit = false;
	    		$.ajax({
	    			type:"post",
	    			dataType:"json",
	    			url:"/member/workOrder/create_submit/",
	    			data:{
	    				type:type,
	    				title:title,
	    				description:description,
	    				weixin:weixin,
	    				attachment:attachment
	    			},
	    			success:function(data){
	    				if(data.type == "success"){
	    					location.href = "/member/workOrder/";
	    				}else{
	    					layer.msg(data.content);
	    					$this.text('提交');
                			_workOrderIsSubmit = true;
	    				}
	    			},
	    			error:function(jqXHR,textStatus,errorThrown){
		              $this.text('提交');
		              _workOrderIsSubmit = true;
		            }
	    		})
	    	});
	    	//工单回复操作
	    	$(document).on('click', '#work_order_reply_btn', function(){
	    		//获取SN号
	    		var sn = $(this).closest("div.reply_btn").attr("data-value");
	    		//获取回复的内容
	    		var content = $("textarea[name=content]").val();
	    		$.ajax({
	    			type:"post",
	    			url:"/member/workOrder/"+sn+"/reply/",
	    			data:{
	    				content: content
	    			},
	    			dataType:"json",
	    			success:function(data){
	    				if(data.type == "success"){
	    					location.reload();  //回复成功刷新页面
	    				}else{
	    					layer.msg(data.content);
	    				}
	    			}
	    		});
	    		
	    	});
	    	//工单状态更新操作
	    	$(document).on('click', '#work_order_solved_btn', function(){
	    		//获取SN号
	    		var sn = $(this).closest("div.reply_btn").attr("data-value");
	    		$.ajax({
	    			type:"post",
	    			url:"/member/workOrder/"+sn+"/solved/",
	    			data:{},
	    			dataType:"json",
	    			success:function(data){
	    				if(data.type == "success"){
	    					location.href = "/member/workOrder/"; //状态更新成功后跳转到工单首页
	    				}else{
	    					layer.msg(data.content);
	    				}
	    			}
	    		});
	    	});
            //我的订单顶部提示关闭
            $(".jl-member-order .timeout_tips a").on("click",function(){
                $(this).parents(".timeout_tips").remove();
            });
            //点击免费试用按钮检查登录状态
			$(document).on("click",".member_upgrade_modal .free_body .button,#login",function(){
				common.main._500dtongji("PC-MB03.1.1-模板商城-会员充值弹窗-弹窗底部-左下角-免费试用");
				//检测是否登录
				if(!common.main.vip_check_login_event()){
					$("#tips-common-modal").modal("hide");
				};		
			});	            		    	
	    },
	    create_editor:function(){//创建工单富文本
	    	// http://www.wangeditor.com/
			var editor = new wangEditor('create_editor');
	        // 上传图片
	        editor.config.uploadImgUrl = '/file/upload/';
	        editor.config.uploadImgFileName = 'file';
	        editor.config.uploadParams = {
                token: getCookie("token"),
                "fileType":"workOrderFile"
            };
	        // 自定义上传事件
	        editor.config.uploadImgFns.onload = function (resultText, xhr) {
	            // resultText 服务器端返回的text
	            // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
	            // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
	            var originalName = editor.uploadImgOriginalName || '';  
	            // 如果 resultText 是图片的url地址，可以这样插入图片：
				var html='<img src=' + resultText + ' alt="' + originalName + '"  style="max-width:100%;"/>';
	            editor.command(null, 'insertHtml', html);
	            // 如果不想要 img 的 max-width 样式，也可以这样插入：
	            // editor.command(null, 'InsertImage', resultText);
	        };
	        editor.config.uploadHeaders = {
	            // 'Accept' : 'text/x-json'
	        }
	        editor.config.menus = [
		        'img',
	     	];
	        editor.create();
	        var textArea = $(".wangEditor-txt");
	        var numItem = $(".textarea_counter .word");
	        common.main.words_deal_textarea(textArea,numItem);    	
	    },
		team_vip_event:function(){
            // 引导弹框
	    	var inner, inner_top, inner_left;
            try{
            	if(window.localStorage && localStorage.getItem("has_guide") === null && $('.team_main').length> 0){
    				inner_top = $('.tt_detail + .huiyuan-upload').offset().top +40;
    				inner_left = $('.tt_detail + .huiyuan-upload').offset().left -7;
                    inner = '<div class="team_guide_masking"><div class="team_guide_modal" style="top:'+
    					inner_top+ 'px; left:'+
    					inner_left+'px'+
    					';"><span>点击这里可以查看会员权限哦~</span><a href="javascript:;" class="team_guide_close">我知道了</a></div></div>';
    				$(inner).appendTo($('body'));
                }else if(window.localStorage && localStorage.getItem("has_guide") === null && $('.team_child').length> 0){
                    inner_top = $('.tt_detail').offset().top +30;
                    inner_left = $('.tt_detail').offset().left;
                    inner = '<div class="team_guide_masking"><div class="team_guide_modal" style="top:'+
                        inner_top+ 'px; left:'+
                        inner_left+'px'+
                        ';"><span>点击这里可以查看会员权限哦~</span><a href="javascript:;" class="team_guide_close">我知道了</a></div></div>';
                    $(inner).appendTo($('body'));
                }
                $('.team_guide_masking .team_guide_close,.team_guide_masking').on('click',function(){
                	localStorage.setItem('has_guide','true');
                	$('.team_guide_masking').fadeOut().remove();
    			});
            }catch(e){
        		console.log("显示团体会员蒙层错误~");
        	}
            //	复制邀请链接
            $("#add_team_child #copyUrl").on("click",function(){
                var str = $(".shareContent span").html();
                common.main.set_copyToClipBoard(str);
                $("#copyUrl").html("复制成功");
                setTimeout(function(){
                    $("#copyUrl").html("复制链接")
                },2000);
                layer.msg("复制成功~");
                $("#add_team_child").modal("hide");
            });
            //	放大流程图片
			$('.team_tutorial_list .team_tutorial_amplify').on('click',function(){
				var src = $(this).parent('.team_tutorial_list').find('img').attr('src');
				$('.team_tutorial_amplify_masking img').attr('src',src);
				$('.team_tutorial_amplify_masking').fadeIn();
				$('body').css('overflow-y','hidden')
			});
            $('.team_tutorial_amplify_masking').on('click',function(){
            	$(this).fadeOut();
                $('body').css('overflow-y','auto');
                $(this).find('img').attr('src','');
			});
            //生成团体会员邀请链接的点击事件
        	$("#genInviLinks").click(function(){
        		$.ajax({
        	        type: "post",
        	        dataType: "json",
        	        url: '/member/team/gengerat_code/',
        	        data: {},
        	        success: function (data) {
        	        	if(data.type == "success"){
        	        		$(".shareContent span").text("http://"+window.location.hostname+"/bind/team_vip/?code="+data.content);
        		        	$("#add_team_child").modal("show");
        	        	}else{
        	        		layer.msg(data.content);
        	        	}
        	        }
        	    });
        	});
		},
		page_form_event:function(){
			var $listForm = $("#pf_listForm");
			var $pageNumber = $("#pf_pageNumber");
			var $selectOption = $listForm.find(".pf_selectOption");

			//自定义下拉按钮
			$selectOption.click(function(){
				var $this = $(this);
				var $name = $("[name="+$this.attr("pf-data-name")+"]");
				$name.val($this.attr("pf-data-value"));
				$listForm.submit();
				return false;
			});

			//页码跳转
			$.page_form_pageSkip = function(pageNumber){
				$pageNumber.val(pageNumber);
				$listForm.submit();
				return false;
			}
		},
	    resume_share:function(){//分享简历
	    	$("#shareResume-modal #copyUrl").on("click",function(){
	        	 var str = $(".shareContent span").html() + $(".shareContent input").val()+"/";
	        	 common.main.set_copyToClipBoard(str);
	             $("#copyUrl").html("复制成功");
	             setTimeout(function(){
	                 $("#copyUrl").html("复制链接")
	             },2000);
	        });
	    },
	    set_copyToClipBoard:function (str) {
	        //复制到剪贴板
	    	 var copyInput = $("<input type='text' value='"+ str +"' style='opacity:1;position:absolute;top:20px;z-index:999;' id='copyText'>");
	         $(".in").length >0 ? dom = $(".in")[0] : dom = "body"
	         copyInput.appendTo(dom);
	         document.getElementById("copyText").select();
	         document.execCommand("copy",false,null)
	         $("#copyText").remove();
	    },
	    is_empty:function(str){
	    	if(str==null||str==""||str==undefined){
	    		return true;
	    	}else{
	    		return false;
	    	}
	    },
	    resume_confirm:function(options){//系统确认性弹框
			var settings = {
					title:"操作提示标题",
					content:"操作提示内容",
					content_html:"",
                    tips_modal_class:"confirm_modal",
					modal_class:"tips-modal-content",
					ok: "确定",
					cancel: "取消",
					onOk: null,
					onCancel: null
			};
			$.extend(settings, options);
			var html='<div class="modal smallmodal fade" id="tips-common-modal">'+
			'	<div class="modal-dialog">'+
			'		<div class="modal-content show-swal2">'+
			'			<div class="modal-header">'+
			'				<span class="tips-title"></span>'+
			'				<button type="button" class="close 500dtongji" data_track="PC-MB03.1.1-模板商城-会员弹窗-弹窗-通用-关闭按钮" data-dismiss="modal" aria-hidden="true"></button>'+
			'			</div>'+
			'			<div class="modal-body">'+
			'				<span class="tips-content"></span>'+
			'			</div>'+
			'			<div class="modal-footer">'+
			'				<button type="button"  class="button submit">确定</button><button type="button"  data-dismiss="modal" aria-hidden="true" class="button cancel">取消</button>'+
			'			</div>'+
			'		</div>'+
			'	</div>'+
			'</div>'
			var $modal=$(html);
			//组装弹框内容
			$modal.find(".tips-title").text(settings.title);
            $modal.addClass(settings.tips_modal_class);
			$modal.find(".modal-content").addClass(settings.modal_class);
			$("#tips-common-modal").remove();
			if(settings.content_html==""){
				$modal.find(".tips-content").text(settings.content);
			}else{
				$modal.find(".tips-content").remove();
				$modal.find(".modal-body").html(settings.content_html);
			}
			$modal.find("button.submit").text(settings.ok);
			$modal.find("button.cancel").text(settings.cancel);
			$modal.appendTo("body");
			var $confirm_btn=$("#tips-common-modal").find("button.submit");
			var $cancel_btn=$("#tips-common-modal").find("button.cancel");
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
			$modal.modal("show");
			//弹框关闭通用方法
			function tips_modal_close(){
				$modal.modal("hide");
				$modal.remove();
				$(".modal-backdrop").remove();
				$("body").removeClass("suggestModal");
				$("body").removeClass("modal-open");
			}
		},
		resume_danger_alert: function(callback){ // 警告性弹窗
			var html = '<div class="danger_alert_img"></div><div class="danger_alert_title">您的账户已被封号</div>'+
						'<div class="danger_alert_msg">据系统检测，您的账户存在倒卖、转手、置换、抵押、有价交易等非法牟利行为，根据五百丁用户协议相关规定，五百丁简历有权严肃处理，并对您的账号进行永久封号。</div>';
			common.main.resume_confirm({
				content_html: html,
				modal_class:"danger_alert_content",
				cancel: "",
				onCancel: function() {
					if(callback) callback();
				}
			});
		},
		getUrlParamsValue:function(name){//获取url中指定参数的值
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
			var r = window.location.search.substr(1).match(reg);
			if (r!=null) return (r[2]); return null;
		},
		repairResumeLeftHeight:function(){//修复简历左侧高度
			var resumeHeight = $(".wbdCv-resume").height();
			$(".wbdCv-resume").css({"height" : resumeHeight + "px"});
		},
		date_format:function(date,format){
			var month=date.getMonth() + 1;
			if(month<10){
				month="0"+month;
			}
			var o = {
				"M+" :month, // month
	
				"d+" : date.getDate(), // day
	
				"H+" : date.getHours(), // hour
	
				"m+" : date.getMinutes(), // minute
	
				"s+" : date.getSeconds(), // second
	
				"q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
	
				"S" : date.getMilliseconds()
			}

			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for ( var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]: ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return format; 
		},
		isEffect:function(sourcetStr,targetStr){//内容是否有效
			try{
				if(common.main.is_empty(sourcetStr)||$.isEmptyObject(sourcetStr)){
					return false;
				}
				if(common.main.is_empty(targetStr)){
					return true;
				}
				sourcetStr=JSON.stringify(sourcetStr).replace(/\s/g, "");
				targetStr=JSON.stringify(targetStr).replace(/\s/g, "");
				if(sourcetStr==targetStr){
					return false;
				}else{
					return true;
				}
			}catch(e){
				console.log("内容判断异常。。。。"+e);
				return false;
			}
		},
		init_authority_lock:function(){//初始化会员权限锁
			$.get("/cvresume/get_member_authoritys/",function(message){
				if(message.type=="success"){
					var ths=JSON.parse(message.content);
					$.each(ths,function(index,val){
						$('[data_auth="'+val+'"]').removeClass("wbd-vip-lock");
					});
				}
			});
			$(document).on("click",".wbd-vip-lock",function(){
				var data_show_vip_type = $(this).attr("data-show-vip-type");
				var $this=$(this);
				if(common.main.is_empty(data_show_vip_type)){
					data_show_vip_type=="super";
				}
				var opt=$this.attr("data_auth");
				//获取权限消息
				$.ajax({
					async:false,
					cache:false,
					type:"GET",
					data:{"opt":opt},
					url:"/cvresume/validate_opt_auth/",
					success:function(message){
						if(message.type=="warn"){
							common.main.vip_opt_tips(data_show_vip_type);
						}else if(message.type=="error"){
							layer.msg(message.content);
							return false;
						}else if(message.type=="success"){
							$this.removeClass("wbd-vip-lock");
							$this.attr("readonly","");
							$this.trigger("click");
							return false;
						}
					}
				});
			});
		},
		select_template:function(){//模板滚动加载
			var loading=true;
	    	var number=2;
	    	$('.setNb').click(function(){
	    		 number=2;
	    		 loading=true;
	    	})
	    	$('.chose_resume_module').on('scroll',function(){
	   		 	var $this =$(this),
	            viewH =$(this).height(),//可见高度
	            contentH =$(this).get(0).scrollHeight,//内容高度
	            scrollTop =$(this).scrollTop();//滚动高度
	   		 	if(loading){
		            if(contentH - viewH - scrollTop <= 0) {
		                var resumeBankType=$(".select_type input[type=radio]:checked").attr("data-lang")
		                $.get("/cvresume/createcv_select_template/",{"resumeBankType":resumeBankType,"pageNumber":number},function(result){
		           			if(result==""||result==null||result.indexOf("li")==-1){
		           				layer.msg("没有更多了");
		   			      	    loading=false;
		   			      	}else{
			   			        $(".chose_resume_module ul").append(result);
			   			        number++;
		   			        }
		           		})
		          	}
	   		    }
	    	});
		},
		//会员登录状态检查
		vip_check_login_event:function(){
    		//检测是否登录
    		if(!$.checkLogin()) {   
    			if(typeof show_login_modal != "undefined" && typeof(show_login_modal)=="function"){
    				show_login_modal();
    			}else{
    				window.open('/login/');
    			}
    			return false;
    		}	
    		return true;
		},
		//会员类型判断（判断显示是普通弹框还是差价弹框）
		vip_opt_tips:function(data_show_type){
			//检测是否登录
    		var pathName = location.pathname;
    		if(pathName.indexOf("order/vip_member/") <= 0){
    			if(!common.main.vip_check_login_event()){
    				return;
    			}   			
    		}
			//判断是否存在节点
			var token=getCookie("token");
			if($("#viporderform").length<=0){
				var from_html='<form id="viporderform" action="/member/order/create_vip_order/" method="post" target="_blank" novalidate="novalidate"><input name="token"type="hidden" value="'+token+'"/><input type="hidden"  name="productid" id="vipproductid" value=""><input type="hidden"  name="price" id="vippayprice" value=""><input type="hidden"  name="paytype" id="vippaytype" value=""></form>';								
				$("body").append(from_html);				
			}		
			$.ajax({
				type:"GET",
				url:"/order/up_vip/",
				success:function(data){
					var _data = JSON.parse(data.content);
					if (_data.type =="common"){
						common.main.vip_common_modal(_data,data_show_type);
					} else if(_data.type =="up"){
						common.main.vip_spread_modal(_data);
					}							
				}
			});									
		},
		//会员弹框事件处理（会员类型切换效果，时间类型切换效果，初始化会员类型）
		vip_modal_event:function(data,data_show_type){
			//初始化获取信息
			var _id,_price,_pay_type,_diff_price,_sub_price;		
			_price = $(".member_upgrade_modal .time_list.checked").attr("vip-price");	
			_id = $(".member_upgrade_modal .time_list.checked").attr("vip-id");
			_pay_type = $(".member_upgrade_modal .con_pay input[ischecked='checked']").attr("pay_id");
			if(data.type == 'up'){				
				_diff_price = $(".member_upgrade_modal .time_list.checked").attr("vip-diff-price");
				if (typeof(_diff_price) != "undefined"){
					_sub_price = _price-_diff_price;
				}else{
					_sub_price = _price;
				}
				_sub_price = _sub_price.toFixed(1);				
			}
			//更新数据方法
			function push_data(){
				$(".member_upgrade_modal .con_num .price").attr("data-type",_pay_type);
				$(".member_upgrade_modal .con_num .price").attr("data-id",_id);	
				if(data.type == 'up'){
					$(".member_upgrade_modal .con_num .price").text(_diff_price);
					$(".member_upgrade_modal .con_num .sub_price").text(_sub_price);
					$(".member_upgrade_modal .con_num .price").attr("data-diff-price",_diff_price);
				}else{
					$(".member_upgrade_modal .con_num .price").text(_price);
					$(".member_upgrade_modal .con_num .price").attr("data-price",_price);
										
				}				

			}
			push_data();
			//普通升级类型切换数据更新
			if(data.type != 'up'){
				$(".member_upgrade_modal .time_list").click(function(){
					$(this).addClass("checked").siblings().removeClass("checked");
					_price = $(".member_upgrade_modal .time_list.checked").attr("vip-price");
					_id = $(".member_upgrade_modal .time_list.checked").attr("vip-id");
					if(data.type == 'up'){
						_diff_price = $(".member_upgrade_modal .time_list.checked").attr("vip-diff-price");
						_sub_price = _price-_diff_price;
						_sub_price = _sub_price.toFixed(1);
					}
					push_data();		
				});				
			}
			//支付方式选择
			$(".member_upgrade_modal .con_pay label").click(function(){
				$(this).find("input").attr("ischecked","checked");
				$(this).siblings().find("input").attr("ischecked","");
				_pay_type = $(".member_upgrade_modal .con_pay input[ischecked='checked']").attr("pay_id");
				push_data();			
			});

		},
		
		//会员普通升级弹框
		vip_common_modal:function(data,data_show_type){
			var pathName = location.pathname;
			var _location;
			if(pathName.indexOf("/template") != -1){
				 _location="模板商品页";
    		}else if(pathName.indexOf("/ppt") != -1){
    			_location="PPT商品页";
    		} 
    		//获取价格
    		var three_month_price = data.superVip_three_month.price,
    		six_month_price = data.superVip_six_monty.price,
    		one_year_price = data.superVip_year.price,  
    		//计算每个月价格，保留小数点一位
    		three_price = (three_month_price/3).toFixed(1),
    		six_price = (six_month_price/6).toFixed(1),
    		year_price = (one_year_price/12).toFixed(1),
    		//获取会员id
    		three_month_id = data.superVip_three_month.id,
    		six_month_id = data.superVip_six_monty.id,
    		one_year_id = data.superVip_year.id;   		
			var upgrade_html = '<div class="free_body">'+
							'<div class="title"><i></i></div>'+
							'<h3 class="title">基本权限</h3>'+
							'<div class="con">	'+							
								'<div class="item"><span>简历投递上限</span><span class="right">10份</span></div>'+
								'<div class="item"><span>简历保存上限</span><span class="right">3份</span></div>'+
								'<div class="item"><span>设置简历封面</span><span class="right"><i></i></span></div>'+
								'<div class="item"><span>设置自荐信</span><span class="right"><i></i></span></div>'+
							'</div>'+
							'<div class="button">'+
								'<a>已注册</a>'+
							'</div>'+
						'</div>'+
						'<div class="upgrade_body">'+
							'<div class="title"><i></i></div>'+
							'<div class="con_text">'+
								'<h3 class="title">进阶权限</h3>'+
								'<div class="con">'+
									'<div class="item"><span style="color:#ff4500;">免费下载全站模板</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>简历投递上限</span><span class="right">无限</span></div>'+
									'<div class="item"><span>导出在线简历</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>简历保存上限</span><span class="right">100份</span></div>'+
									'<div class="item"><span>更换在线模板    </span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>导入站外简历</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>设置简历域名</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>自定义图标</span><span class="right"><i></i></span></div>'+
								'</div>'+
							'</div>'+
							'<div class="con_time">'+
								'<h3 class="title">选择会员有效期</h3>'+
								'<div class="con clearfix">'+
									'<div class="time_list three_month" vip-price ="'+three_month_price+'" vip-id="'+three_month_id+'">'+
										'<s></s>'+
										'<p class="time">3个月</p>'+
										'<p class="price">￥<i>'+three_price+'</i>/月</p>'+										
									'</div>'+
									'<div class="time_list one_year" vip-price ="'+six_month_price+'" vip-id="'+six_month_id+'">'+
										'<s></s>'+
										'<p class="time">6个月</p>'+
										'<p class="price">￥<i>'+six_price+'</i>/月</p>'+								
									'</div>'+
									'<div class="time_list long checked" vip-price ="'+one_year_price+'" vip-id="'+one_year_id+'">'+
										'<span></span>'+
										'<s></s>'+
										'<p class="time">12个月</p>'+
										'<p class="price">￥<i>'+year_price+'</i>/月</p>'+										
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="con_pay">'+
								'<h3 class="title">选择支付方式</h3>'+
								'<div class="con"><label class="wx"><input pay_id="weixin" name="pay_type" type="radio" checked="checked" ischecked="checked"/>微信</label><label class="zfb"><input name="pay_type" pay_id="alipay" type="radio"/>支付宝</label></div>'+
							'</div>'+
							'<div class="con_num">'+
								'<span>应付：</span><i>￥</i><span class="price">18.0</span>'+
							'</div>'+
							'<div class="discount">'+
								'<p class="discount_info">低至7折</p>'+
								'<button type="button" class="discount_btn">邀请好友砍价</button>'+
							'</div>'+
						'</div>';

			common.main.resume_confirm({
				tips_modal_class:"member_upgrade_modal pt",
				modal_class:"member_upgrade_content",
				content_html:upgrade_html,
				ok:"立即购买",
				onOk:function(){
					//检测是否登录
					if(!common.main.vip_check_login_event()){
	    				return;
	    			};
	    			common.main._500dtongji("PC-MB03.1.1-模板商城-会员充值弹窗-弹窗底部-右下角-立即购买");
					var pid= $(".member_upgrade_modal .con_num .price").attr("data-id");
					var price= $(".member_upgrade_modal .con_num .price").attr("data-price");
					var paytype= $(".member_upgrade_modal .con_num .price").attr("data-type");
					if(pid==null||pid==""){
						layer.msg('获取不到对应的购买信息，请刷新后重试');
						return;
					}else{
						$("#vipproductid").val(pid);
						$("#vippayprice").val(price);
						$("#vippaytype").val(paytype);
						$(".payType_modal").stop().show();
						$("#viporderform").submit();
						common.main.pay_tips_modal();
						$(".payTips_modal").stop().show();						
						
					}	
				}
			
			});
		    common.main.vip_modal_event(data,data_show_type);
		    $.get("/member/bargain/get_bargain_status/", function(data) {
				if(data.type === "success"){
					var _data = JSON.parse(data.content);
					if(_data.status === "running" ||  _data.status === "startUp") {
						$(".member_upgrade_modal button.discount_btn").click(function(){
					    	//弹框  切换
							$("#tips-common-modal").modal("hide");
					       	common.main.activity_down_price(_data.url);
					    });
					} else if(_data.status === "completed"){
						$(".member_upgrade_modal button.discount_btn").text("砍价完成");
						$(".member_upgrade_modal button.discount_btn").click(function(){
							location.href = location.origin + "/member/order/";
						});
					}
				}
			});
			//免费试用按钮，检测是否登录
    		if($.checkLogin()){
    			$(".member_upgrade_modal .free_body .button a").text("已注册");
    			$(".member_upgrade_modal .free_body .button").removeClass("free");
    		}else{
    			$(".member_upgrade_modal .free_body .button a").text("免费试用");
    			$(".member_upgrade_modal .free_body .button").addClass("free");
    		}				
		},
		//差价升级弹框		
		vip_spread_modal:function(data,data_show_type){
			var pathName = location.pathname;
			var _location;
			if(pathName.indexOf("/template") != -1){
				 _location="模板商品页";
    		}else if(pathName.indexOf("/ppt") != -1){
    			_location="PPT商品页";
    		}
    		    		
    		//获取三个月，六个月，一年的价格
    		var three_month_price = data.superVip_three_month.price,
    		six_month_price = data.superVip_six_monty.price,
    		one_year_price = data.superVip_year.price,  
    		//计算每个月价格，保留小数点一位
    		three_price = (three_month_price/3).toFixed(1),
    		six_price = (six_month_price/6).toFixed(1),
    		year_price = (one_year_price/12).toFixed(1),
    		//获取三个月，六个月，一年的差价价格
    		three_month_diffPrice = data.superVip_three_month.diffPrice,
    		six_month_diffPrice = data.superVip_six_monty.diffPrice,
    		one_year_diffPrice = data.superVip_year.diffPrice,    
    		
    		three_month_id = data.superVip_three_month.id,
    		six_month_id = data.superVip_six_monty.id,
    		one_year_id = data.superVip_year.id;   
    		
    		
    		
			var upgrade_html = '<div class="free_body">'+
							'<div class="title"><i></i></div>'+
							'<h3 class="title">基本权限</h3>'+
							'<div class="con">'+								
								'<div class="item"><span>简历投递上限</span><span class="right">10份</span></div>'+
								'<div class="item"><span>简历保存上限</span><span class="right">3份</span></div>'+
								'<div class="item"><span>设置简历封面</span><span class="right"><i></i></span></div>'+
								'<div class="item"><span>设置自荐信</span><span class="right"><i></i></span></div>'+
							'</div>'+
							'<div class="button">'+
								'<a>已注册</a>'+
							'</div>'+
						'</div>'+
						'<div class="upgrade_body">'+
							'<div class="title"><i></i></div>'+
							'<div class="con_text">'+
								'<h3 class="title">进阶权限</h3>'+
								'<div class="con">'+
									'<div class="item"><span style="color:#ff4500;">免费下载全站模板</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>简历投递上限</span><span class="right">无限</span></div>'+
									'<div class="item"><span>导出在线简历</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>简历保存上限</span><span class="right">100份</span></div>'+
									'<div class="item"><span>更换在线模板    </span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>导入站外简历</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>设置简历域名</span><span class="right"><i></i></span></div>'+
									'<div class="item"><span>自定义图标</span><span class="right"><i></i></span></div>'+
								'</div>'+
							'</div>'+
							'<div class="con_time">'+
								'<h3 class="title">选择会员有效期</h3>'+
								'<div class="con clearfix">'+
									'<div class="time_list three_month" vip-price ="'+three_month_price+'" vip-id="'+three_month_id+'" vip-diff-price="'+three_month_diffPrice+'">'+
										'<s></s>'+
										'<p class="time">3个月</p>'+
										'<p class="price">￥<i>'+three_price+'</i>/月</p>'+										
									'</div>'+
									'<div class="time_list one_year" vip-price ="'+six_month_price+'" vip-id="'+six_month_id+'" vip-diff-price="'+six_month_diffPrice+'">'+
										'<s></s>'+
										'<p class="time">6个月</p>'+
										'<p class="price">￥<i>'+six_price+'</i>/月</p>'+										
									'</div>'+
									'<div class="time_list long" vip-price ="'+one_year_price+'" vip-id="'+one_year_id+'" vip-diff-price="'+one_year_diffPrice+'">'+
										'<span></span>'+
										'<s></s>'+
										'<p class="time">12个月</p>'+
										'<p class="price">￥<i>'+year_price+'</i>/月</p>'+										
									'</div>'+
								'</div>'+
							'</div>'+
							'<div class="con_pay">'+
								'<h3 class="title">选择支付方式</h3>'+
								'<div class="con"><label class="wx"><input pay_id="weixin" name="pay_type" type="radio" checked="checked" ischecked="checked"/>微信</label><label class="zfb"><input name="pay_type" pay_id="alipay" type="radio"/>支付宝</label></div>'+
							'</div>'+
							'<div class="con_num">'+
								'<span>（已减免￥<s class="sub_price">15.9</s>）</span><span>应付：</span><i>￥</i><span class="price">18.0</span>'+
							'</div>'+
						'</div>';		
			common.main.resume_confirm({
				tips_modal_class:"member_upgrade_modal cj",
				modal_class:"member_upgrade_content",
				content_html:upgrade_html,
				ok:"付差价升级",
				onOk:function(){
					//检测是否登录
					if(!common.main.vip_check_login_event()){
	    				return;
	    			};
					var pid= $(".member_upgrade_modal .con_num .price").attr("data-id");
					var price= $(".member_upgrade_modal .con_num .price").attr("data-diff-price");
					var paytype= $(".member_upgrade_modal .con_num .price").attr("data-type");
					if(pid==null||pid==""){
						layer.msg('获取不到对应的购买信息，请刷新后重试');
						return;
					}else{
						$("#vipproductid").val(pid);
						$("#vippayprice").val(price);
						$("#vippaytype").val(paytype);
						$(".payType_modal").stop().show();
						$("#viporderform").submit();
						common.main.pay_tips_modal();
						$(".payTips_modal").stop().show();						
						
					}		
				}
			
			});	
			if(data.time_type =="three_month"){
				$(".member_upgrade_modal .time_list").eq(0).addClass("checked").siblings().removeClass("checked")
			}else if(data.time_type =="six_monty"){
				$(".member_upgrade_modal .time_list").eq(2).addClass("checked").siblings().removeClass("checked")
			}				
			common.main.vip_modal_event(data,data_show_type);
		},
		// 砍价活动  二维码弹窗
		activity_down_price: function(qrcode_url){
			// 显示砍价活动 二维码
	    	var qrcode_modal = '<div class="qrcode_modal_body">'+
	    							'<p class="qrcode_modal_tit">邀请好友砍价</p>'+
	    							'<p class="qrcode_modal_msg">使用微信扫一扫，邀请好友来砍价，最高可享7折会员优惠</p>'+
	    							'<div class="qrcode_modal_img"></div>'+
		    						'<p class="qrcode_modal_footer">砍价成功并确认支付后，重新登录账号继续其它操作</p>'+
	    						'</div>';
			common.main.resume_confirm({
				tips_modal_class: "member_qrcodeModal preserve-3d",
				modal_class: "member_qrcodeModal_content preserve-rotateY",
				content_html: qrcode_modal
			});
			$(".member_qrcodeModal_content").removeClass("show-swal2");
			// 引入js文件
			$.getScript("/resources/plugin/jq-styleqrcode/jquery.qrcode.js", function(){
				// 生成二维码
				$(".member_qrcodeModal .qrcode_modal_img").qrcode({
		            render: "canvas",			//设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
		            text: location.origin + "/" + qrcode_url,		//扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
		            width: "140",				//二维码的宽度
		        	height: "140",				//二维码的高度
		           	background: "#ffffff",		//二维码的后景色
		           	foreground: "#008a66",		//二维码的前景色
		           	src: "/resources/500d/common/images/qrcodeIcon_logo.png"	//二维码中间的图片
		       	});
		       	var timer,
					time = 2000;
				timer = setTimeout(intervalreq, time);
				function intervalreq(){
					time += 200;
					// 定时器递增请求 是否已访问手机端网页
					$.get("/member/bargain/find_member_scan_code/", function(data){
						if(data.type === "success") {
							var _data = JSON.parse(data.content);
							if(_data) {
								// 判断 返回的数据  是否true  然后关闭setTimeout
								clearTimeout(timer);
								// 重新渲染弹窗内容
								$(".qrcode_modal_body").find(".qrcode_modal_tit").remove();
								$(".qrcode_modal_body").find(".qrcode_modal_msg").remove();
								$(".qrcode_modal_body").find(".qrcode_modal_img").remove();
								var downtime = 5,
									scanhtml = '<i class="icon"></i><p class="scan_msg">扫码完成，请在手机端上操作</p><p class="scan_time">（<span>'+downtime+'</span>s后自动关闭）</p>';
								$(".member_qrcodeModal_content .qrcode_modal_body").append($(scanhtml));
								// 定时器关闭弹窗
								var interval = setInterval(function(){
									downtime--;
									$(".member_qrcodeModal_content .qrcode_modal_body").find(".scan_time span").html(downtime);
									if(downtime <= 0) {
										//弹框关闭通用方法
										$("#tips-common-modal").modal("hide");
										$("#tips-common-modal").remove();
										$(".modal-backdrop").remove();
										$("body").removeClass("suggestModal");
										$("body").removeClass("modal-open");
										clearInterval(interval);
									}
								}, 1000);
							}
						}
					});
					// 重新设置定时器调用当前函数 请求 接口
					timer = setTimeout(intervalreq, time);
				}
				// 主动关闭弹窗清除定时器
				$(".member_qrcodeModal_content").find("button.close").click(function(){
					clearTimeout(timer);
				});
			});
		},
	    //支付返回提示弹框
		pay_tips_modal:function(){			
			common.main.resume_confirm({
				title:"支付提示",
				tips_modal_class:"payTips_modal",
				content:"请在你新打开的页面上完成付款，支付完成后，请根据您支付的情况点击下面按钮。",
				ok:"支付完成",
				cancel:"支付遇到问题",
				onOk:function(){									
		    		var pathName = location.pathname;
		    		if(!common.main.is_empty(common.main.getUrlParamString("redirectUrl"))){
		    			location.href=common.main.getUrlParamString("redirectUrl");
		    		}else if(pathName.indexOf("order/vip_member/") > 0 || pathName.indexOf("member/") > 0){
		    			location.href="/member/order/"; 
		    		}else{
		    			location.reload();
		    		}	    	
				},
				onCancel:function(){
					window.open("http://help.500d.me");
				}
			});		
			$(".modal-backdrop").remove();
			
		},
		//模板下载超出数量提示框
		temp_download_modal:function(){
			common.main.resume_confirm({
				title:"非正常操作提示",
				content:"你的下载频率过高，已暂时禁用你的下载功能，24小时后可继续下载。",	
                tips_modal_class:"template_download_modal",
				ok:"确定",
				cancel:"",
				onOk:function(){
				
				}
		    });
		},
		resumeOperationLogUpload:function(resumeId,opt,headerDesc,optExtDesc){//操作日志上报
			if(common.main.is_empty(resumeId)){
				return;
			}
	    	$.post('/cvresume/operationLog/upload/',{"resumeId" : resumeId,"opt":opt,"headerDesc": headerDesc, "optExtDesc":optExtDesc},function(result){
	    		if(result.type != "success"){
	    			console.log(result.content);
	    		}
			});
	    },
	    //计算天数
        DateDiff:function(sDate1,  sDate2){//sDate1和sDate2是2006-12-18格式
	        var  aDate,  oDate1,  oDate2,  iDays
	        aDate  =  sDate1.split("-")
	        oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2006格式
	        aDate  =  sDate2.split("-")
	        oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])
	        iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
	        return  iDays
    	},
    	GetDateStr:function(AddDayCount) { 
			var dd = new Date(); 
			dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
			var y = dd.getFullYear(); 
			var m = dd.getMonth()+1;//获取当前月份的日期 
			var d = dd.getDate(); 
			return y+"-"+m+"-"+d; 
		},
		moveBackground:function(classname){
			var lFollowX = 0,
			      lFollowY = 0,
			      x = 0,
			      y = 0,
			      friction = 1 / 30;
			
			function moveBackground() {
			x += (lFollowX - x) * friction;
			y += (lFollowY - y) * friction;
			
			translate = 'translate(' + x + 'px) scale(1.1)';
			
			$(classname).css({
			  '-webit-transform': translate,
			  '-moz-transform': translate,
			  'transform': translate
			});
			
			window.requestAnimationFrame(moveBackground);
			}
			
			$(window).on('mousemove click', function(e) {
			
			var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
			var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
			lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
			lFollowY = (10 * lMouseY) / 100;
			
			});
			
			moveBackground(); 			
		},
		//百度打点
		_500dtongji:function(lable){
			try{
				if(lable!=null&&lable!=""&&lable!=undefined){
					window._hmt && window._hmt.push(['_trackEvent', lable, 'click']);
				}
			}catch(e){
				console.log("统计埋点错误~");
			}
		},
		//获取设备信息
		get_device_info:function(){
			var _defaultDeviceInfo = {
		        pc:true,
		        ios:false,
		        android:false,
		        winPhone:false,
		        wechat:false
		    };

		    var _deviceInfo;
			try{
				var _ua = navigator.userAgent;
				var _pf = navigator.platform.toLocaleLowerCase();
			    var _isAndroid = (/android/i).test(_ua)||((/iPhone|iPod|iPad/i).test(_ua) && (/linux/i).test(_pf))
			        || (/ucweb.*linux/i.test(_ua));
			    var _isIOS =(/iPhone|iPod|iPad/i).test(_ua) && !_isAndroid;
			    var _isWinPhone = (/Windows Phone|ZuneWP7/i).test(_ua);
			    var _isWechat = (/micromessenger/gi).test(_ua);

			    _deviceInfo = {
			        pc:!_isAndroid && !_isIOS && !_isWinPhone,
			        ios:_isIOS,
			        android:_isAndroid,
			        winPhone:_isWinPhone,
			        wechat:_isWechat
			    };
			}catch(e){
				console.log("获取设备信息失败",e);
			}
			_deviceInfo = $.extend({}, _defaultDeviceInfo, _deviceInfo);
		    return _deviceInfo;
		},
		zx_mblist_event:function(){
			//列表鼠标经过效果
			$(".zx-mblist-box .list-con").each(function(){
				   $(this).on('mouseenter',function(e){
					   var e=e||window.event;
					   var angle=direct(e,this)
					   mouseEvent(angle,this,'in')
				   })
				   $(this).on('mouseleave',function(e){
					   var e=e||window.event;
					   var angle=direct(e,this)
					   mouseEvent(angle,this,'off')
				   })
			});
			function direct(e,o){
				 var w=o.offsetWidth;
				 var h=o.offsetHeight;
				 var top= o.offsetTop;                    //包含滚动条滚动的部分
				 var left= o.offsetLeft;
				 var scrollTOP=document.body.scrollTop||document.documentElement.scrollTop;
				 var scrollLeft=document.body.scrollLeft||document.documentElement.scrollLeft;
				 var offTop=top-  scrollTOP;
				 var offLeft= left- scrollLeft;
				 var ex= (e.pageX-scrollLeft)|| e.clientX;
				 var ey=(e.pageY-scrollTOP)|| e.clientY;
				 var x=(ex-offLeft-w/2)*(w>h?(h/w):1);
				 var y=(ey-offTop-h/2)*(h>w?(w/h):1);
			
				 var angle=(Math.round((Math.atan2(y,x)*(180/Math.PI)+180)/90)+3)%4 //atan2返回的是弧度 atan2(y,x)
				 var directName=["上","右","下","左"];
				 return directName[angle];  //返回方向  0 1 2 3对应 上 右 下 左
			}
			function mouseEvent(angle,o,d){ //方向  元素  鼠标进入/离开
				   var w=o.offsetWidth;
				   var h=o.offsetHeight;
			
				   if(d=='in'){
					   switch(angle){
						   case '上':
							   $(o).find(".hover-btn").css({left:0,top:-h+"px"}).stop(true).animate({left:0,top:0},300)
							   break;
						   case '右':
							   $(o).find(".hover-btn").css({left:w+"px",top:0}).stop(true).animate({left:0,top:0},300)
							   break;
						   case '下':
							   $(o).find(".hover-btn").css({left:0,top:h+"px"}).stop(true).animate({left:0,top:0},300)
							   break;
						   case '左':
							   $(o).find(".hover-btn").css({left:-w+"px",top:0}).stop(true).animate({left:0,top:0},300)
							   break;
					   }
				   }else if(d=='off'){
					   switch(angle){
						   case '上':
							   setTimeout(function(){
								   $(o).find(".hover-btn").stop(true).animate({left:0,top:-h+"px"},300)
							   },200)
							   break;
						   case '右':
							   setTimeout(function(){
								   $(o).find(".hover-btn").stop(true).animate({left:w+"px",top:0},300)
							   },200)
							   break;
						   case '下':
							   setTimeout(function(){
								   $(o).find(".hover-btn").stop(true).animate({left:0,top:h+"px"},300)
							   },200)
							   break;
						   case '左':
							   setTimeout(function(){
								   $(o).find(".hover-btn").stop(true).animate({left:-w+"px",top:0},300)
							   },200)
							   break;
					   }
				   }
			}
			
		},
		ppt_imgmove_event:function(){
	        // PPT缩略图 上 & 下 移动

	        //已修改
	        var ImgDown , ImgUp;
	        $("body").on('mouseenter','.imgUp',function(){
	            var $this = $(this).parent().find("img"), ImgTop = $this.css("top").substring(0,$this.css("top").indexOf("px"));
	            clearInterval(ImgUp);
	            ImgUp = setInterval(function(){
	                if(ImgTop < 0){
	                    ImgTop++;
	                    $this.css("top",ImgTop+"px");
	                }else{
	                    clearInterval(ImgUp);
	                }
	            },5)
	        });
	        $("body").on("mouseleave ",".imgUp",function(){
	            clearInterval(ImgUp)
	        });
	        $("body").on('mouseenter','.imgDown',function(){
	            var $this = $(this).parent().find("img"), ImgTop = $this.css("top").substring(0,$this.css("top").indexOf("px")), ImgH = $this.height();
	            clearInterval(ImgDown);
	            ImgDown = setInterval(function(){
	                if($this.height() > $this.parent().height()){
	                    if(-ImgTop == (ImgH - $this.parent().height())){
	                        clearInterval(ImgDown);
	                    }else{
	                        ImgTop--;
	                        $this.css("top",ImgTop+"px");
	                    }
	                }
	            },5)
	        });
	        $("body").on("mouseleave ",".imgDown",function(){
	            clearInterval(ImgDown)
	        });
	        // end			
		},
		getCheck:function(){
			var documentH = document.documentElement.clientHeight;
			var scrollH = document.documentElement.scrollTop || document.body.scrollTop;
			return documentH+scrollH>=common.main.getLastH() ?true:false;

		},
		getLastH:function(){//ppt-listItem为ul的id，listItem为li的class
			var wrap = document.getElementById('ul_listItem');
			var boxs = common.main.getClass(wrap,'li_item');
			return boxs[boxs.length-1].offsetTop+boxs[boxs.length-1].offsetHeight;
		},
		getClass:function(wrap,className){
			var obj = wrap.getElementsByTagName('*');
			var arr = [];
			for(var i=0;i<obj.length;i++){
				if(obj[i].className == className){
					arr.push(obj[i]);
				}
			}
			return arr;
		},		
		lazyLoadData:function(url){
			if(!common.main.is_empty(url)){
				var keyword = $("#search_btn").val();
				var type = $("#search_btn").attr('data_type');
				var sortType = $("#search_btn").attr('sort_type');
				$.get(
					url,
					{
						keyword:keyword,
						type:type,
						sortType:sortType,
						pageNumber:common.info.reloadWallfulPage
					},
					function(data){
		            	common.info.isReload=true;
			            if(data == ""){
			            	common.info.isMaxPage=true;
			            }else{
			            	$("#ul_listItem .li_item:last").before(data);
			            }
			            common.info.reloadWallfulPage++;
		 			}
		 		);
			}
		},
		lazyLoadInit:function(url){//异步加载列表动作初始化
			window.onscroll = function(){
				if(common.main.getCheck()&&common.info.isReload&&!common.info.isMaxPage){
					common.info.isReload=false;
					common.main.lazyLoadData(url);
				}
			}
		},	
        text_maxlength:function(className,maxwidth){
            function Trim(str){return str.replace(/(^\s*)|(\s*$)/g, "");}            
            className.each(function(){
            var max_width=maxwidth;
                if($(this).text().length>maxwidth){ 
                    $text = Trim($(this).text().substring(0,max_width))
                    $(this).text($text); 
                    $(this).html($(this).html()+'…');
                }
            });            
        },
        search_event:function(){
			//限制字符个数
//            common.main.text_maxlength($("#search_btn"),200); 
			//搜索框回车按钮事件
			$("#search_btn").keydown(function(event){
				if(event.keyCode ==13){
					var keyword = $(this).val();
					if(keyword == ""){
						layer.msg("搜索内容不能为空喔~");
						return;
					}
					var type = $(this).attr('data_type');
					var sortType = $(this).attr('sort_type');
				    location.href = "/search/?type=" + type + "&keyword=" + keyword + "&sortType=" + sortType;
				 }
			});
			$("#search_mg_btn").on("click", function(){
				var keyword = $("#search_btn").val();
				if(keyword == ""){
					layer.msg("搜索内容不能为空喔~");
					return;
				}
				var type = $("#search_btn").attr('data_type');
				var sortType = $("#search_btn").attr('sort_type');
				location.href = "/search/?type=" + type + "&keyword=" + keyword + "&sortType=" + sortType;
			});
			//加载更多
			common.main.lazyLoadInit('/search/');
		},
		//判断是否开启团体会员管理的入口
		is_open_team_vip_manager_enter: function(){
			$.ajax({
				type:"get",
				url:"/member/team/get_rest_size/",
				success:function(data){
					if(data > 0){  //显示团体会员子账号管理入口
						$('#team_vip_manager_identifer').removeClass("team_child");
						$('#team_vip_manager_identifer').addClass("team_main");
						$('#team_vip_manager_enter').css("display","block");
					}
				}
			});
		},
		//获取社区消息或系统消息或求职消息的未读消息数量
		set_message_notification_count: function(type,id){
			$.get("/member/message_notification/count/",{"type":type},function(data){
				if(data>0){
					$("#"+id).text(data);
					$("#"+id).closest(".mess-num").show();
				}else{
					$("#"+id).closest(".mess-num").hide();
				}
			})
		},
		//设置右侧导航栏我的工单显示的未读消息的总数量
		set_work_order_total_not_read_count:function(){
			//获取我的工单的未读信息数量（包括我的工单、社区消息、系统消息和求职消息）
			$.get("/common/get_message_notification_count/",function(data){
				if(data>0){
					$('div.member-nav li.xx').find('s').text(data);
					$('div.member-nav li.xx').find('s').css('display','block');
				}else{
					$('div.member-nav li.xx').find('s').remove();
				}
			});
		},
		words_deal_textarea:function(textArea,numItem){
			var max = numItem.siblings("span").text(),curLength;
	        curLength = textArea.text().length;
	        numItem.text(curLength);
	        textArea.on('keyup', function () {
		        var _value = $(this).text().replace(/\n/gi,"");
		        if(_value.length>max){
		        	numItem.addClass("over");
		        }else{
		        	numItem.removeClass("over");
		        }
		        numItem.text( _value.length);
	        });
		},
		// 在线编辑6.2.0 发布页新增 - 分页和图片放大镜
		pagination_and_magnifier:function(){
	        if($(".wbdCv-container").length > 0 && $(".wbdCv-container").hasClass("resume") && !$(".wbdCv-container").hasClass("mobile")){
	            // 分页
//	            var nowPageSize = 0; // 当前页数
//	            var resumePageHeight = 1160;// 每页高度
//	            var resumePageHtml = '<div class="resumePageBreak"><span>内容超过一页请用回车键避开空白处</span></div>';
//	            var resumeHeight = $(".wbdCv-resume").css({"height" : "auto","min-height":1160*2/3}).outerHeight();
//	            var pageSize = Math.ceil(resumeHeight / resumePageHeight);
//	            if(pageSize != nowPageSize) {
//	                var nowResumeHeight = pageSize * resumePageHeight;
//	                $(".wbdCv-resume").css({"height" : nowResumeHeight + "px"});
//	                nowPageSize = pageSize;
//	                // 清楚resumePageBreak
//	                $("div.resumePageBreak").remove();
//	                for(var index = 1; index < pageSize; index++) {
//	                    if(index!=pageSize){
//	                        var pageBreakObj = $(resumePageHtml);
//	                        pageBreakObj.css({"top" : ((index * resumePageHeight)-20) + "px"});
//	                        $(".wbdCv-resume").append(pageBreakObj);
//	                    }
//	                }
//	            }

	            //	图片作品放大镜
	            if($(".cv-preview .work-img").length > 0){
	                $(".cv-preview .work-img").each(function(){
	                    var $open_magnifier = $('<div class="open_magnifier"></div>').html('<span>查看大图</span>');
	                    $open_magnifier.appendTo($(this))
	                });
	            }
	            $(".work-list .work-img .open_magnifier span").on('click',function(){
	            	var src = $(this).parents(".work-img").find(".work-img-inner").find("img").attr("src"),
						$magnifier_masker = $('<div class="magnifier_masker"></div>').html('<div></div><span class="magnifier" style="background:url('+src+') center no-repeat; background-size:100%;"></span>');
					$magnifier_masker.appendTo($('body'));
	            	$('body').css('overflow','hidden');
				});
	            $(document).on('click','.magnifier_masker>div',function(){
					$(".magnifier_masker").remove();
					$('body').removeAttr('style')
				})
	        }
		},
		/**购物车数量*/
		cartSize:function() {
			var size = getCookie("cartSize");
			if(!size)
				$.ajax({async : false, url : wbdcnf.base + "/cart/size/", cache : false, type : "GET", success : function(data) {
					size = data;
				}});
			if(size && size > 0){
				$("#cart").addClass("cur");
			}else{
				$("#cart").removeClass("cur");
			}
		},
		/** 回到顶部 **/
		gotop:function(){
		    var gotop = '<div class="gotop 500dtongji" data_track="PC-通用-通用-全屏右侧-帮助浮标-返回顶部"></div>';
		    $("body").append(gotop);
		    $(".gotop").click(function(){$('html, body').animate({scrollTop:0}, 700);});
		    var min_height = 200;
		    $(window).scroll(function(){
		        var s = $(window).scrollTop();
		        if(s > min_height){
		            $(".gotop").fadeIn(100);
		        }else{
		            $(".gotop").fadeOut(100);
		        };
		    });
		},
		/**
		 * 登录信息
		 */
		loginMsg:function() {
            userHead = getCookie("memberHead");
            userId = getCookie("memberId");
            userEmail = getCookie("memberEmail");
            userIsVerifyEmail = getCookie("memberIsVerifyEmail");
            memberIsVerifyMobile = getCookie("memberIsVerifyMobile");
			if (userId != null || userEmail != null) {
				$("#login").hide(); // 登录|注册按钮
				$("#userHead").show().find("img").attr("src", userHead); // 显示头像
				$("#user_logout").show().click(function(){ // 登出按钮事件
					common.main.loginOut();
				});
				//是否验证
				if(!common.main.is_empty(userEmail)&&userEmail.indexOf("@")!=-1&&userIsVerifyEmail=="false"){//邮箱注册
					$(".tips_div").find(".email_tips").show();
					$(".tips_div").find(".mobile_tips").hide();
				}else{
					if(memberIsVerifyMobile=="false"){
						$(".tips_div").find(".email_tips").hide();
						$(".tips_div").find(".mobile_tips").show();
					}
				}
				if(userIsVerifyEmail=="false"&&memberIsVerifyMobile=="false"){
					$(".tips_div").show();
					$(".message_notification").show();
				}else{
					$(".tips_div").hide();
				}
			} else {
				$("#login").show(); // 登录按钮显示
				$("#userHead").hide();	//隐藏头像
			}
		},
		/**
		 * 注销登录
		 */
		loginOut:function() {
			$.get(wbdcnf.base + "/logout/", function(data){
				if(data.type == "success") {
					$("#userHead").hide(); // 头像隐藏
					$(".ul_top_user").hide(); // 用户操作菜单隐藏
					$(".m-top_user").hide(); // 用户操作菜单隐藏
					
					$("#login").show(); // 显示登录|注册按钮
					var synarr = $(data.content); // 同步登出论坛
					synarr.each(function(index, ele) {
					    $.getScript(ele.src, function(){});
					});
					location.reload();
				} else {
					var loaded = 0;
					var synarr = $(data.content);
					if(data.content != "" && synarr.length > 0) {
						synarr.each(function(index, ele) {
							$.getScript(ele.src, function(){
								if (++loaded == synarr.length) {
									location.href = wbdcnf.base + "/";
								}
							}).fail(function() {
								location.href = wbdcnf.base + "/";
						    });
						});
					} else {
						location.href = wbdcnf.base + "/";
					}
				}
			});
		},
		//发送邮件
		sendEmail:function(email,send_url,send_method){
			var flag=false;
			//发送邮件
			$.ajax({
				url: send_url,
				type: send_method,
				data: {"email":email},
				dataType: "json",
				async:false,
				cache: false,
				success: function(message) {
					if(message.type=="success"){
						flag=true;
					}else{
						layer.msg(message.content);
					}
				}
			});
			return flag;
		},
		checkSize:function(file, showAlert, max_size) {
			if(!max_size)
				max_size = 3;
			var max_file_size = max_size * 1024 * 1024;
			if(file && file.files && file.files[0] && file.files[0].size) {
				var size = file.files[0].size;
				if(size > max_file_size) {
					if(showAlert)
						alert("上传图片文件过大，请上传小于" + max_size + "M的文件！");
					return false;
				}
			}
			return true;
		},
		/**百度连接主动推送*/
		baiduPoster:function() {
		    var bp = document.createElement('script');
		    bp.src = '//push.zhanzhang.baidu.com/push.js';
		    var s = document.getElementsByTagName("script")[0];
		    s.parentNode.insertBefore(bp, s);
		},
		/** xss 过滤*/
		xssFilter:function(str){
			//1校验JavaScript运行环境
			if(str==null||str==""){
				return;
			}
			str=str.trim();//去空格
			str=str.toLowerCase();
			str=str.replace(new RegExp("javascript:;","gm"),"");//移除全局的javascript:;标记
			str=str.replace(new RegExp("javascript：;","gm"),"");
			if(str.indexOf("<script")!=-1){
				return "<script>";
			}
			if(str.indexOf("javascript:")!=-1){
				return "javascript:";
			}
			if(str.indexOf("javascript：")!=-1){
				return "javascript：";
			}
			if(str.indexOf("vbscript:")!=-1){
				return "vbscript:";
			}
			if(str.indexOf("vbscript：")!=-1){
				return "vbscript：";
			}
			if(str.indexOf("eval(")!=-1){
				return "eval(";
			}
			if(str.indexOf("<body")!=-1){
				return "<body>";
			}
			if(str.indexOf("document.write(")!=-1){
				return "document.write";
			}
			if(str.indexOf("innerhtml(")!=-1){
				return "innerHTML()";
			}
			if(str.indexOf("document.cookie")!=-1){
				return "document.cookie";
			}
			if(str.indexOf("<iframe")!=-1){
				return "<iframe>";
			}
			if(str.indexOf("<link")!=-1){
				return "<link>";
			}
			if(str.indexOf("document.location")!=-1){
				return "document.location";
			}
			if(str.indexOf("location.href")!=-1){
				return "location.href";
			}
		},
		/** 浏览器版本支持检查*/
		brower_check:function(){
			 try{
			  // 用于帮助 GA 检测各种奇奇怪怪的浏览器
			  // 参考：http://jeffshow.com/get-more-precise-browser-info-in-google-analytics.html
			  var browserName = "Other";
			  var ua = window.navigator.userAgent;
			  browserRegExp = {
			    Sogou : /SE\s2\.X|SogouMobileBrowser/,
			    Explorer2345 : /2345Explorer|2345chrome|Mb2345Browser/,
			    Liebao : /LBBROWSER/,
			    QQBrowser : /QQBrowser/,
			    Baidu : /BIDUBrowser|baidubrowser|BaiduHD/,
			    UC : /UBrowser|UCBrowser|UCWEB/,
			    MiuiBrowser : /MiuiBrowser/,
			    Wechat : /MicroMessenger/,
			    MobileQQ : /Mobile\/\w{5,}\sQQ\/(\d+[\.\d]+)/,
			    Shoujibaidu : /baiduboxapp/,
			    Firefox : /Firefox/,
			    Maxthon : /Maxthon/,
			    Se360 : /360SE/,
			    Ee360 : /360EE/,
			    TheWorld : /TheWorld/,
			    Weibo : /__weibo__/,
			    NokiaBrowser : /NokiaBrowser/,
			    Opera : /Opera|OPR\/(\d+[\.\d]+)/,
			    Edge : /Edge/,
			    AndroidBrowser : /Android.*Mobile\sSafari|Android\/(\d[\.\d]+)\sRelease\/(\d[\.\d]+)\sBrowser\/AppleWebKit(\d[\.\d]+)/i,
			    IE : /Trident|MSIE/,
			    Chrome : /Chrome|CriOS/,
			    Safari : /Version[|\/]([\w.]+)(\s\w.+)?\s?Safari|like\sGecko\)\sMobile\/\w{3,}$/,
			  };
			  for (var i in browserRegExp) {
			    if (browserRegExp[i].exec(ua)) {
			      browserName = i;
			      break;
			    }
			  }
			  //判断是否是国产双核浏览器，是的话，则判断是否是兼容模式
			  var browserAgent   = (navigator.userAgent).toLocaleLowerCase();
			    var two_kit=false;//是否是国产双核浏览器
			    if(browserName.indexOf("Se360") != -1 || browserName.indexOf("Ee360") != -1 || browserName.indexOf("QQBrowser") != -1|| browserName.indexOf("Explorer2345") != -1|| browserName.indexOf("Sogou") != -1|| browserName.indexOf("Liebao") != -1) {
			    	two_kit = true; //国产双核浏览器
			    }
			  	user_agent = navigator.userAgent.toLowerCase();
			  	//当前是支持IE10以上的
			  	var title="你的浏览器版本过低不支持在线制作。";
			  	var content="本网站不支持您当前的浏览器版本，如果继续使用会影响编辑效果<br/>请将浏览器升级至最新版本<br/>或使用以下浏览器，以获得最佳使用体验。";
			  	var is_show=false;
			    if (user_agent.indexOf("msie 7.0")>-1&&user_agent.indexOf("trident/5.0")>-1){
			    	is_show=true;
			    }else if (user_agent.indexOf("msie 8.0")>-1&&user_agent.indexOf("trident/5.0")>-1){
			    	is_show=true;
			    }else if(user_agent.indexOf("msie 8.0")>-1) {
			    	is_show=true;
			    }else if(user_agent.indexOf("msie 7.0")>-1&&user_agent.indexOf("trident/4.0")>-1){
			    	is_show=true;
			    }else if(user_agent.indexOf("msie 7.0")>-1){
			    	is_show=true;
			    }else if(user_agent.indexOf("msie 6.0")>-1){
			    	is_show=true;
			    }
			    if(is_show){
			    	if(two_kit){
			    		title="你当前浏览器使用的是兼容模式";
			    	  	content="本网站不支持您当前的浏览器的兼容模式，如果继续使用会影响编辑效果<br/>请你将浏览器模式调为极速模式<br/>或使用以下浏览器，以获得最佳使用体验。";
			    	}
			    	$("#brower_title_tips").html(title);
			    	$("#brower_content_tips").html(content);
			    	$("#browserModal").modal("show");
			    }
			 }catch(e){
			  console.log("浏览器版本检测失败");
			 }
		},
		check_mobile:function(mobile){
			var flag=false;
			//发送邮件
			$.ajax({
				url: '/register/check_mobile/',
				type: "GET",
				data: {"mobile":mobile},
				dataType: "json",
				async:false,
				cache: false,
				success: function(bindFlag) {
					if(bindFlag){
						flag=true;
					}
				}
			});
			return flag;
		},
		check_email:function(email){
			var flag=false;
			//发送邮件
			$.ajax({
				url: '/register/check_email/',
				type: "GET",
				data: {"email":email},
				dataType: "json",
				async:false,
				cache: false,
				success: function(bindFlag) {
					if(bindFlag){
						flag=true;
					}
				}
			});
			return flag;
		},
		getUrlParamString:function(name) { 
			try{
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
				var r = window.location.search.substr(1).match(reg); 
				if (r != null) {
					return unescape(r[2]);
				}
				return "";
			}catch(e){
				
			}
			return "";
		},
		copyToClipBoard:function(str){
			var copyInput = $("<input type='text' value='http://www.500d.me/resume/"+ str +"/' style='opacity:0' id='copyText'>");
			copyInput.appendTo("body");
			document.getElementById("copyText").select();
			document.execCommand("copy",false,null)
			$("#copyText").remove();
		},
		form_to_json:function(form){    
		   var o = {};    
		   var a = form.serializeArray();    
		   $.each(a, function() {    
		       if (o[this.name]) {    
		           if (!o[this.name].push) {    
		               o[this.name] = [o[this.name]];    
		           }    
		           o[this.name].push(this.value || '');    
		       } else {    
		           o[this.name] = this.value || '';    
		       }    
		   });    
		   return o;    
		},
		ajax_sync_send:function(url,data,method){
			var _rsp="";
			$.ajax({
				type : method,
			   	cache: false,
			   	async : false,
			   	url : url,
			    data:data,
			   	success : function(rsp) {
			   		_rsp= rsp;
			   	}
			});
			return _rsp;
		},
		trim:function(str){ 
		  return str.replace(/\s+/g, "");
		},
		// 新建简历弹框
        create_resume:function(){
			//  关闭弹框方法
            function close_panel(){
				$("#create_resume_panel").removeClass("show");
				$("#create_resume_panel").addClass("close");
                // 初始化选项
                $(".selection").removeClass('show');
                $('.selection.lang_select').children('.checked').html("中文");
                $('.selection.identity_select').children('.checked').html("应届生");
                $('.create_resume_panel .inner_bar .tips').css("display","none");
                $(".template_card").removeClass('checked');
                $(".create_resume_panel .inner_footer button").removeClass('allow');
                $('.index_div').css({height: 'auto',overflow: "auto"});
                $(".template_list div.template_card").remove();
			};
			$(".selection").mouseleave(function(){
				$(".selection").removeClass('show');
			});
            //  打开弹框
		    $(".open_create_resume_panel").on("click",function(){
				$('body').css({height: '100vh',overflow: 'hidden'});
				$("#create_resume_panel").removeClass("close");
				$("#create_resume_panel").addClass("show");
		    	$.get("/cvresume/createcv_select_template/",{"resumeBankType":"doc"},function(result){
		    		if(result!=""){
		    			$(".template_list").html(result);
		    			$(".template_list .template_card").each(function(index,item){
							var _time = 0.1 * index
							$(this).css("animation-delay", _time+'s')
						});
		    		}
        		})
            });
            // 关闭新建简历弹框按钮
            $("#create_resume_panel .close_panel").on("click",function(){
            	common.main._500dtongji("PC-CV6.7.0-通用-快捷弹窗页-顶部-右上-关闭")
                close_panel();
            });
            // 下拉选框显示隐藏事件
			$(".selection").on("click",function(){
				$(this).toggleClass('show');
				$(this).siblings().removeClass('show')
				event.stopPropagation();
			});
			// 下拉选框选择事件
			$(".select_box span").on('click', function(){
				var _val = $(this).text(); //获取选择的选项内容
				$(this).parents('.selection').children('.checked').html(_val)
				$('.selection').removeClass('show')
				event.stopPropagation();
				if(_val.length>2){
					common.main._500dtongji("PC-CV6.7.0-通用-快捷弹窗页-身份类型选区-左上-身份");
				}else{
					common.main._500dtongji("PC-CV6.7.0-通用-快捷弹窗页-语言类型选区-左上-语言");
				}
			});
			$(document).on('click',function(){
				$('.selection').removeClass('show')
			})
			// 自由编辑选择事件
			$(".create_resume_panel .dropcvresume").on("click",function(){
				common.main._500dtongji("PC-CV6.7.0-通用-快捷弹窗页-顶部-右上-完全自由编辑模式");
				$(this).addClass('checked');
				common.main.resume_confirm({
                    title:"",
                    content_html:"<span class='tips_title'>进入完全自由编辑模式</span><span class='tips-content'>你可以根据自己的喜好来控制整体的布局</span>",
                    tips_modal_class:"confirm_modal",
					modal_class:"tips-modal-content change_content_confirm dropcvresume_modal",
					ok:"开始编辑",
                    onOk:function(){
                        location.href="/dropcvresume/edit/";
                    },
                    onCancel:function(){
						$(".create_resume_panel .dropcvresume").removeClass('checked');
                    }
                });
			});
			// 关闭自由编辑弹框
			$(document).on("click",".dropcvresume_modal .modal-header .close",function(){
				$(".create_resume_panel .dropcvresume").removeClass('checked');
			})
			// 自由编辑提示框
			$('.create_resume_panel .dropcvresume i').hover(function() {
		        $('.create_resume_panel .inner_bar .tips').css("opacity","1")
		    }, function() {
		        $('.create_resume_panel .inner_bar .tips').css("opacity","0")
		    });
		    // 开始编辑点击事件
        	$(document).on("click",".check_masking button",function(){
        		common.main._500dtongji("PC-CV6.7.0-通用-快捷弹窗页-底部-中间-开始编辑");
				if($(".identity_select .checked").text()=="应届生"){
					$(".honor").addClass("selected");
					$(".internship").addClass("selected");
				}else{
					$(".work").addClass("selected");
					$(".project").addClass("selected");
				}
				var type="zh";
				if($(".lang_select .checked").text() =="英文"){
					type="en";
				}
				var itemId=$(this).parents(".template_card").attr("data_itemid");
				url=encodeURI("/cvresume/create/?itemid="+itemId+"&language="+type);
				location.href=url;
		    	
		    });
        },
        // 投递简历弹框
        send_resume:function(){
		    // 方法内变量
            var _resume_id, _target_email, _email_title, _email_text,
            $send_resume_modal = $("<div id='send_resume_modal' class='modal send_resume'></div>");
            // 弹框节点
            $send_resume_modal.html('\n' +
                '        <div class="modal-dialog show-swal2">\n' +
                '            <div class="modal-content">\n' +
                '                <div class="send_edit_section">\n' +
                '                    <header>\n' +
                '                        <span>简历投递</span>\n' +
                '                        <a href="javascript:;" class="close_modal"></a>\n' +
                '                    </header>\n' +
                '                    <div class="edit_contain">\n' +
                '                        <div class="select_resume">\n' +
                '                            <span class="edit_title">选择投递的简历</span>\n' +
                '                            <select name="select_resume" id="select_resume">\n' +
                '                                <option value="">选择简历</option>\n' +
                '                            </select>\n' +
                '                        </div>\n' +
                '                        <div class="edit_email">\n' +
                '                            <span class="edit_title">填写收件人邮箱</span>\n' +
                '                            <input type="email" name="target_email"  placeholder="填写邮箱地址">\n' +
                '                        </div>\n' +
                '                        <div class="edit_text_outer">\n' +
                '                            <span class="edit_title">填写标题与描述</span>\n' +
                '                            <input type="text" name="email_title" maxlength="30" placeholder="应聘岗位_姓名_学校_手机号">\n' +
                '                            <div class="edit_text" name="edit_text" contenteditable="true" >\n' +
			    '                                 <div>尊敬的 <span style="color:#bbc6d3;">xxx</span> 招聘负责人，您好</div>\n' +
                '                                <div style="text-indent:2em;">\n' +
                '                                    <div>我在<span style="color:#bbc6d3;">xxx</span>上看到贵公司的招聘信息，我对<span style="color:#bbc6d3;">xxx</span>职位非常有兴趣，特来应聘。</div>' +
                '                                    <div>我叫<span style="color:#bbc6d3;">xxx</span>，<span style="color:#bbc6d3;">xxx</span>年毕业于<span style="color:#bbc6d3;">xx</span>，主修<span style="color:#bbc6d3;">xx</span>，有X年<span style="color:#bbc6d3;">xx</span>方面工作经验，积累了丰富的<span style="color:#bbc6d3;">xxx</span>经验，能力强，曾做过<span style="color:#bbc6d3;">xxx</span>，认为自己可以胜任贵公司的<span style="color:#bbc6d3;">xx</span>岗位，希望能获得面试机会！</div>\n' +
				' 									 <div>更多我的信息，请点击下方简历链接。</div>' +
				' 									 <div>祝工作愉快！</div>' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                    <div class="to_preview_section">\n' +
                '                        <a href="javascript:;" class="500dtongji" data_track="PC-CV6.6.1-通用-简历投递弹窗-底部-底部-投递">投递</a>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <div class="send_preview_section">\n' +
                '                    <header>\n' +
                '                        <span>简历投递-预览效果</span>\n' +
                '                        <a href="javascript:;" class="close_modal"></a>\n' +
                '                    </header>\n' +
                '                    <div class="preview_contain">\n' +
                '                        <div class="preview_head"><h3 class="preview_title"></h3><span class="preview_email">收件人：<i></i></span></div>\n' +
                '                        <div class="preview_body"></div>\n' +
                '                        <div class="preview_foot" style="width: 560px; padding: 6px 0 0; margin: 30px 10px 0; border-top: 1px solid #ededed; font-size: 0;">\n' +
                '                            <span style="display:block; height:40px; line-height:40px; font-size:12px; color:#5d6876;">其它三种方式查看简历</span>\n' +
                '                            <div class="preview_foot_list online_list" style="display:inline-block; width:140px; height:140px; margin-right:66px; border:1px solid #dce3ec; vertical-align:bottom;">' +
                '                               <i style="display:block; width:48px; height:106px; margin:0 auto; background:url(/resources/500d/common/images/send_resume_modal_sp.png) -5px 20px no-repeat;"></i>' +
				'								<p style="display:block; width:100%; height:32px; line-height:32px; border-top:1px solid #dce3ec;  font-size:12px; color:#96a0ac; text-align:center;">' +
				'									<a href="/" style="color:#96a0ac;">查看链接</a>' +
				'								</p>' +
				'							</div>\n' +
                '                           <div class="preview_foot_list qrcode_list" style="display:inline-block; width:140px; height:140px; margin-right:66px; border:1px solid #dce3ec; vertical-align:bottom;">' +
                '                               <img src="" alt="" style="display:block; width:95px; height:95px; margin:5px auto 6px;">' +
                '                               <p style="display:block; width:100%; height:32px; line-height:32px; border-top:1px solid #dce3ec;  font-size:12px; color:#96a0ac; text-align:center;">微信扫一扫查看</p>' +
                '                           </div>\n' +
                '                           <div class="preview_foot_list download_list"" style="display:inline-block; width:140px; height:140px; margin-right:0; border:1px solid #dce3ec; vertical-align:bottom;">' +
                '                               <i style="display:block; width:50px; height:106px; margin:0 auto; background:url(/resources/500d/common/images/send_resume_modal_sp.png) -96px 17px no-repeat;"></i>' +
                '                               <p style="display:block; width:100%; height:32px; line-height:32px; border-top:1px solid #dce3ec;  font-size:12px; color:#96a0ac; text-align:center;">下载PDF简历查看</p>' +
                '                           </div>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                    <div class="preview_button_bar"><a href="javascript:;" class="cancel_button 500dtongji" data_track="PC-CV6.6.1-通用-简历投递预览页-底部-底部-返回">返回</a><a href="javascript:;" class="ok_button 500dtongji" data_track="PC-CV6.6.1-通用-简历投递预览页-底部-底部-确定投递">确认投递</a></div>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>');
            $send_resume_modal.appendTo($("body"));

		    // 打开弹框方法
		    $(document).on("click",".open_send_resume_modal",function(){
	        	var check_flag=common.main.ajax_sync_send("/member/resume_cover_letter/check_resume_cover_letter/",{},"GET");
		    	if(check_flag){
		    		$("#send_resume_modal").modal("show");
	                $.get("/cvresume/resume_list/",{},function(result){
	                    if(result!=null){
	                        var $select = $("<select></select>").html(result);
	                        $select.find("option").eq(0).text("选择简历");
	                        $("#select_resume").html($select.html());
	                    }
	                })
		    	}else{
		    		common.main.resume_confirm({
						title:"VIP会员升级提示",
						modal_class:"vip-content",
						content:"超出最大投递简历数量，请升级会员后继续投递",
						ok:"立即升级",
						onOk:function(){
							window.open("/order/vip_member/");
							setTimeout(function(){
								common.main.resume_confirm({
									title:"支付提示",
									content:"请在你新打开的页面上完成付款，支付完成后，请根据您支付的情况点击下面按钮。",
									ok:"支付完成",
									cancel:"支付遇到问题",
									onOk:function(){
										location.reload();
									},
									onCancel:function(){
										window.open("http://help.500d.me");
									}
								});	
							},1000);
						}
					});	
		    	}
            });
            // 关闭弹框方法
            $(document).on("click",".send_resume .close_modal",function(){
                var _html = '<div>尊敬的 <span style="color:#bbc6d3;">xxx</span> 招聘负责人，您好</div><div style="text-indent:2em;"><div>我叫<span style="color:#bbc6d3;">xxx</span>，<span style="color:#bbc6d3;">xxx</span>年毕业于<span style="color:#bbc6d3;">xx</span>，主修<span style="color:#bbc6d3;">xx</span>，有N年<span style="color:#bbc6d3;">xx</span>方面工作经验，积累了丰富的<span style="color:#bbc6d3;">xxx</span>经验，<span style="color:#bbc6d3;">xx</span>能力 强，曾做过<span style="color:#bbc6d3;">xxx</span>，认为自己可以胜任贵公司的<span style="color:#bbc6d3;">xx</span>岗位，希望能获得面试机会！</div></div>'
                $("#send_resume_modal").modal("hide");
                $(".send_resume .send_preview_section").css("right","-600px");
                $(".send_resume [name=select_resume]").val("");
                $(".send_resume [name=target_email]").val("");
                $(".send_resume [name=email_title]").val("");
                $(".send_resume [name=edit_text]").html(_html);

            });
            // 跳转预览框
            $(document).on("click",".send_resume .to_preview_section a", function(){
                _resume_id = $(".send_resume [name=select_resume]").val();
                _target_email = $(".send_resume [name=target_email]").val();
                _email_title = $(".send_resume [name=email_title]").val();
                _email_text = $(".send_resume [name=edit_text]").html();
                var test_eamil = /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if(common.main.is_empty(_resume_id) || common.main.is_empty(_target_email) || common.main.is_empty(_email_title) || common.main.is_empty(_email_text)){
                    if(common.main.is_empty(_resume_id)){
                        layer.msg("请选择一份简历");
                        return
                    }else if(common.main.is_empty(_target_email)){
                        layer.msg("请填写正确的邮箱");
                        return
                    }else if(common.main.is_empty(_email_title)){
                        layer.msg("请填写邮件标题");
                        return
                    }else if(common.main.is_empty(_email_text)){
                        layer.msg("请填写邮件正文");
                        return
                    }
                }else if(!test_eamil.test(_target_email)){
                    layer.msg("请填写正确的邮箱");
                    return
                }else if(common.main.is_empty(_email_text.replace(/&nbsp;| |<\/?.+?>/g,""))){
                	layer.msg("内容为空")
				}else{
                    // 获取对应 链接 & 二维码图片
                    $.ajax({
                        type: "GET",
                        url: "/cvresume/select_resume_content/",
                        data:{
                            id:_resume_id
                        },
                        success:function(message){
                            if(message.type != "success"){
                                layer.msg(message.content);
                            }else{
                                var _data = JSON.parse(message.content);
                                console.log(_data);
                                $(".preview_foot .online_list p a").attr("href",_data.visitPath);
                                $(".preview_foot .qrcode_list img").attr("src",_data.qrocdeImg);
                            }
                        },
                        fail:function(){
                            layer.msg("发送失败，请重试")
                        }
                    });
                    // 同步数据到预览框
                    $(".send_preview_section .preview_title").text(_email_title);
                    $(".send_preview_section .preview_email i").text(_target_email);
                    $(".send_preview_section .preview_body").html(_email_text);
                    $(".send_resume .send_preview_section").css("right","10px")
                }
            });
            // 预览弹框返回
            $(document).on("click",".send_preview_section .cancel_button",function(){
                $(".send_resume .send_preview_section").css("right","-600px")
            });
            // 预览弹框发送
            $(document).on("click",".preview_button_bar .ok_button",function(){
                $.ajax({
                    type:"POST",
                    url:"/member/resume_cover_letter/send/",
                    data:{
                        title:_email_title,
                        emailContent:_email_text,
                        resume:_resume_id,
                        sendeeEmail:_target_email
                    },
                    success:function(data){
                        console.log(data);
                        if(data.type != "success"){
                            layer.msg(data.content);
                        }else{
                            window.location.href ="/member/resume_cover_letter/success/?redirectUrl="+encodeURI("/member/resume_cover_letter/list/");
                        }
                    }
                })
            });
            // 富文本框黏贴事件去除格式
            $.fn.extend({
                insertAtCaret: function (myValue) {
                    var $t = $(this)[0];
                    if (document.selection && document.selection.createRange) {
                        document.selection.createRange().pasteHTML(text);
                    }else if (window.getSelection && window.getSelection().getRangeAt(0)){
                        var j = window.getSelection();
                        var range = j.getRangeAt(0);
                        range.collapse(false);
                        var node = range.createContextualFragment(myValue);
                        var c = node.lastChild;
                        range.insertNode(node);
                        if(c){
                            range.setEndAfter(c);
                            range.setStartAfter(c)
                        }
                        j.deleteFromDocument();
                        j.removeAllRanges();
                        j.addRange(range);
                    }
                }
            });
            document.addEventListener("paste", function(e) { 
                if(window.getSelection){
                    window.getSelection().getRangeAt(0).deleteContents();
                } else if(document.selection && document.selection.createRange){
                    document.selection.getRange(0).deleteContents();
                }
                var _text = (!!window.ActiveXObject || "ActiveXObject" in window) ? window.clipboardData.getData("text") : e.clipboardData.getData("text");
                if($(":focus").is("div[contenteditable=true]")) {
                    $(":focus").insertAtCaret(_text);
                    // 标题栏限制输入字数30
                    if($(":focus").hasClass("module_item_title") || $(":focus").parents(".dd-title").length > 0){
                        $(":focus").text($(":focus").text().replace(/[\r\n]/g,""));
                        var _length = $(":focus").text().length, size;
						if(cvresume.info.language == "en"){
							size=100;
						}else{
							size=30;
						}                        
                        if(_length > size){
                            $(":focus").text($(":focus").text().substring(0,size));
                            layer.msg("你输入的字数不能超过"+size);
                        }
                    }
                    if($(":focus").parents(".cover-con").length > 0){
                        var $this = $(":focus"), _content = '';
                        $(".wbdCv-cover .coverItem div[contenteditable]").each(function(){
                            _content += $(this).text()
                        });
                        if(_content.length > 499){
                            var _text = $this.text(), _length = _text.length-(_content.length-499);
                            layer.msg("你输入的字数不能超过500");
                            $this.text(_text.substring(0,_length));
                        }
                    }   // 封面粘贴字数限制
                    e.preventDefault();
                }
            });
        },
        ab_test_event:function(){
        	var _abTest;
        	if(window.localStorage){
    			_abTest = localStorage.getItem("abTest");
    			if(common.main.is_empty(_abTest)){
    				_abTest = Math.floor(Math.random()*2+1);
    				localStorage.setItem("abTest", _abTest);
    			}
        	}else{
        		_abTest = Math.floor(Math.random()*2+1);
        	}
        	common.info.abTest = _abTest;
        },
        isIE9:function(){
        	try{
        		if(navigator.userAgent.indexOf("MSIE")>0){    
		     	 	if(navigator.userAgent.indexOf("MSIE 9.0")>0){  
		   	     		return true;
		  	    	}else{
		   		   		return false;
		     		}
		  	  	} 
        	}catch(e){
        		console.log("浏览器版本判断错误"+e);
        		return false;
        	}
        },

        /*
		          倒计时
		      common.main.countDown({
				h: 1, // h, m, s 也可以只传一个
				m: 1,
				s: 5,
				run: function(h, m, s) { // 正在计时时回调
					h = (h < 10) ? '0' + h : h;
					m = (m < 10) ? '0' + m : m;
					s = (s < 10) ? '0' + s : s;
					console.log(h + ":" + m + ":" + s);
				},
				end: function() { // 结束后回调
		
				}
			});
         */
	countDown: function(time) {
		var time = time || {},
			h = time.h || 0,
			m = time.m || 0,
			s = time.s || 1,
			interval;
		// 判断秒 和 分超出时间规则  分 和 时 递增
		if(h <= 0 && m <= 0 && s <= 0) {
			h = 0;
			m = 0;
			s = 0;
			if(time.run) time.run(h, m, s);
			if(time.end) time.end(h, m, s);
			return;
		}
		if(s >= 60) {
			m += parseInt(s / 60);
			s = s % 60;
		}
		if(m >= 60) {
			h += parseInt(m / 60);
			m = m % 60;
		}
		interval = setInterval(function() {
			s--;
			if(s < 0) {
				if(m <= 0) {
					if(h <= 0) {
						if(h <= 0 && m <= 0 && s <= 0) {
							clearInterval(interval);
							// 倒计时结束回调
							if(time.end) time.end(h, m, s);
						}
					} else {
						h -= 1;
						m = 59;
						s = 59;
					}
				} else {
					m -= 1;
					s = 59;
				}
			}
			// 计时 实时回调
			if(time.run) time.run(h, m, s);
		}, 1000);
	},
    urlMapping:function(){//PC/WAP链接映射匹配函数方法
    	try{
    		var _currentDeviceInfo = common.main.get_device_info();
    		if(_currentDeviceInfo.pc){
    			return;
    		}
        	$.each(common.urlMapping,function(key1,value1){
        		var reg = new RegExp(key1);
        		var _pathname = window.location.pathname;
        		var _search = window.location.search;
        		if(reg.test(_pathname)){
        			var _params = _pathname.match(reg);
        			if(_params != null && _params.length > 0){
        				_params.splice(0,1);//去除素组第一个元素
        				var _url = value1.url;
        				//restful风格参数替换
        				$.each(_params,function(i,param){
        					_url = _url.replace("{"+i+"}", param);
        				});
        				//普通参数替换
        				if(_search.length != 0){
        					if(_url.indexOf("?") != -1 && _search.indexOf("?") != -1){
        						_search = _search.replace("?","&");
        					}
        					//解决pc与wap端参数key不一致
        					$.each(value1.params,function(j,params){
        						$.each(params,function(key2,value2){
									_search = _search.replace(key2, value2);
        						});
        					})
        				}
        				window.location.href = _url + _search;
        			}
        		}
        	});
		}catch(err){
			console.error(err)
		}
    },
    onlineKefu:function(){
    	try{
    		$('.workorder_bar').css('cssText', 'display:none !important');
    		//接入页面url
	    	var includeUrls = [
		    	"^/$",
		    	"^/member/myresume/$",
		    	"^/member/order/$",
		    	"^/member/resume_cover_letter/list/$",
		    	"^/member/workOrder/$",
		    	"^/cvresume/edit/$",
		    	"^/cvresume/([A-Za-z\\d]*)/$",
		    	"^/customize/",
		    	"^/hr/select_publish_type/$",
		    	"^/hr/publish_([-A-Za-z\\d]*)/$",
		    	"^/hr/([A-Za-z\\d]*)/$"
	    	];
	    	var is = false;
	    	$.each(includeUrls,function(i,item){
	    		var reg = new RegExp(item);
	    		var _pathname = window.location.pathname;
	    		if(reg.test(_pathname)){
	    			is = true;
	    			return;
	    		}
	    	});
	    	if(!is){
	    		return;
	    	}
	    	$.get('/common/online_kefu_status/',function(result){
	            if(result.type == 'success' && result.content == '1'){//激活在线客服
	                initMeiQia();
	            }else{
	                $('.workorder_bar').css('cssText', 'display:block!important;');
	            }
	        });
	    	function initMeiQia(){
	            var _uid = getCookie('memberId');
	            var _vip = getCookie('memberVip');
	            var _register_date = getCookie('memberRegisterDate');
	            var _name = getCookie('memberName');
	            var _tel = getCookie('memberMobile');
	            var _email = getCookie('memberEmail');;
	            (function(m, ei, q, i, a, j, s) {
	                m[i] = m[i] || function() {
	                            (m[i].a = m[i].a || []).push(arguments)
	                        };
	                j = ei.createElement(q),
	                        s = ei.getElementsByTagName(q)[0];
	                j.async = true;
	                j.charset = 'UTF-8';
	                j.src = 'https://static.meiqia.com/dist/meiqia.js?_=t';
	                s.parentNode.insertBefore(j, s);
	            })(window, document, 'script', '_MEIQIA');
	            _MEIQIA('entId', 110962);
	            // 用户信息
	            _MEIQIA('metadata', {
	                uid:_uid!=undefined?_uid:'无',
	                vip:_vip!=undefined?_vip:'无',
	                register_date:_register_date!=undefined?_register_date:'无' ,
	                name:_name!=undefined?_name:'无' ,
	                tel:_tel!=undefined?_tel:'无',
	                email:_email!=undefined?_email:'无'
	            });
	            _MEIQIA('allSet', function(){
	            	$("#MEIQIA-BTN-HOLDER").css('cssText', 'display:block;right: 10px !important;bottom: 10px !important;');
	            });	            
	        }
    	}catch(e){
    		console.error("初始化在线客服入口异常",e)
    	}
    }
};
$(function(){
	common.main.init_();//初始化对象
});