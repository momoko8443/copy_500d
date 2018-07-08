/**
 * 获取前程无忧简历
 * @param html
 * @param itemId
 * @param memberId
 * @returns {String}
 */
var current_resume_edit_url="";
var int_reg=/^\+?[1-9][0-9]*$/;
/*** html 格式*/
function get51ResumeHtml(html,itemId,memberId){
	if(html==null||html==""||html==undefined){
		$("#importRModal").modal("hide");
		$("#importResetModal").modal("show");
		$("#importResetModal").find(".tips_show").text("由于文件内容为空,导入失败，请重新导入")
		return "";
	}
	try{
		var resume_page=$(html);
		if(html.indexOf("zhaopin.com")!=-1){
			$("#importRModal").modal("hide");
			$("#importResetModal").modal("show");
			$("#importResetModal").find(".tips_show").text("当前导入的简历是智联简历，请选择前程无忧简历再导入");
			return;
		}else if(html.indexOf("lagou.com")!=-1){
			$("#importRModal").modal("hide");
			$("#importResetModal").modal("show");
			$("#importResetModal").find(".tips_show").text("当前导入的简历拉勾简历，请选择前程无忧简历再导入");
			return;
		}else if(html.indexOf("51job")==-1){
			$("#importRModal").modal("hide");
			$("#importResetModal").modal("show");
			$("#importResetModal").find(".tips_show").text("当前导入的简历不是前程无忧简历，请选择正确文件再重新导入");
			return;
		}
		var resume_page=$(html);
		
		var resume={};			//简历信息实体
		var modul_show = {};	//模块控制
		var iconFontMap = {};	//图标
		//初始化内容
		resume=init_resume(resume,modul_show,iconFontMap);
		//resume["resumeTitle"]=resume_page.find("#resume_nameview").text();// 简历名称, v5没有这个字段??
		var resume_base_info = {};				//基本信息对象
		var custom = []; 						//自定义模块数组
		//----51job必填基本信息部分----
		var Basic=resume_page.find("table.infr");
		//姓名
		var name=Basic.find(".name").text();
		resume_base_info["name"]=name;
		//性别|年龄(出生年月)|居住地址|经验			如下格式文本内容: 男 │ 23 岁 (1993/07/27) │现居住广州-白云区 │ 暂无经验 
		var more_info=Basic.find("tr:last").text();
		var more_infos=more_info.split("|");
		//性别
		var gender=more_infos[0];
		resume_base_info["sex"] = getGender(gender);
		//出生年月
		var birth=more_infos[1].split(/[()\/]/);
		//正则split出生日期. 通过用"(",")","/"来分割"23 岁 (1993/07/27), 效果为birth = (5) ["29 岁 ", "1988", "06", "05", ""]
		if(int_reg.test(birth[1].trim())){
			resume_base_info["birthYear"]=birth[1];	
		}else{
			resume_base_info["birthYear"]="1990";	
		}
		if(int_reg.test(birth[2].trim())){//出生月份
			resume_base_info["birthMonth"]=birth[2];
		}else{
			resume_base_info["birthMonth"]="1";
		}
		//地址(所在城市)										//没抽取
		var address=more_infos[2];
		//resume_base_info["address"]=address;					//地址, 暂时没地方抽取
		//工作经验
		var jobYears=more_infos[3].split("年");					//"n年工作经验"
		var jobYear=jobYears[0];								//获取工作年数, 如"1年工作经验"获取到工作年数为"1", 以此类推, "3年工作经验"工作年数为"3"
		if(jobYear<11){
			resume_base_info["jobYear"]=getJobYear(jobYear);	//小于等于10年, jobYear为具体的工作年数, 如"3年"为"three"
		}else{
			resume_base_info["jobYear"]="more";					//大于10年, jobYear为"10年以上"
		}
		//邮箱
		var email=clearAllHtmlText(Basic.find(".email").html());
		resume_base_info["email"]=email;
		//电话
		var tel=clearAllHtmlText(Basic.find(".email").closest("td").prev().html());
		resume_base_info["mobile"]=tel;
		
		var boxs=resume_page.find("table.box");
		boxs.each(function(index,ele){
			var titleName=$(ele).find("td.plate1").text();
			if(titleName.indexOf("个人信息")!=-1){
				//---51job个人信息补充部分----
				var $infos=$(ele).find(".tb2");
				var customMsg = [];
				$infos.each(function(index,ele_item){
					//messages[uuid()]=clearAllHtmlText($(ele_item).find("td.keys").text()+$(ele_item).find("td.txt2").text());
					//qq
					if($(ele_item).find("td.keys").text().indexOf("QQ号")!=-1){
						resume_base_info["qq"]=$(ele_item).find("td.txt2").text().trim();
					//微信
					}else if($(ele_item).find("td.keys").text().indexOf("微信")!=-1){
						resume_base_info["weixin"]=$(ele_item).find("td.txt2").text().trim();
					//身高
					}else if($(ele_item).find("td.keys").text().indexOf("身高")!=-1){
						var height = {
								"key":uuid(),
								"name":"height",
								"desc":$(ele_item).find("td.txt2").text().trim()
						};
						customMsg.push(height);
					//婚姻状况
					}else if($(ele_item).find("td.keys").text().indexOf("婚姻")!=-1){
						var marriageStatus = $(ele_item).find("td.txt2").text().trim();
						resume_base_info["marriageStatus"]=getMarriageStatus(marriageStatus);
					///政治角色
					}else if($(ele_item).find("td.keys").text().indexOf("政治")!=-1){
						var politicalStatus = $(ele_item).find("td.txt2").text().trim();
						resume_base_info["politicalStatus"]=getPoliticalStatus(politicalStatus);
					}
					
				});
				resume_base_info["customMsg"]=customMsg;
			}else if(titleName.indexOf("工作经验")!=-1){
				//----51job工作经验部分----
				var resume_work =[];
				var work_eles=$(ele).find(".p15");
				work_eles.each(function(j, ele_item) {
					ele_item = $(ele_item);
					var item = {};
					item["content"] = clearAllHtmlText(ele_item.find(".tb1:last").html());
					var timeStr = clearAllHtmlText(ele_item.find(".time").html()).split("-");
					item["beginTime"] = timeStr[0].replace("/","\.");
					item["endTime"] = timeStr[1].replace("/","\.");
					item["unit"] = clearAllHtmlText(ele_item.find(".phd").eq(0).find("span:first").html());
					item["job"] = clearAllHtmlText(ele_item.find(".rtbox").html());
					resume_work[j] = item;
				});
				resume["resume_work"] = resume_work;
				if(resume_work.length>0){
					modul_show["resume_work"]["isShow"]=true;
				}else{
					modul_show["resume_work"]["isShow"]=false;
				}
			}else if(titleName.indexOf("项目经验")!=-1){
				//----51job项目经验----
				var resume_project = [];
				var project_eles=$(ele).find(".p15");
				project_eles.each(function(j, ele_item) {
					ele_item = $(ele_item);
					var item = {};
					item["content"] = clearAllHtmlText(ele_item.find(".tb1").eq(0).html()+ele_item.find(".tb1").eq(1).html());
					var timeStr = clearAllHtmlText(ele_item.find(".time").html()).split("-");
					item["beginTime"] = timeStr[0].replace("/","\.");
					item["endTime"] = timeStr[1].replace("/","\.");
					item["unit"] = "";
					item["job"] =clearAllHtmlText(ele_item.find(".rtbox").html());
					resume_project[j] = item;
				});
				resume["resume_project"] = resume_project;
				if(resume_project.length>0){
					modul_show["resume_project"]["isShow"]=true;
				}else{
					modul_show["resume_project"]["isShow"]=false;
				}
			}else if(titleName.indexOf("教育经历")!=-1){
				//----51job教育经历----
				var resume_edu = [];
				var education_eles=$(ele).find(".p15");
				education_eles.each(function(j, ele_item) {
					ele_item = $(ele_item);
					var item = {};
					item["content"] = clearAllHtmlText(ele_item.find(".tb1").eq(1).html());
					var timeStr = clearAllHtmlText(ele_item.find(".time").html()).split("-");
					item["beginTime"] = timeStr[0].replace("/","\.");
					item["endTime"] = timeStr[1].replace("/","\.");
					item["unit"] = clearAllHtmlText(ele_item.find(".tb1").eq(0).html());
					item["job"] = clearAllHtmlText(ele_item.find(".rtbox").html());
					resume_edu[j] = item;
				});
				resume["resume_edu"] = resume_edu;
				if(resume_edu.length>0){
					modul_show["resume_edu"]["isShow"]=true;
				}else{
					modul_show["resume_edu"]["isShow"]=false;
				}
			}else if(titleName.indexOf("在校")!=-1){
				var zx_items=$(ele).find(".tbb table");
				zx_items.each(function(index,el){
					var item_name=$(el).find(".tit").text();
					if(item_name.indexOf("校内荣誉")!=-1){
						//----51job校内荣誉----
						var schoolaward_eles=$(el).find(".tb3");
						var schoolaward="";
						schoolaward_eles.each(function(j, ele_item) {
							schoolaward=schoolaward+clearAllHtmlText($(ele_item).find(".time").html()+"   "+$(ele_item).find(".rtbox").html())+"<br/>";
						});
						resume["resume_honor"] = schoolaward;
						if(schoolaward!=undefined&&schoolaward.length>0){
							modul_show["resume_honor"]["isShow"]=true;
						}else{
							modul_show["resume_honor"]["isShow"]=false;
						}
					}else if(item_name.indexOf("校内职务")!=-1){
						//----51job校内职务: 添加成有时间的自定义模块----
						var schooljob_eles=$(el).find(".p15");
						itemList = [];
						schooljob_eles.each(function(j, ele_item) {
							ele_item = $(ele_item);
							var item = {};
							item["content"] = clearAllHtmlText(ele_item.find(".tb1").eq(0).html());
							var time = clearAllHtmlText(ele_item.find(".time").html()).split("-");
							item["beginTime"]=time[0].replace("/","\.");
							item["endTime"]=time[1].replace("/","\.");
							item["unit"] = "";
							item["job"] =clearAllHtmlText(ele_item.find(".rtbox").html());
							itemList[j] = item;
						});
						var customPlate = getCustomPlateHasTime(item_name, itemList);
						var customItem = customPlate["customItem"];			//内容
						var customItemShow = customPlate["customItemShow"];	//显示控制
						custom.push(customItem);
						modul_show[customItem.key]=customItemShow;
					}
				});
			}else if(titleName.indexOf("技能特长")!=-1){
				var jytcs=$(ele).find(".tbb table");
				jytcs.each(function(index,el){
					var item_name=$(el).find(".tit").text();
					if(item_name.indexOf("技能/语言")!=-1){
						//----51job技能----
						var skilllanguage_eles=$(el).find(".tb2");
						items = [];
						skilllanguage_eles.each(function(j, ele_item) {
							var item = {};
							item["name"] = clearAllHtmlText($(ele_item).find(".skill").html());
							item["masterLevelDesc"] = clearAllHtmlText($(ele_item).find(".skco").html());
							item["masterLevel"] = getMasterLevel(item["masterLevelDesc"]);
							items[j] = item;
						});
						resume["resume_skill"] = items;
						if(items.length>0){
							modul_show["resume_skill"]["isShow"]=true;
						}else{
							modul_show["resume_skill"]["isShow"]=false;
						}
					}else if(item_name.indexOf("证书")!=-1){
						//----51job证书: 添加成无时间的自定义模块----
						var skillcertification_eles=$(el).find(".tb3");
						var certificate="";
						skillcertification_eles.each(function(j, ele_item) {
							certificate=certificate+clearAllHtmlText($(ele_item).find(".time").html()+"   "+$(ele_item).find(".rtbox").html())+"<br/>";
						});
						var customPlate = getCustomPlateNoTime(item_name, certificate);
						var certificateItem = customPlate["customItem"];
						var certificateItemShow = customPlate["customItemShow"];
						custom.push(certificateItem);
						modul_show[certificateItem.key]=certificateItemShow;
					}else if(item_name.indexOf("培训经历")!=-1){
						//----51job培训经历: 添加成有时间的自定义模块--- 
						itemList = [];
						var skilltrain_eles=$(el).find(".p15");
						console.log(skilltrain_eles);
						skilltrain_eles.each(function(j, ele_item) {
							ele_item = $(ele_item);
							var item = {};
							item["content"] = clearAllHtmlText(ele_item.find(".tb1").eq(0).html());
							var time = clearAllHtmlText(ele_item.find(".time").html()).split("-");
							item["beginTime"]=time[0].replace("/","\.");
							item["endTime"]=time[1].replace("/","\.");
							item["unit"] = clearAllHtmlText(ele_item.find(".tb2").eq(0).html());
							item["job"] = clearAllHtmlText(ele_item.find(".rtbox").html());
							itemList[j] = item;
						});
						var customPlate = getCustomPlateHasTime(item_name, itemList);
						var customItem = customPlate["customItem"];
						var customItemShow = customPlate["customItemShow"];
						custom.push(customItem);
						modul_show[customItem.key]=customItemShow;
					}
				});
			}else if(titleName.indexOf("求职意向")!=-1){
				//----51job求职意向----
				var $intentionList=$(ele).find(".tb2");
				var jobFunction = "";//职业名称,"java工程师"
				var jobType= "fullTime";//类型(fullTime:全职,partTime:兼职,intern:实习)
				var jobTime= "withinOneWeek";//到岗时间(immediately:随时,withinOneWeek:1周内,withinOneMonth:1个月内,withinThreemonth:3个月内,toBeDetermined:待定)
				//var jobCity= "";//城市id,"2606"
				var jobCityName= "";//城市名称
				var jobMinSalary= "5";//最小金额（兼职后端取最小金额）
				var jobMaxSalary= "10";//最大金额
				
				$intentionList.each(function(index,el){
					var keys=$(el).find(".keys").text();
					if(keys.indexOf("职能")!=-1){//职业名称
						jobFunction=clearAllHtmlText($(el).find(".txt2").html());
						if(jobFunction.lenght>=15){
							jobFunction=jobFunction.substring(0,15);
						}
					}else if(keys.indexOf("工作类型")!=-1){//类型(fullTime:全职,partTime:兼职,intern:实习)
						jobType=clearAllHtmlText($(el).find(".txt2").html());
						jobType=getJobType(jobType);
					}else if(keys.indexOf("到岗时间")!=-1){
						jobTime = clearAllHtmlText($(el).find(".txt2").html());
						jobTime = getJobTime(jobTime);
						
					}else if(keys.indexOf("地点")!=-1){
						jobCityName=clearAllHtmlText($(el).find(".txt2").html());
					}else if(keys.indexOf("期望薪资")!=-1){
						var salary=clearAllHtmlText($(el).find(".txt2").html()).split(/[元|-]/);
						if(salary.length == 3){	//说明薪资格式是"2001-4000元/月"
							if(int_reg.test(salary[0].trim())){
								jobMinSalary=Math.round(parseFloat(salary[0].trim())/1000);
							}
							if(int_reg.test(salary[1].trim())){
								jobMaxSalary=Math.round(parseFloat(salary[1].trim())/1000);
							}
						}else{									//说明薪资格式是"1000元/月以下"或者"1000000元/月以上"
							if(int_reg.test(salary[0].trim())){//最小和最大工资都等于同一个值
								jobMinSalary=Math.round(parseFloat(salary[0].trim())/1000)
							}		
						}
					}
				});
				var resume_job_preference = {
						"jobFunction":jobFunction,
						"jobType":jobType,			//类型(fullTime:全职,partTime:兼职,intern:实习)
						"jobTime":jobTime,			//到岗时间(immediately:随时,withinOneWeek:1周内,withinOneMonth:1个月内,withinThreemonth:3个月内,toBeDetermined:待定)
						//"jobCity":jobCity,			//城市id, 无法获取城市id
						"jobCityName":jobCityName,	//城市名称
						"jobMinSalary":jobMinSalary,//最小金额（兼职后端取最小金额）
						"jobMaxSalary":jobMaxSalary //最大金额
				};
				resume["resume_job_preference"]=resume_job_preference;
				//----自我评价----
				var selfassessment=$(ele).find(".tb1").eq(1).find(".txt1").eq(1).html();
				resume["resume_summary"]=clearAllHtmlText(selfassessment);
				if(selfassessment!=undefined&&selfassessment.length>0){
					modul_show["resume_summary"]["isShow"]=true;
				}else{
					modul_show["resume_summary"]["isShow"]=false;
				}
			}
		});
		//个人信息
		resume["resume_base_info"]=resume_base_info;
		//模块显示控制
	    resume["modul_show"]=modul_show;
	    //自定义模块
	    resume["custom"]=custom;
	    /** 保存到数据库 */
	    var return_json=resume_save(resume,itemId,memberId);
		setTimeout(function(){
			$("div.progressbar").find("i").css("width","100%");
			$("div.progressbar").find("span").text("100%");
		},1000);
		setTimeout(function(){
			$("#importRModal").modal("hide");
			if(return_json.flag=="true"){
				$("#importRsuccModal").modal("show");
				$("#importRsuccModal").find(".bd a").attr("href",return_json.content);
			}else{
				if(return_json.content!=null&&return_json.content.indexOf("已超过最大简历创建数量，请升级会员继续")!=-1){
					//获取对应的提示内容
					common.main.resume_confirm({
						title:"VIP会员升级提示",
						modal_class:"vip-content",
						content:"超出最大创建简历数量，请删除部分简历或升级会员后继续",
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
				}else{
					$("#importResetModal").find(".tips_show").text(return_json.content);
					$("#importResetModal").modal("show");
				}
			}
			hide_pro();
		},2000)
		return;
	}catch(e){
		console.log(e);
		$("#importRModal").modal("hide");
		$("#importResetModal").modal("show");
		$("#importResetModal").find(".tips_show").text("简历文件内容解析错误,导入失败，请重新选择文件导入");
	}
}



/**
 * 获取拉勾简历
 * @param html
 * @param itemId
 * @param memberId
 * @returns {String}
 */
function getLagouResumeJson(html,itemId,memberId){
	if(html==null||html==""||html==undefined){
		$("#importRModal").modal("hide");
		$("#importResetModal").modal("show");
		$("#importResetModal").find(".tips_show").text("由于文件内容为空,导入失败，请重新导入")
		return "";
	}
	try{
		var resume_page=$(html);
		if(html.indexOf("zhaopin.com")!=-1){
			$("#importRModal").modal("hide");
			$("#importResetModal").modal("show");
			$("#importResetModal").find(".tips_show").text("当前导入的简历是智联简历，请选择拉勾简历再导入");
			return;
		}else if(html.indexOf("lagou.com")==-1){
			$("#importRModal").modal("hide");
			$("#importResetModal").modal("show");
			$("#importResetModal").find(".tips_show").text("当前导入的简历不是拉勾简历，请选择正确文件再重新导入");
			return;
		}
		var resume={};//简历信息实体
		var modul_show={};
		var iconFontMap={};
		resume=init_resume(resume,modul_show,iconFontMap);
		var Basic=resume_page.find("#mr_mr_head");//基础信息
		var resume_base_info = {};                //基本信息对象
	    var custom = [];                         //自定义模块数组
	    
	    //-----------拉勾基本信息开始----------------
		//头像
		var head=Basic.find(".m_portrait").find("img:last").attr("src");
		if(head!=null&&head!=undefined){
			resume["resume_head"]=head;
			modul_show["headShow"]=true;
			resume["resume_headType"]="rectangle";
		}
		//姓名
		var name=Basic.find(".mr_baseinfo").find("span.mr_name").text();
		resume_base_info["name"]=name;
		//resume["resumeTitle"]=name+"的简历";// 简历名称
		//一句话描述自己
		var minSummary=Basic.find(".mr_baseinfo").find("span.mr_intro").text();
		resume_base_info["minSummary"]=minSummary;
		
		// 个人基本信息 
		var mr_p_info=Basic.find(".mr_p_info");
		// ["男", "", "", "17岁", "", "", "大专", "10年以上工作经验2000.02年出生", "", "", "广州"]
		var base_info = clearAllHtmlText(mr_p_info.find(".base_info").html()).split("&nbsp;");
		// 拉勾如果某些信息没填写, 那么就不会显示, 所以需要进行判断
		for(i in base_info){
			var item = base_info[i];
			if(item!="" && item!=null && item!=undefined){
				if(/[男|女]/.test(item)){
					//获取性别
					resume_base_info["sex"] = getGender(item);
				}else if(item.indexOf("经验")!=-1){
					//获取工作年数
					if(item.indexOf("10年以上")!=-1){
						resume_base_info["jobYear"]="more";  
					}else{
						var jobYear = item.split("年")[0];	//获取工作年数, 如"10"
						resume_base_info["jobYear"]=getJobYear(jobYear);
					}
					if(item.indexOf("出生")!=-1){
						//获取出生年月
						var arr = item.split(/[年|经验|\.]/);	//["10", "以上工作", "", "2000", "02", "出生"]
						if(int_reg.test(arr[arr.length-2])){
							resume_base_info["birthYear"]=arr[arr.length-2];	
						}else{
							resume_base_info["birthYear"]="1990";	
						}
						if(int_reg.test(arr[arr.length-3])){//出生月份
							resume_base_info["birthMonth"]=arr[arr.length-3];
						}else{
							resume_base_info["birthMonth"]="1";
						}
					}
				}
			}
			//var city = base_info[base_info.length-1];	//所在地没json字段封装??, 在期望工作倒是有封装
		}
		
		//邮箱
		var email=mr_p_info.find("span.email").text();
		resume_base_info["email"]=email;
		//电话
		var tel=mr_p_info.find("span.mobile").text();
		resume_base_info["mobile"]=tel;
		//===========拉勾基本信息结束=============
		//----拉勾工作经历----
		var work=resume_page.find("#workExperience");
		var items = [];
		var work_eles=work.find(".mr_jobe_list");
		work_eles.each(function(j, ele_item) {
			ele_item = $(ele_item);
			var item = {};
			item["content"] = clearText(ele_item.find("div.mr_content_m").html());
			var time = clearAllHtmlText(ele_item.find(".mr_content_r").find("span").html()).split("--");	//2017.01 -- 2017.05
			item["beginTime"] = time[0].trim();			//获取时间"2017.01", 并且去掉空格
			item["endTime"] = time[1].trim();			//获取时间"2017.05", 并且去掉空格
			item["unit"] = clearAllHtmlText(ele_item.find(".mr_content_l").find("h4").html());
			item["job"] = clearAllHtmlText(ele_item.find(".mr_content_l").find("span").html());
			items[j] = item;
		});
		resume["resume_work"] = items;
		if(items.length>0){
			modul_show["resume_work"]["isShow"]=true;
		}else{
			modul_show["resume_work"]["isShow"]=false;
		}
		//----拉勾教育经历----
		var education=resume_page.find("#educationalBackground");
		var key ="edu";
		items = [];
		var education_eles=education.find(".mr_jobe_list");
		education_eles.each(function(j, ele_item) {
			ele_item = $(ele_item);
			var item = {};
			item["content"] ="";
			var time = clearAllHtmlText(ele_item.find(".mr_content_r").find("span").html()).split("年");	//"2017年毕业" =>["2017","毕业"]
			item["beginTime"] = "";
			item["endTime"] = time[0].trim();
			item["unit"] = clearAllHtmlText(ele_item.find(".mr_content_l").find("h4").html());
			item["job"] = clearAllHtmlText(ele_item.find(".mr_content_l").find("span").html());
			items[j] = item;
		});
		resume["resume_edu"] = items;
		if(items.length>0){
			modul_show["resume_edu"]["isShow"]=true;
		}else{
			modul_show["resume_edu"]["isShow"]=false;
		}
		//----拉勾项目经验----
		var project=resume_page.find("#projectList");
		var key ="project";
		items = new Array();
		var project_eles=project.find(".mr_jobe_list");
		project_eles.each(function(j, ele_item) {
			ele_item = $(ele_item);
			var item = {};
			item["content"] = clearText(ele_item.find("div.mr_content_m").html());
			var time = clearAllHtmlText(ele_item.find(".mr_content_r").find("span").html()).split("--");
			item["beginTime"] = time[0].trim();
			item["endTime"] = time[1].trim();
			item["unit"] = clearAllHtmlText(ele_item.find(".mr_content_l").find(".projectTitle").html());
			item["job"] = clearAllHtmlText(ele_item.find(".mr_content_l").find("p").html());
			items[j] = item;
		});
		resume[key] = items;
		if(items.length>0){
			modul_show["resume_project"]["isShow"]=true;
		}else{
			modul_show["resume_project"]["isShow"]=false;
		}
		//----拉勾自我评价----
		try{
			var selfDescription=resume_page.find("#selfDescription");
			var selfassessment=selfDescription.find(".mr_moudle_content").find(".mr_self_r").html();
			resume["resume_summary"]=clearAllHtmlText(selfassessment);
            if(selfassessment.length>0){
                modul_show["resume_summary"]["isShow"]=true;
            }else{
                modul_show["resume_summary"]["isShow"]=false;
            }
		}catch(e){
			console.log(e);
			resume["resume_summary"]="";
			modul_show["resume_summary"]["isShow"]=false;
		}
		//----拉勾求职意向/期望工作----
		/*var expectJob=resume_page.find("#expectJob");
		var job=expectJob.find(".mr_job_name").html();
		resume["job"]=job;*/
		var jobFunction = "";//职业名称,"java工程师"
        var jobType= "fullTime";//类型(fullTime:全职,partTime:兼职,intern:实习)
        var jobTime= "withinOneWeek";//到岗时间(immediately:随时,withinOneWeek:1周内,withinOneMonth:1个月内,withinThreemonth:3个月内,toBeDetermined:待定)
        //var jobCity= "";//城市id,"2606"
        var jobCityName= "";//城市名称
        var jobMinSalary= "5";//最小金额（兼职后端取最小金额）
        var jobMaxSalary= "10";//最大金额
        
        var expectJob=resume_page.find("#expectJob");
        //职业名称
        jobFunction=expectJob.find(".mr_job_name").html();
        //工作类型
        jobType=expectJob.find(".mr_job_type").html();
        jobType = getJobType(jobType);			//转换工作类型为英文
        //到岗时间
        jobTime = getJobTime(jobTime);
		//工作城市
        jobCityName=expectJob.find(".mr_job_adr").html();
        //薪资
        if(expectJob.find(".mr_job_range").length > 0){
	        var salary = expectJob.find(".mr_job_range").html().replace(/k/g,"000").split("-");
	        if(salary.length==2){		//说明薪资格式是"10k-15k", 替换"k"后变成"10000-15000", split后变成"[10000,15000]", length为2
	        	if(int_reg.test(salary[0].trim())){
	        		jobMinSalary = Math.round(parseFloat(salary[0].trim())/1000);
	        	}
	        	if(int_reg.test(salary[1].trim())){
	        		jobMaxSalary = Math.round(parseFloat(salary[1].trim())/1000);
	        	}
	        	
	        }else{						//salary = ["50000以上"]
	        	if(int_reg.test(salary[0].split("以")[0].trim())){
	        		jobMinSalary = jobMaxSalary = Math.round(parseFloat(salary[0].split("以")[0].trim())/1000);	//说明薪资格式是"2k以下"或者是"50k以上"这种, 只取前面的数值如"2000"或者"50000"
	        	}
	        }
        }
        var resume_job_preference = {
            "jobFunction":jobFunction,
            "jobType":jobType,            //类型(fullTime:全职,partTime:兼职,intern:实习)
            "jobTime":jobTime,            //到岗时间(immediately:随时,withinOneWeek:1周内,withinOneMonth:1个月内,withinThreemonth:3个月内,toBeDetermined:待定)
            //"jobCity":jobCity,            //城市id
            "jobCityName":jobCityName,    //城市名称
            "jobMinSalary":jobMinSalary,//最小金额（兼职后端取最小金额）
            "jobMaxSalary":jobMaxSalary //最大金额
        };
        resume["resume_job_preference"]=resume_job_preference;
		//----技能----
		var skillsAssess=resume_page.find("#skillsAssess");
		var skillsAssess_eles=skillsAssess.find(".mr_skill_con");
		var items = [];
		skillsAssess_eles.each(function(j, ele_item) {
			var item = {};
            item["name"] = clearAllHtmlText($(ele_item).find(".mr_skill_name").html());
            item["masterLevelDesc"] = clearAllHtmlText($(ele_item).find(".mr_skill_level").html());
            item["masterLevel"] = getMasterLevel(item["masterLevelDesc"]);
            items[j] = item;
		});
		resume["resume_skill"] = items;
        if(items.length>0){
            modul_show["resume_skill"]["isShow"]=true;
        }else{
            modul_show["resume_skill"]["isShow"]=false;
        }
        
		//----拉勾自定义模块: 添加成无时间的自定义模块----
		var customBlock=resume_page.find("#customBlock");
		var title = clearText(customBlock.find(".cust_title").html());
		var content = clearText(customBlock.find(".mr_moudle_content").html());
		var customPlate = getCustomPlateNoTime(title, content);
        var customItem=customPlate["customItem"];
        var customItemShow=customPlate["customItemShow"];
        custom.push(customItem);
        modul_show[customItem.key]=customItemShow;
		
	    resume["modul_show"]=modul_show;				//显示控制
	    resume["resume_base_info"]=resume_base_info;	//个人信息
	    resume["custom"]=custom;						//自定义
		var return_json=resume_save(resume,itemId,memberId);
		setTimeout(function(){
			$("div.progressbar").find("i").css("width","100%");
			$("div.progressbar").find("span").text("100%");
		},1000);
		setTimeout(function(){
			$("#importRModal").modal("hide");
			if(return_json.flag=="true"){
				$("#importRsuccModal").modal("show");
				$("#importRsuccModal").find(".bd a").attr("href",return_json.content);
			}else{
				if(return_json.content!=null&&return_json.content.indexOf("已超过最大简历创建数量，请升级会员继续")!=-1){
					//获取对应的提示内容
					common.main.resume_confirm({
						title:"VIP会员升级提示",
						modal_class:"vip-content",
						content:"超出最大创建简历数量，请删除部分简历或升级会员后继续",
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
				}else{
					$("#importResetModal").find(".tips_show").text(return_json.content);
					$("#importResetModal").modal("show");
				}
			}
			hide_pro();
		},2500);
		return ;
	}catch(e){
		console.log(e);
		$("#importRModal").modal("hide");
		$("#importResetModal").modal("show");
		$("#importResetModal").find(".tips_show").text("简历文件内容解析错误,导入失败，请重新选择文件导入");
	}
}


/**
 * 获取智联简历
 * @param html
 * @param itemId
 * @param memberId
 * @returns {String}
 */
function getZhilianResumeJson(html,itemId,memberId){
	if(html==null||html==""||html==undefined){
		$("#importRModal").modal("hide");
		$("#importResetModal").modal("show");
		$("#importResetModal").find(".tips_show").text("由于文件内容为空,导入失败，请重新导入")
		return "";
	}
	try{
		var resume_page=$(html);
		if(html.indexOf("lagou.com")!=-1){
			$("#importRModal").modal("hide");
			$("#importResetModal").modal("show");
			$("#importResetModal").find(".tips_show").text("当前导入的简历是拉勾简历，请选择智联简历再导入");
			return;
		}else if(html.indexOf("zhaopin.com")==-1){
			$("#importRModal").modal("hide");
			$("#importResetModal").modal("show");
			$("#importResetModal").find(".tips_show").text("当前导入的简历不是智联简历，请选择正确文件再重新导入");
			return;
		}
		var resume={};            //简历信息实体
	    var modul_show = {};      //模块控制
	    var iconFontMap = {};     //图标
		//初始化内容
		resume=init_resume(resume,modul_show,iconFontMap);
		//resume["resumeTitle"]=resume_page.find(".summary").find("h1").eq(0).text();// 简历名称, v5没有这个字段??
		resume["base"]
		var resume_base_info = {};                //基本信息对象
        var custom = [];                          //自定义模块数组
        var skillItems = [];
        //--------------智联基本信息抽取------------
		var Basic=resume_page.find(".summary");//基础信息
		//头像
		var head=Basic.find("img.headerImg").attr("src");
		if(head!=null&&head!=undefined){
			resume["resume_head"]=head;
			modul_show["headShow"]=true;
			resume["resume_headType"]="rectangle";
		}
		//resume["resume_head"]=head;	//v5没抽取??
		//modul_show["resume_head"]=true;
		//姓名
		var name=Basic.find("h1").eq(0).text();
		resume_base_info["name"]=name;
		//邮箱: 智联的邮箱保密的,带星号,所以不能抽取,否则会抽取错误误导用户, 格式如下: 134****9815
		//var email=Basic.find("p").eq(1).find("a").text();
		resume_base_info["email"]="";
		//电话: 智联的手机保密的,带星号,所以不能抽取,否则会抽取错误误导用户, 格式如下: longxia****@163.com
		//var tel=Basic.find("p").eq(0).text();
		resume_base_info["mobile"]="";
		//男|未婚|1988年6月生|户口：湖南-郴州|现居住于:广东 深圳<br />6年工作经验 |团员
		Basic.find("h1").eq(0).remove();
		Basic.find("p").remove();
		Basic.find("img").remove();
		var more_info=clearAllHtmlText(Basic.html());
		console.log(more_info);
		var more_infos=more_info.split("|");
		$.each(more_infos,function(index,val){	//智联的婚姻如果没填,那么就不显示, 所以要用each来迭代
			resume_base_info["sex"] = getGender(val.trim());
			if(/[男|女]/.test(val)){
				resume_base_info["sex"] = getGender(val);
	        }else if(/[未婚|已婚|离异]/.test(val)){	
	        	//婚姻状态
                resume_base_info["marriageStatus"]=getMarriageStatus(val);
	        }else if(val.indexOf("居住")!=-1){	
	        	//居住地址和工作年限
	        	var jobYear="";
	        	$.each(val.split(""),function(index, value){	//计算工作年限
	        		if(!isNaN(value)){
	        			jobYear+=value;
	        		}
	        	});
	        	jobYear = jobYear.trim();
	        	//工作年限转换成相应的英文年限
	        	if(jobYear<11){
	                resume_base_info["jobYear"]=getJobYear(jobYear);    //小于等于10年, jobYear为具体的工作年数, 如"3年"为"three"
	            }else{
	                resume_base_info["jobYear"]="more";                 //大于10年, jobYear为"10年以上"
	            }
	        }else if(/[中共党员(含预备党员)|团员|群众|民主党派|无党派人士]/.test(val.trim())){
	        	var politicalStatus = val;
                resume_base_info["politicalStatus"]=getPoliticalStatus(politicalStatus);
	        }
		});
		//===============智联基本信息结束==================
		
		var details=resume_page.find(".details");
		var modals=details.children("dt");
		modals.each(function(index,ele){//遍历模块
			var modal_name=clearAllHtmlText($(ele).html());
			var slib_dd=$(ele).next("dd");
			if(modal_name.indexOf("求职意向")!=-1){
				//----智联求职意向----
                var jobFunction = "";//职业名称,"java工程师"
                var jobType= "fullTime";//类型(fullTime:全职,partTime:兼职,intern:实习)
                var jobTime= "withinOneWeek";//到岗时间(immediately:随时,withinOneWeek:1周内,withinOneMonth:1个月内,withinThreemonth:3个月内,toBeDetermined:待定)
                //var jobCity= "";//城市id,"2606"
                var jobCityName= "";//城市名称
                var jobMinSalary= "5";//最小金额（兼职后端取最小金额）
                var jobMaxSalary= "10";//最大金额
                
				var lis = slib_dd.find("li");			//获取所有的求职意向选项工作性质, 期望职业等
				lis.each(function(index,el){
					var item = clearAllHtmlText($(el).html()).split("：");
					if(item[0].indexOf("工作性质")!=-1){
						jobType = getJobType(item[1]);
					}else if(item[0].indexOf("期望职业")!=-1){
						jobFunction=item[1];
					}else if(item[0].indexOf("期望月薪")!=-1){
						var salary=item[1].split(/[元|-]/);
						if(salary.length == 3){	//说明薪资格式是"2001-4000元/月"
							if(int_reg.test(salary[0].trim())){
								jobMinSalary=Math.round(parseFloat(salary[0].trim())/1000);
							}
							if(int_reg.test(salary[1].trim())){
								jobMaxSalary=Math.round(parseFloat(salary[1].trim())/1000);
							}
						}else{									//说明薪资格式是"1000元/月以下"或者"1000000元/月以上"
							if(int_reg.test(salary[0].trim())){
								jobMinSalary=jobMaxSalary=Math.round(parseFloat(salary[0].trim())/1000);		//最小和最大工资都等于同一个值
							}
							
						}
					}
				});
				var resume_job_preference = {
                        "jobFunction":jobFunction,
                        "jobType":jobType,            //类型(fullTime:全职,partTime:兼职,intern:实习)
                        "jobTime":jobTime,            //到岗时间(immediately:随时,withinOneWeek:1周内,withinOneMonth:1个月内,withinThreemonth:3个月内,toBeDetermined:待定)
                        //"jobCity":jobCity,            //城市id
                        "jobCityName":jobCityName,    //城市名称
                        "jobMinSalary":jobMinSalary,//最小金额（兼职后端取最小金额）
                        "jobMaxSalary":jobMaxSalary //最大金额
                };
                resume["resume_job_preference"]=resume_job_preference;
			}else if(modal_name.indexOf("自我评价")!=-1){
				//----智联自我评价----
				var selfassessment=clearAllHtmlText($(slib_dd).html());
				resume["resume_summary"]=clearAllHtmlText(selfassessment);
                if(selfassessment.length>0){
                    modul_show["resume_summary"]["isShow"]=true;
                }else{
                    modul_show["resume_summary"]["isShow"]=false;
                }
			}else if(modal_name.indexOf("工作经历")!=-1){
				//----智联工作经历----
				var resume_work =[];
                var work_eles=slib_dd.find(".work-experience");
                work_eles.each(function(j, ele_item) {
                    ele_item = $(ele_item);
                    var item = {};
                    item["content"] = clearText(ele_item.find("p").eq(2).html());
                    var timeStr = clearAllHtmlText(ele_item.find("p").eq(0).html()).split("--");
                    item["beginTime"] = timeStr[0].replace("/","\.").trim();
                    item["endTime"] = timeStr[1].replace("/","\.").trim();
                    var unit_job=ele_item.find("h6").text();
					var ss=unit_job.split("|");
                    item["unit"] = clearAllHtmlText(ss[0]);
                    item["job"] = clearAllHtmlText(ss[1]);
                    resume_work[j] = item;
                });
                resume["resume_work"] = resume_work;
                if(resume_work.length>0){
                    modul_show["resume_work"]["isShow"]=true;
                }else{
                    modul_show["resume_work"]["isShow"]=false;
                }
			}else if(modal_name.indexOf("项目经验")!=-1){
				//------智联项目经验---------
				var resume_project = [];
                var project_eles=slib_dd.find(".project-experience");
                project_eles.each(function(j, ele_item) {
                    ele_item = $(ele_item);
                    var item = {};
                    //eq(0)可以用first(), eq(1)可以用last() 来实现
                    item["content"] = clearAllHtmlText(ele_item.find("div").nextAll().eq(0).html()+ele_item.find("div").nextAll().eq(1).html());
                    var timeStr = clearAllHtmlText(ele_item.find("p").eq(0).html()).split("--");
                    item["beginTime"] = timeStr[0].replace("/","\.").trim();
                    item["endTime"] = timeStr[1].replace("/","\.").trim();
                    item["unit"] = "";
                    item["job"] =clearAllHtmlText(ele_item.find("h6").eq(0).html());
                    resume_project[j] = item;
                });
                resume["resume_project"] = resume_project;
                if(resume_project.length>0){
                    modul_show["resume_project"]["isShow"]=true;
                }else{
                    modul_show["resume_project"]["isShow"]=false;
                }
			}else if(modal_name.indexOf("教育经历")!=-1){
				//----智联教育经历----
				var resume_edu = [];
				var education_eles=slib_dd.find(".education-background");
                education_eles.each(function(j, ele_item) {
                    ele_item = $(ele_item);
                    var item = {};
                    item["content"] = "";		//智联没有对应的教育背景内容
                    var timeStr = clearAllHtmlText(ele_item.find("p").eq(0).html()).split("--");
                    item["beginTime"] = timeStr[0].replace("/","\.").trim();
                    item["endTime"] = timeStr[1].replace("/","\.").trim();
                    var unit_job=ele_item.find("h6").text();
                    var ss=unit_job.split("|");
                    item["unit"] = clearAllHtmlText(ss[0]);
                    item["job"] = clearAllHtmlText(ss[1]);
                    resume_edu[j] = item;
                });
                resume["resume_edu"] = resume_edu;
                if(resume_edu.length>0){
                    modul_show["resume_edu"]["isShow"]=true;
                }else{
                    modul_show["resume_edu"]["isShow"]=false;
                }
			}else if(modal_name.indexOf("在校实践经验")!=-1){
				//----智联在校实践经验: 设置成共有时间的自定义模块------
				var itemList = [];
				var social_eles=slib_dd.find(".social");
				social_eles.each(function(j, ele_item) {
                    ele_item = $(ele_item);
                    var item = {};
                    var time = clearAllHtmlText(ele_item.find("p").eq(0).html()).split("--");
                    item["beginTime"]=time[0].replace("/","\.").trim();
                    item["endTime"]=time[1].replace("/","\.").trim();
                    item["unit"] = "";
                    item["job"] = clearAllHtmlText(ele_item.find("h6").eq(0).html());
                    //需要获取内容需要放在后面, 否则remove()掉了元素, 导致获取不到time,unit,job等值的
                    ele_item.find("p").eq(0).remove();
                    ele_item.find("h6").remove();
                    item["content"] = clearAllHtmlText(ele_item.html());
                    itemList[j] = item;
                });
                var customPlate = getCustomPlateHasTime(modal_name, itemList);
                var customItem = customPlate["customItem"];				//内容封装
                var customItemShow = customPlate["customItemShow"];		//显示控制
                custom.push(customItem);
                modul_show[customItem.key]=customItemShow;
			}else if(modal_name.indexOf("培训经历")!=-1){
				//----智联培训经历: 设置成有时间的自定义模块-----
				var itemList = [];
				var skilltrain_eles=slib_dd.find(".training");
                skilltrain_eles.each(function(j, ele_item) {
                    ele_item = $(ele_item);
                    var item = {};
                    var time = clearAllHtmlText(ele_item.find("p").eq(0).html()).split("--");
                    item["beginTime"]=time[0].replace("/","\.").trim();
                    item["endTime"]=time[1].replace("/","\.").trim();
                    item["unit"] = "";
                    item["job"] = clearAllHtmlText(ele_item.find("h6").eq(0).html());
                    //需要获取内容需要放在后面, 否则remove()掉了元素, 导致获取不到time,unit,job等值的
                    ele_item.find("p").remove();
                    ele_item.find("h6").remove();
                    item["content"] = clearAllHtmlText(ele_item.html());
                    itemList[j] = item;
                });
                var customPlate = getCustomPlateHasTime(modal_name, itemList);
                var customItem = customPlate["customItem"];				//内容封装
                var customItemShow = customPlate["customItemShow"];		//显示控制
                custom.push(customItem);
                modul_show[customItem.key]=customItemShow;
			}else if(modal_name.indexOf("证书")!=-1){
				//----智联证书: 添加成无时间的自定义模块----
				var skillcertification_eles=details.find(".certificates");
                var certificate="";
                skillcertification_eles.each(function(j, ele_item) {
                    certificate=certificate+$(ele_item).html();
                });
                var customPlate = getCustomPlateNoTime(modal_name, certificate);
                var certificateItem=customPlate["customItem"];
                var certificateItemShow=customPlate["customItemShow"];
                custom.push(certificateItem);
                modul_show[certificateItem.key]=certificateItemShow;
            }else if(modal_name.indexOf("语言能力")!=-1){
				//----智联语言能力: 无法抽取等级, 计划不进行抽取----
				var skilllanguage_eles=details.find(".language-skill");
				skilllanguage_eles.each(function(j, ele_item) {
					var item = {};
					item["name"] = clearAllHtmlText($(ele_item).html()).split("：")[0].trim();
					item["masterLevelDesc"] = "";
					item["masterLevel"] = "";
					skillItems.push(item);
				});
				resume["resume_skill"] = skillItems;
				if(skillItems.length>0){
					modul_show["resume_skill"]["isShow"]=true;
				}else{
					modul_show["resume_skill"]["isShow"]=false;
				}
			}else if(modal_name.indexOf("专业技能")!=-1){
				var skilllanguage_eles=slib_dd.find(".professional-skill");
				skilllanguage_eles.each(function(j, ele_item) {
					var item = {};
					item["name"] = clearAllHtmlText($(ele_item).html()).split("|")[0].trim();
					var masterLevelItem = clearAllHtmlText($(ele_item).html()).split("|");
					item["masterLevelDesc"] = masterLevelItem[0].trim();
					item["masterLevel"] = getMasterLevel(masterLevelItem[1]);
					skillItems.push(item);
				});
				if(skillItems.length>0){
					modul_show["resume_skill"]["isShow"]=true;
				}else{
					modul_show["resume_skill"]["isShow"]=false;
				}
			}else if(modal_name.indexOf("获得荣誉")!=-1){
				//----智联荣誉证书----
				resume["resume_honor"] = clearText(slib_dd.html());
				modul_show["resume_honor"]["isShow"]=true;
			}else{
				//----其他模块定义成无时间的自定义模块: 如"在校学习情况"等----
				var content = clearText(slib_dd.html());
				var customPlate = getCustomPlateNoTime(modal_name, content);
				var otherItem=customPlate["customItem"];
	            var otherItemShow=customPlate["customItemShow"];
	            custom.push(otherItem);
	            modul_show[otherItem.key]=otherItemShow;
			}
		});
		
	    resume["modul_show"]=modul_show;
	    resume["custom"] = custom;//自定义模块
		resume["resume_skill"] = skillItems;	//添加技能模块, 因为智联技能和专业技能分开的, 所以需要通过变量skillItems来添加
		resume["resume_base_info"] = resume_base_info;
		
		console.log(resume);
		$(".zx-loading").hide();
		var return_json=resume_save(resume,itemId,memberId);
		setTimeout(function(){
			$("div.progressbar").find("i").css("width","100%");
			$("div.progressbar").find("span").text("100%");
		},1000);
		setTimeout(function(){
			$("#importRModal").modal("hide");
			if(return_json.flag=="true"){
				$("#importRsuccModal").modal("show");
				$("#importRsuccModal").find(".bd a").attr("href",return_json.content);
			}else{
				if(return_json.content!=null&&return_json.content.indexOf("已超过最大简历创建数量，请升级会员继续")!=-1){
					//获取对应的提示内容
					common.main.resume_confirm({
						title:"VIP会员升级提示",
						modal_class:"vip-content",
						content:"超出最大创建简历数量，请删除部分简历或升级会员后继续",
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
				}else{
					$("#importResetModal").find(".tips_show").text(return_json.content);
					$("#importResetModal").modal("show");
				}
			}
			hide_pro();
		},2000)
		return;
	}catch(e){
		console.log(e);
		$("#importRModal").modal("hide");
		$("#importResetModal").modal("show");
		$("#importResetModal").find(".tips_show").text("由于文件内容格式错误,导入失败，请重新导入")
	}
}

/**
 * 通过ajax保存简历数据
 * @param resume 解析html简历后封装的数据
 * @param itemId 简历item的id, 固定值设置为"206"
 * @param memberId 会员(用户)id
 * @returns {___anonymous36152_36153}
 */
function resume_save(resume,itemId,memberId){
	var returnJson={};
	if(resume==null||resume==undefined){
		returnJson["content"]="没成功识别导入内容";
		returnJson["flag"]="false";
		return returnJson;
	}
	if(typeof cvresume != "undefined"){//判断是否是编辑器环境
		var url="";
		if(cvresume.info.isDropResume!=null){
			resume["sort"]={"resume_base_info":"baseInfo_01","resume_edu":"edu_01","resume_job_preference":"jobPreference_01","resume_work":"work_01","resume_internship":"internship_01","resume_volunteer":"volunteer_01","resume_hobby":"hobby_01","resume_skill":"skill_01","resume_honor":"honor_01","resume_summary":"summary_01","resume_project":"project_01"};
			var flag=cvresume.main.base_resume_save(true,resume);
			url=wbdcnf.base +"/dropcvresume/edit/?resumeId="+cvresume.info.resumeid;
		}else{
			var flag=cvresume.main.base_resume_save(true,resume,false);
			url=wbdcnf.base +'/cvresume/edit/?itemid='+cvresume.info.itemid+'&resumeId='+cvresume.info.resumeid;
		}
		if(flag){
			if (window.localStorage && cvresume.localStorage) {
			    sessionStorage.removeItem("historyid");
			}
			returnJson["content"]=url;
			returnJson["flag"]="true";
			returnJson["resumeTitle"]=resume.resumeTitle;
			common.main.resumeOperationLogUpload(cvresume.info.resumeid,"importresume","","");//导入简历日志上报
		}else{
			returnJson["content"]="简历保存失败~";
			returnJson["flag"]="false";
		}
		return returnJson;
	}else{
		$.ajax({type : "post",
			cache: false,
			async : false,
			url :  wbdcnf.base + "/cvresume/save/",
			data : {"itemid":itemId,"json" : JSON.stringify(resume)},
			success : function(message) {
				if(message.type == "success") {
					var msg_content =JSON.parse(message.content);
					//推送简历计算比例的请求
					returnJson["content"]="/cvresume/edit/?itemid="+msg_content.itemid+"&resumeId="+msg_content.resumeid;
					returnJson["flag"]="true";
					returnJson["resumeTitle"]=resume.resumeTitle;
					common.main.resumeOperationLogUpload(msg_content.resumeid,"importresume","","");//导入简历日志上报
				} else {
					if(message.content == "没有登录！"){
						window.open(wbdcnf.base + "/login/");
					}
					returnJson["content"]=message.content;
					returnJson["flag"]="false";
				}
			}
		});
	}
	return returnJson;
}
/**
 * 获取唯一标识
 */
function uuid() {
    var uuid = "";
    for (var i = 1; i <= 32; i++){
      var n = Math.floor(Math.random() * 16.0).toString(16);
      uuid += n;
      if(i == 8 || i == 12 || i == 16 || i == 20)
        uuid += "";
    }
    return uuid;    
}
/**
 * 清除所有的HTMl的标签，计算实际内容字数
 */
function clearAllHtmlText(text) {
	if(!text)
		return "";
	text = text.replace(/<[^>]+>/g,"");
	text = text.replace(/[\n]/ig,'');
	text = text.replace(/[\r]/ig,'');
	text = text.replace(/[\t]/ig,'');
	return text;
}
/**
 * 清除一些\n\r等等
 */
function clearText(text) {
	if(!text)
		return "";
	text = text.replace(/[\n]/ig,'');
	text = text.replace(/[\r]/ig,'');
	text = text.replace(/[\t]/ig,'');
	return text;
}
function read_local_file(input,itemid,memberId) {
	current_resume_edit_url="";
	var fileContent="";
	var type=$(input).attr("data_type");	//导入的input的data_type中的属性"51job/lagou/zhilian"
	//支持chrome IE10
	if (window.FileReader) {
		var file = input.files[0];
		filename = file.name.split(".")[0];
		var reader = new FileReader();
		reader.onload = function() {
			fileContent=this.result;
			if(type=="lagou"){
				getLagouResumeJson(fileContent,itemid,memberId);
			}else if(type=="zhilian"){
				getZhilianResumeJson(fileContent,itemid,memberId);
			}else if(type=="51job"){
				get51ResumeHtml(fileContent,itemid,memberId);
			}
		}
		if(type=="51job"){
			reader.readAsText(file,'GBK');
		}else{
			reader.readAsText(file);
		}
	} 
	//支持IE 7 8 9 10
	else if (typeof window.ActiveXObject != 'undefined'){
		var xmlDoc; 
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
		xmlDoc.async = false; 
		if(type=="51job"){
			xmlDoc.Charset="GBK"; 
		}
		xmlDoc.load(input.value); 
		fileContent=xmlDoc.xml; 
		if(type=="lagou"){
			getLagouResumeJson(fileContent,itemid,memberId);
		}else if(type=="zhilian"){
			getZhilianResumeJson(fileContent,itemid,memberId);
		}else if(type=="51job"){
			get51ResumeHtml(fileContent,itemid,memberId);
		}
	} 
	//支持FF
	else if (document.implementation && document.implementation.createDocument) { 
		var xmlDoc; 
		xmlDoc = document.implementation.createDocument("", "", null); 
		xmlDoc.async = false; 
		if(type=="51job"){
			xmlDoc.Charset="GBK"; 
		}
		xmlDoc.load(input.value); 
		fileContent=xmlDoc.xml;
		if(type=="lagou"){
			getLagouResumeJson(fileContent,itemid,memberId);
		}else if(type=="zhilian"){
			getZhilianResumeJson(fileContent,itemid,memberId);
		}else if(type=="51job"){
			get51ResumeHtml(fileContent,itemid,memberId);
		}
	} else { 
		layer.msg("上传出错") 
	}
}
function init_resume(resume,modul_show,iconFontMap){
	
	/** 展示模块初始化 */
	modul_show["letterShow"]=false;
	modul_show["coverShow"]=false;
	modul_show["headShow"]=false;
	
	modul_show["resume_head"]= {//头像管理,1
        "isShow": true,//是否显示,1(true,false)
        "isTitleShow": true,//是否显示标题,1(true,false)
        "isTimeShow": true,//是否显示时间,1(true,false)
        "isContentShow": true,//是否显示内容,1(true,false)
        "title": "头像",//标题
        "key": "resume_head"//key
    };
    modul_show["base_info"]= {//基本信息管理
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "基本信息",
        "key": "base_info"
    };
    modul_show["base_home"]= {//个人主页
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "个人主页",
        "key": "base_home"
    };
    modul_show["base_social"]= {//社交账号管理
            "isShow": true,
            "isTitleShow": true,
            "isTimeShow": true,
            "isContentShow": true,
            "title": "社交账号",
            "key": "base_social"
        };
    modul_show["resume_skill"]= {//技能特长
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "技能特长",
        "key": "resume_skill"
    };
    modul_show["resume_hobby"]= {//兴趣爱好
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "兴趣爱好",
        "key": "resume_hobby"
    };
    modul_show["resume_job_preference"]= {//求职意向
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "求职意向",
        "key": "resume_job_preference"
    };
    modul_show["resume_edu"]= {//教育背景
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "教育背景",
        "key": "resume_edu"
    };
    modul_show["resume_work"]= {//工作经验
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "工作经验",
        "key": "resume_work"
    };
    modul_show["resume_internship"]= {//实习经验
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "实习经验",
        "key": "resume_internship"
    };
    modul_show["resume_volunteer"]= {//志愿者经历
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "志愿者经历",
        "key": "resume_volunteer"
    };
    modul_show["resume_project"]= {//项目经验
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "项目经验",
        "key": "resume_project"
    };
    modul_show["resume_honor"]= {//荣誉奖项
        "isShow": false,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "荣誉奖项",
        "key": "resume_honor"
    };
    modul_show["resume_summary"]= {//自我评价
        "isShow": false,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "自我评价",
        "key": "resume_summary"
    };
    modul_show["resume_portfolio"]= {//作品展示
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "作品展示",
        "key": "resume_portfolio"
    };
    modul_show["resume_recoment"]= {//推荐信
        "isShow": false,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "推荐信",
        "key": "resume_recoment"
    };
    modul_show["resume_contact"]= {//联系我
        "isShow": false,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "联系我",
        "key": "resume_contact"
    };
    modul_show["resume_qrcode"]= {//手机简历扫一扫
        "isShow": true,
        "isTitleShow": true,
        "isTimeShow": true,
        "isContentShow": true,
        "title": "手机简历扫一扫",
        "key": "resume_qrcode"
    };
	
	/** 图标初始化 */
	iconFontMap={};
	
	/** 简历其他信息初始化 */
	resume["resume_language"]="zh";				//语言
	resume["resume_set"]={};
	resume["resume_cover"]=[];					//[{"icon":"",//图标  "content":"sss"//内容},{},{}]		//封面信息,1
	resume["resume_base_info"]={				//基本信息
	        "customMsg": [],					//自定义字段
	        "customWebsite": []					//个人网站
	      };
	resume["resume_job_preference"]={};			//求职意向
	resume["resume_skill"]=[];					//专业技能
	resume["resume_hobby"]=[];					//兴趣爱好
	resume["resume_edu"]=[];					//教育经历,内容格式与：工作经验、实习经验、自愿者经历、项目经验一样    //eduJson
	resume["resume_work"]=[];					//工作经验
	resume["resume_internship"]=[];				//实习经验
	resume["resume_volunteer"]=[];				//自愿者经历
	resume["resume_project"]=[];				//项目经验
	resume["resume_portfolio"]={				//作品展示 
				"img": [],						//有图片
	            "link": []						//无图片
	        };
	resume["custom"]=[];						//自定义模块 
	resume["resume_contact"]={};				//联系我们, hr留言
	resume["resume_qrcode"]={					//二维码
	        "qrCodeImg": "../../images/ad_Attention_weixin_ewm.png",
	        "qrCodeTips": ""
	    };
	resume["modul_show"] = modul_show;	//模块显示控制
	resume["iconFontMap"] = iconFontMap;	//图标
	return resume;
}

function hide_pro(){
	setTimeout(function(){
		$("div.progressbar").fadeOut("slow");
	},1000);
	setTimeout(function(){
		$("div.progressbar").find("i").css("width","0%");
		$("div.progressbar").find("span").text("0%");
	},2000);
}

/** 通过数字的字符串形式, 转换成英文 */
function getJobYear(jobYear){
	switch (jobYear)
	{
	case "1":
		return "one";
	case "2":
		return "two";
	case "3":
		return "three";
	case "4":
		return "four";
	case "5":
		return "five";
	case "6":
		return "six";
	case "7":
		return "steven";
	case "8":
		return "eight";
	case "9":
		return "nine";
	case "10":
		return "ten";
	}
}

/** 获取技能/语言等级中文对应的英文 */
function getMasterLevel(masterLevel){
	//average:一般,good:良好,advanced:熟练,expert:精通
	switch (masterLevel.trim())
	{
	case "一般":
	case "了解":
		return "average";
	case "良好":
	case "熟悉":
		return "good";
	case "熟练":
	case "掌握":
		return "advanced";
	case "精通":
	case "专家":
		return "expert";
	}
}

/** 入职时间转换 */
function getJobTime(jobTime){
	switch (jobTime.trim())
	{
	case "随时":
		jobTime="immediately";
	  break;
	case "1周内":
		jobTime="withinOneWeek";
	  break;
	case "1个月内":
		jobTime="withinOneMonth";
	  break;
	case "3个月内":
		jobTime="withinThreemonth";
	  break;
	case "待定":
		jobTime="toBeDetermined";
	  break;
	}
}

/** 性别转换 */
function getGender(gender){
	if(gender.indexOf("女")!=-1){
        return "female";
    }else{
        return "male";
    }
}

/** 婚姻状态转换 */
	//婚姻状态
function getMarriageStatus(status){
    switch(status.trim()){
        case "未婚":
            return "unMarried";
        case "已婚":
            return "married";
        case "保密":
            return "privary";
    }
}

/** 政治角色转换 */
function getPoliticalStatus(status){
	switch(status.trim()){
		case "中共党员":
		case "中共党员(含预备党员)":
			return "partyMember";
		case "共青团员":
		case "团员":
			return "leagueMember";
		case "民主党派人士":
		case "民主党派":
			return "democraticParty";
		case "无党派民主人士":
		case "无党派人士":
			return "noParty";
		default:
			return "citizen";
	}
}

/** 工作类型转换 */
function getJobType(jobType){
	if(jobType == undefined){
		return "fullTime";
	}
	switch (jobType.trim())
	{
	case "全职":
	  return "fullTime";
	case "兼职":
	  return "partTime";
	case "实习":
	  return "intern";
	default:
	  return "fullTime";
	}
}

/** 获取无时间的自定义模块 */
function getCustomPlateNoTime(title,content){
	var customItem={        //证书, 添加成无时间类型的自定义模块
	        "key": uuid(),
	        "position": "right",
	        "isTitleShow": true,
	        "isTimeShow": true,
	        "isContentShow": true,
	        "title": title,
	        "content": content
	};
	var customItemShow={    //模块显示控制
	        "isShow": true,
	        "isTitleShow": true,
	        "isTimeShow": true,
	        "isContentShow": true,
	        "title": title,
	        "key": customItem.key
	};
	return {"customItem":customItem, "customItemShow":customItemShow};
}

/** 获取有时间的自定义模块 */
function getCustomPlateHasTime(title,content){
	var customItem = {				//校内职务添加成自定义字段
			"key": uuid(),
	        "position": "right",
	        "isTitleShow": true,
	        "isTimeShow": true,
	        "isContentShow": true,
	        "title": title,
	        "itemList" : content
	};
	var customItemShow = {			//对应的模块显示控制
		   "isShow": true,
	       "isTitleShow": true,
	       "isTimeShow": true,
	       "isContentShow": true,
	       "title": title,
	       "key": customItem.key
			
	};
	return {"customItem":customItem, "customItemShow":customItemShow};
}