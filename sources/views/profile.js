import {JetView} from "webix-jet";
import {BASE_URL} from "../helpers/info";

export default class ProfileView extends JetView {
	config(){

		const main_info = {
			margin:10,
			rows:[
				{
					view:"text", name:"uname",
					label:"Username", labelPosition:"top",
					placeholder:"Username",
					invalidMessage:"Username is required",
					tooltip:"@" + "#value#",
					readonly:true,
					disabled 	: true
				},
				{
					view:"text", name:"fname",
					label:"Full Name", labelPosition:"top",
					placeholder:"First name",
					invalidMessage:"Full name is required",
					tooltip:"Hai " + "#value#"
				},
				{
					view:"text", name:"email",
					label:"Email", labelPosition:"top",
					invalidMessage:"Email is required",
					placeholder:"Email",
					tooltip:obj => {
						return obj.value ? "The working email address of the client" : "<span class='notselected'>"+"Not specified"+"</span>";
					}
				},
				{
					view:"text", name:"phone", label:"Phone Number", labelPosition:"top", placeholder:"Phone"
				},
				{
					view        : "text",
					name        : "password",
					label       : "Password",
					invalidMessage:"Password is required",
					labelPosition:"top",
				},
			]
		};

		const upper_section = {
			margin:48, cols:[
				main_info
			]
		};

		const buttons = {
			margin:10,
			cols:[
				{
					view:"button", value:"Reset", autowidth:true, css:"webix_danger",
					click:() => {
						this.$$("form").clear();
					},
					tooltip:"Click to clean the form"
				},
				{
					view	:"button", value:"Save", type:"form", autowidth:true, css:"webix_primary",
					tooltip	:"Save changes",
					click	:() => {
						if (this.$$("form").validate()){

							const component	= this.$$("form");

							component.disable();
							component.showProgress();

							const form 	= this.$$("form").getValues();

							webix.ajax().post(BASE_URL+"/update", {
								username	: form.uname,
								name		: form.fname,
								email 		: form.email,
								phone 		: form.phone,
								password 	: form.password
							})
								.catch(e => {
									component.hideProgress();
									component.enable();
									component.focus();

									webix.alert({
										title	: "Error",
										text	: e.toString(),
										type	: "alert-error"
									});
								})
								.then(() => {
									component.hideProgress();
									component.enable();
									component.focus();

									webix.alert({
										title	: "Success",
										text	: "Your profile updated successfully",
									});
								});
						}
						else {
							this.$$("form").focus();
						}
					}
				}
			]
		};

		return {
			view:"scrollview", scroll:"xy", responsive: true, body:{
				type:"wide",
				rows:[
					{ template:"Profile information", type:"header", css:"text_center" },
					{
						view	: "form",
						localId	: "form",
						cols	: [
							{gravity: 1, template: ""},
							{
								minWidth: 250,
								maxWidth: 500,
								gravity	: 2,
								rows	:[
									upper_section,
									{height: 20},
									buttons
								],
							},
							{gravity: 1, template: ""},
						],
						rules:{
							"fname"	: webix.rules.isNotEmpty,
							"uname"	: webix.rules.isNotEmpty,
							"email"	: webix.rules.isNotEmpty,
							"password"	: webix.rules.isNotEmpty
						}
					}
				]
			}
		};
	}
	init(){
		const authService 	= this.app.getService("auth");
		const detail		= authService.getUser();

		webix.extend(this.$$("form"), webix.ProgressBar);

		/*this.$$("form").setValues({
			uname	: detail.username,
			fname	: detail.name,
			email 	: detail.email,
			phone	: detail.phone,
			password: detail.password
		});*/
	}
}
