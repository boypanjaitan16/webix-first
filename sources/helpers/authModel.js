import * as Cookies from "js-cookie";
import {BASE_URL} from "../helpers/info";

export class authModel {

	status(){
		return new Promise(function(resolve) {
			resolve(this.credentials);
		});
	}

	getCurrentUser(){
		return this.getAccessToken();
	}

	getAccessToken(){
		if (this.credentials.access_token === undefined) {
			return null;
		}

		if ((this.credentials.expires_in + this.credentials.timestamp) < (Date.now() / 1000)) {
			return null;
		}

		return this.credentials.access_token;
	}

	setCurrentUser(userId){
		this.user = userId;
	}

	login(username, password) {

		return new Promise((resolve, reject) => {
			webix.ajax().post(BASE_URL+"/login", {
				username: username,
				password: password
			})
				.catch(function (e) {
					reject(e);

				})
				.then(function (data) {
					const result = data.json();

					if (result.status === "success") {
						Cookies.set("appCookie", result.data);

						resolve(result.data);

					} else {
						reject(result.message);
					}
				});
		});
	}

	logout(){
		//this.credentials = {};
		Cookies.remove("appCookie");
	}

	refresh(){
		// Use the refresh-token to get a new bearer-token
	}
}
