import "./styles/app.css";
import {JetApp, EmptyRouter, UrlRouter } from "webix-jet";
import {auth} from "./helpers/auth";
import {authModel} from "./helpers/authModel";

webix.ready(() => {
	const app = new JetApp({
		id 		: APPNAME,
		version : VERSION,
		router 	: BUILD_AS_MODULE ? EmptyRouter : UrlRouter,
		debug 	: !PRODUCTION,
		start 	: "/login"
	});

	app.render();

	app.use(auth, {model: new authModel()});

	app.attachEvent("app:error:resolve", function(name, error){
		window.console.error(name,error.toString());
	});
});
