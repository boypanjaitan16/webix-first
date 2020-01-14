import {JetView} from "webix-jet";
import {BASE_URL} from "../helpers/info";

export default class RegisterView extends JetView {
	config() {
		let ui = {
			cols: [
				{ gravity:1, template:"" },
				{
					rows: [
						{gravity: 1, template: ""},
						{
							view		: "form",
							gravity		: 1,
							minWidth	: 250,
							maxWidth	: 500,
							localId		: "registerForm",
							rules		: {
								"fname"	: webix.rules.isNotEmpty,
								"uname"	: webix.rules.isNotEmpty,
								"email"	: webix.rules.isNotEmpty
							},
							elements:       [
								{
									view:"text", name:"uname",
									label:"Username", labelPosition:"top",
									placeholder:"Username",
									invalidMessage:"Username is required",
								},
								{
									view:"text", name:"fname",
									label:"Full Name", labelPosition:"top",
									placeholder:"First name",
									invalidMessage:"Full name is required",
								},
								{
									view:"text", name:"email",
									label:"Email", labelPosition:"top",
									invalidMessage:"Email is required",
									placeholder:"Email",
									type	: "email"
								},
								{
									view:"text", name:"phone", label:"Phone Number", labelPosition:"top", placeholder:"Phone", type:"number"
								},
								{
									view        : "text",
									name        : "password",
									label       : "Password",
									required    : true,
									type        : "password"
								},
								{
									view        : "text",
									name        : "cfpassword",
									label       : "Confirm Password",
									required    : true,
									type        : "password"
								},
								{
									height	: 20
								},
								{
									view    : "button",
									height	: 50,
									css		: "webix_primary",
									label   : "Register",
									hotkey  : "enter",
									click   : () => {
										let component 	= this.$$("registerForm");
										const myapp		= this.app;

										if (component.validate()) {
											component.disable();
											component.showProgress();

											let values = this.$$("registerForm").getValues();

											webix.ajax().post(BASE_URL+"/register", {
												username	: values.uname,
												name		: values.fname,
												email		: values.email,
												phone 		: values.phone,
												password 	: values.password,
												cfpassword	: values.cfpassword
											})
												.catch(function (err) {
													component.hideProgress();
													component.enable();
													component.focus();

													webix.alert({
														title	: "Error",
														text	: err.toString(),
														type	: "alert-error"
													});
												})
												.then(function (data) {
													component.hideProgress();
													component.enable();
													component.focus();

													const result	= data.json();

													if (result.status === "success"){
														webix.alert({
															title	: "Success",
															text	: "You can now login using your account credentials"
														})
															.then(function () {
																webix.message("Registration success", "success");
																myapp.show("/login");
															});
													}
													else {
														webix.alert({
															title	: "Failed",
															text	: result.message,
															type	: "alert-error"
														});
													}
												});
										}
										else {
											component.focus();
										}
									}
								},
								{
									height	: 20
								},
								{
									template	: "Already have account? <strong>Login</strong>",
									view 		: "button",
									autoheight	: true,
									css			: "no_border text_center",
									click		: () => {
										this.app.show("/login");
									}
								}
							],
							elementsConfig: {
								labelPosition: "top",
								validateEvent: "key"
							}
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
		webix.extend(this.$$("registerForm"), webix.ProgressBar);
	}
}
