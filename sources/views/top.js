import {JetView} from "webix-jet";

export default class TopView extends JetView{
	config(){
		const authService 	= this.app.getService("auth");
		const detail		= authService.getUser();

		const toolbar = {
			view	: "toolbar",
			padding	: 9,
			height	: 58,
			css		: "webix_dark",
			cols:[
				{ template: "Hai, <b>"+detail.name+"</b>", css:"app_start no_border" },
				{
					view:"icon", icon:"mdi mdi-book-multiple", click: () => {
						this.app.show("/top/history");
					}
				},
				{
					view:"icon", icon:"mdi mdi-download", click: () => {
						this.app.show("/top/submit");
					}
				},
				/*{
					view:"icon", icon:"mdi mdi-bell", badge:"5",tooltip:"Notifications",
					click:() => {
						webix.alert({
							title: "Notifications",
							text: "Your notifications will goes here"
						}).then(function(result){
							this.app.show('/login');
						});
					}
				},*/
				{
					view:"icon", icon:"mdi mdi-settings", click: () => {
						this.app.show("/top/profile");
					}
				},
				{
					view:"icon", icon:"mdi mdi-logout", click: () => {
						const authService = this.app.getService("auth");

						webix.confirm({
							title: "Logout",
							text: "Are you sure to proceed ?",
							type:"confirm-error"
						})
							.then(function(){
								webix.message("Now logging out ...");

								authService.logout();
							})
							.fail(function(e){
								window.console.log(e);
							});
						//this.app.show("/top/profile");
					}
				}
			]
		};

		return {
			type:"clean", cols:[
				{ rows:
					[ toolbar, {$subview:true}, {
						height	: 60,
						css		: "app_start text_center",
						template: "Copyright 2020 &copy; <b>Boy Panjaitan</b>"
					}]
				},
			]
		};
	}
	init(){
		//this.use(plugins.Menu, "menu");
	}
}
