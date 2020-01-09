import {JetView} from "webix-jet";
import {BASE_URL} from "../helpers/info";

export default class SubmitView extends JetView{
	config() {
		let ui = {
			cols: [
				{ gravity:1, template:"" },
				{
					rows: [
						{ gravity: 1, template: "" },
						{ view:"template", icon:"mdi mdi-download", template:"<i class='mdi mdi-download'></i> Facebook Video Downloader", type:"header" }, // 1st row
						{
							view	:  "form",
							gravity	: 1,
							id		:    "submitForm",
							width	: 800,
							elements	:[
								{
									gravity		: 2,
									view        : "text",
									id          : "url",
									name        : "url",
									labelPosition: "top",
									required    : true,
									placeholder : "Paste the video's link here"
								},
								{
									view	:"button", value:"GO !", type:"form", autowidth:true, autoheight: true, css:"webix_primary",
									tooltip	:"Process the link",
									click:() => {
										let component 		= this.$$("submitForm");
										const values		= component.getValues();
										const authService 	= this.app.getService("auth");
										const detail		= authService.getUser();

										if(this.$$("video")){
											component.removeView("video");
										}

										component.disable();
										component.showProgress();

										webix.ajax().get("https://u7z2x4sm48.execute-api.ap-southeast-1.amazonaws.com/latest/facebook", {
											url		: values.url,
										})
											.catch(function (err) {
												webix.alert({title:"Error", text:err, type:"alert-error"});
											})
											.then(function(data){
												component.hideProgress();
												component.enable();
												component.focus();

												const result	= data.json();
												if(result.status === "success"){
													if (Object.keys(result.data.download).length !== 0) {

														webix.ajax().post(BASE_URL+"/log/create", {
															url 		: values.url,
															result		: result.data.download.sd,
															username 	: detail.username,
															title 		: result.data.title
														});

														webix.alert({
															title	: "Video Found",
															text	: result.data.title
														})
															.then(function () {
																component.addView({
																	tooltip	: "Right click on video to download",
																	view	: "video",
																	id		: "video",
																	height	: 350,
																	src		: [result.data.download.sd]
																}, 2);
															});
													}
													else {
														webix.alert({title:"Failed", text:"Video not available", type:"alert-error"});
													}

												}
												else {
													webix.alert({title:"Error", text:result.message, type:"alert-error"});
												}
											});
									}
								},
							],
						},
						{gravity: 1, template: ""}
					]
				},
				{ gravity:1, template:"" }
			]
		};

		return ui;
	}

	init() {
		webix.extend(this.$$("submitForm"), webix.ProgressBar);
	}
}
