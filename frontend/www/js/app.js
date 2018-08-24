var db;
var token;

var app = {
	initialize: () => {
		document.addEventListener('deviceready', () => {
            db = openDatabase('user.db', '1.0', '', 2 * 1024 * 1024); //WebSQL
            //db = window.sqlitePlugin.openDatabase({name: 'user.db', location: 'default'}); //SQLite
        });
	},
	DBInitialize: () => {
		document.addEventListener('deviceready', () => {
			db.transaction((tx) => {
				tx.executeSql('DROP TABLE IF EXISTS token');
				tx.executeSql('CREATE TABLE IF NOT EXISTS token (email VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL)');
			}, (error) => {
				navigator.notification.alert('Ocorreu um erro!');
				console.log('Transaction ERROR: ' + error.message);
			}, () => {
				console.log('Success DataBase Loaded');
			});
		});
	},
	createToken: (obj ) => {
		document.addEventListener('deviceready', () => {
			db.transaction((tx) => {
				tx.executeSql('INSERT INTO token VALUES (?,?)', [obj.email, obj.password]);
			}, (error) => {
				navigator.notification.alert('Ocorreu um erro ao gerar token!');
				console.log('Transaction ERROR: ' + error.message);
			}, () => {
				window.location.href = "users.html";
			});
		});
	},
	getToken: () => {
		return new Promise( (resolve, reject) => {
			document.addEventListener('deviceready', () => {
				db.transaction((tx) => {
					tx.executeSql('SELECT email, password FROM token LIMIT 1', [], function(tx, res) {
						if(res.rows.item(0).email){
							token = {'email': res.rows.item(0).email, 'password': res.rows.item(0).password};
						}
					});
				}, (error) => {
					window.location.href = "index.html";
				}, () => {
					resolve(true);
				});
			});	
		});
	},
	login: (obj) => {
		let api = {url: 'http://localhost:8000/api/login', type: 'POST'};

		app.call(obj,api)
		.then(resolve => {
			app.createToken(obj);
		})
		.catch(reject => {
			navigator.notification.alert(reject);
		});
	},
	save: (obj) => {
		let api = {url: 'http://localhost:8000/api/save', type: 'POST'};

		app.call(obj,api)
		.then(resolve => {
			navigator.notification.alert(resolve.message);
			window.location.href = "create.html";
		})
		.catch(reject => {
			navigator.notification.alert(reject);
		});
	},
	get: (callback) => {
		let api = {url: 'http://localhost:8000/api/get', type:'GET'};

		app.getToken()
		.then(() => 
			app.call(token,api)
		)
		.then(resolve => {
			callback(resolve.users);
		})
		.catch(reject => {
			console.log('Ocorreu um erro ao listar os usuários!');
			navigator.notification.alert(reject);
		})
	},
	remove: (id) => {
		let obj = {'email': token.email, 'password': token.password, 'id': id};
		let api = {url: 'http://localhost:8000/api/remove', type:'DELETE'};

		app.call(obj,api)
		.then(resolve => {
			navigator.notification.alert(resolve.message);
			window.location.href = "users.html";
		})
		.catch(reject => {
			navigator.notification.alert(reject);
		});
	},
	call: (obj, api) => {
		return new Promise( (resolve, reject) => {
			$.ajax({
				url: api.url,
				type: api.type,
				dataType: 'json',
				data: obj,
				success: (data) => {
					if(data.success){
						resolve(data);
					}

					reject(data.message);
				},
				error: (xhr, textStatus, errorThrown) => {
					console.log(xhr, textStatus, errorThrown);
				}
			});
		})
	}
};
