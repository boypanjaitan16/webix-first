export function auth(app, view, config) {

	const authModel   	= config.model;
	const login       	= config.login || "/login";
	const logout      	= config.logout || "/logout";
	const afterLogin  	= config.afterLogin || "/top/submit"; //app.config.start;
	const afterLogout 	= config.afterLogout || "/login";

	let credentials 	= null;

	const service = {

		getUser() {
			return credentials;
		},

		setUser(data){
			credentials	= data;
		},

		getStatus(server) {
			if (!server) {
				return credentials !== null;
			}
			return authModel.status()
				.catch(() => null)
				.then(data => {
					credentials = data;
				});
		},

		login(name, pass) {
			return authModel.login(name, pass)
				.catch(e => {
					throw (e);
				})
				.then((data) => {
					credentials = data;

					if (!data) {
						throw ("Login Failed");
					}
					app.show(afterLogin);
				});
		},

		logout() {
			credentials = null;
			authModel.logout();
			app.show(afterLogout);
		}
	};

	function canNavigate(url, obj) {

		if (url === logout) {
			service.logout();
			obj.redirect = afterLogout;
			app.show(afterLogout);
		} else if (url !== login && !service.getStatus()) {
			obj.redirect = login;
			app.show(login);
		}
	}

	app.setService("auth", service);

	/*app.attachEvent("app:guard", function (url, _$root, obj) {
		if (credentials === null) {
			obj.confirm = service.getStatus(true).then(any => {
				//window.console.log(any);
				//app.show(login);
				canNavigate(url, obj);
			});
		} else {
			//app.show(afterLogin);
			canNavigate(url, obj);
		}
	});*/

	/*if (ping) {
		setInterval(() => service.getStatus(true), ping);
	}*/

	canNavigate(app.$router.get(), {});
}
