"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "utilisateur",
	settings: {
 		state: {
 		}
	},
	actions: {
		//	call "users.create" --email "e-mail" --lastname "Last Name" --firstname "First Name" --channel 0
		create: {
			params: {
				firstname: "string",
				lastname: "string",
				email: "string",
				channel: "number"
			},
			handler(ctx) {
				var user = new Models.User(ctx.params).create();
				console.log("création utilisateur", user);
				if (user) {
					return Database()
						.then((db) => {
							var allUsers = db.get("utilisateur");
							if(allUsers.find({ "email": user.email }).value()) {
								throw new MoleculerError("utilisateur", 409, "ERR_CRITICAL", { code: 409, message: "CE NOM EXISTE DEJA"} )
							}
							return allUsers
								.push(user)
								.write()
								.then(() => {
									return user;
								})
								.catch(() => {
									throw new MoleculerError("utilisateur", 500, "ERR_CRITICAL", { code: 500, message: "ERREUR FATALE" } )
								});
					});
				} else {
					throw new MoleculerError("utilisateur", 417, "ERR_CRITICAL", { code: 417, message: "CE NOM NE PEUT PAS ETRE VALIDE" } )
				}
			}
		},
		//	call "users.getAll"
		getAll: {

			params: {
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("utilisateur").value();
					});
			}
		},
		//	call "users.get" --email "e-mail"
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("verification utilisateur", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("utilisateur").find({ email: ctx.params.email }).value();
								return user;
							})
							.catch(() => {
								throw new MoleculerError("utilisateur", 500, "ERR_CRITICAL", { code: 500, message: "ERREUR FATAEL" } )
							});
					} else {
						throw new MoleculerError("utilisateur", 404, "ERR_CRITICAL", { code: 404, message: "CE NOM N'EXISTE PAS" } )
					}
				})
			}
		},
		//	call "users.verify" --email "e-mail"
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateur")
										.filter({ email: ctx.params.email })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
		//	call "users.edit" --email "e-mail" --lastname "Last Name" --firstname "First Name" --channel 0
		edit: {
			params: {
				email: "string",
				lastname: "string",
				firstname: "string"
			},
			handler(ctx) {
				return ctx.call("obtenir utilisateur", { email: ctx.params.email })
						.then((db_user) => {
							return Database()
								.then((db) => {
									var allUsers = db.get("utilisateur");
									if(!allUsers.find( { email: ctx.params.email }).value()){
										throw new MoleculerError("utilisateur", 404, "ERR_CRITICAL", { code: 404, message: "CE NOM N'EXISTE PAS" } );
									}
									var user = new Models.User(db_user).create();
									user.lastname = ctx.params.lastname || db_user.lastname;
									user.firstname = ctx.params.firstname || db_user.firstname;
									user.channel = ctx.params.channel || db_user.channel;
									return allUsers
										.find({ email: ctx.params.email })
										.assign(user)
										.write()
										.then(() => {
											return user.email;
										})
										.catch(() => {
											throw new MoleculerError("utilisateur", 500, "ERR_CRITICAL", { code: 500, message: "ERREUR FATALE" } )
										});
								})
						})
			}
		}
	}
};