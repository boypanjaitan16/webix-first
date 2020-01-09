import {JetView} from "webix-jet";

export default class LoginView extends JetView {
	config() {
		const authService = this.app.getService("auth");

		let ui = {
			cols: [
				{ gravity:1, template:"" },
				{
					rows: [
						{gravity: 1, template: ""},
						{
							view	: "form",
							gravity	: 1,
							id		: "loginForm",
							width	: 500,
							rules	:{
								"username"	: webix.rules.isNotEmpty,
								"password"	: webix.rules.isNotEmpty,
							},
							elements:       [
								{
									view        : "text",
									name        : "username",
									label       : "Username",
									required    : true,
									placeholder : "username"
								},
								{
									view        : "text",
									name        : "password",
									label       : "Password",
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
									name    : "login",
									label   : "Login",
									hotkey  : "enter",
									click   : () => {
										let component = this.$$("loginForm");

										if (component.validate()) {
											component.disable();
											component.showProgress();

											let values = this.$$("loginForm").getValues();

											try {
												authService.login(values.username, values.password).catch(e => {
													webix.alert({
														title   : "Failed",
														text    : e.toString(),
														type    : "alert-error"
													})
														.then(function(){
															component.hideProgress();
															component.enable();
															component.focus();
														});
												});
											}
											catch (e) {
												webix.alert({
													title   : "Failed",
													text    : e.toString(),
													type    : "alert-error"
												})
													.then(function(){
														component.hideProgress();
														component.enable();
														component.focus();
													});
											}
										} else {
											this.$$("loginForm").focus();
										}
									}
								},
								{
									template	: "<small>OR</small>", view : "template", autoheight: true, css:"no_border text_center text_muted"
								},
								{
									view 	: "button",
									height	: 50,
									name	: "register",
									label	: "Register",
									click	: () => {
										this.app.show("/register");
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
		webix.extend(this.$$("loginForm"), webix.ProgressBar);

		/*
		this.$$('loginForm').setValues({
			username	: 'boypanjaitan16',
			password	: 'mypass'
		});
		*/
	}
}
