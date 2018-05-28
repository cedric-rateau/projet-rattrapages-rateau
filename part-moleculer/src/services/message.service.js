"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "message",
	settings: {
 		state: {
 		}
	},
	actions: {
		//	call "message.create" --message "Messages" --firstname "First Name"
		create: {
			params: {
				message: "string",
				firstname: "string"
			},
			handler(ctx) {
				var mess = new Models.Message(ctx.params).create();
				console.log("création message", mess);
				if (mess) {
					return Database()
						.then((db) => {
							var allMess = db.get("message");
							if(allMess.find({ "message": mess.message }).value()) {
								throw new MoleculerError("message", 409, "ERR_CRITICAL", { code: 409, message: "CE MESSAGE EXISTE DEJA"} )
							}
							return allMess
								.push(mess)
								.write()
								.then(() => {
									return mess;
								})
								.catch(() => {
									throw new MoleculerError("message", 500, "ERR_CRITICAL", { code: 500, message: "ERREUR FATALE" } )
								});
					});
				} else {
					throw new MoleculerError("message", 417, "ERR_CRITICAL", { code: 417, message: "CE MESSAGE N'EST PAS VALIDE" } )
				}
			}
		},
		//	call "message.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("message").value();
					});
			}
		},
		//	call "message.get" --id_message "ID Messages"
		get: {
			params: {
				id_message: "string"
			},
			handler(ctx) {
				return ctx.call("vérification message", { id_message: ctx.params.id_message })
				.then((exists) => {
					console.log("exists - create - ", exists);
					if (exists) {
						return Database()
							.then((db) => {
								var mess = db.get("message").find({ id: ctx.params.id_message }).value();
								return mess;
							})
							.catch(() => {
								throw new MoleculerError("message", 500, "ERR_CRITICAL", { code: 500, message: "ERREUR FATAEL" } )
							});
					} else {
						throw new MoleculerError("message", 404, "ERR_CRITICAL", { code: 404, message: "CE MESSAGE N'EXISTE PAS" } )
					}
				})
			}
		},
		//	call "message.verify" --id_message "ID Messages"
		verify: {
			params: {
				id_message: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("message")
										.filter({ id: ctx.params.id_message })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},
		//	call "message.edit" --id_message "ID Messages" --firstname "First Name"
		edit: {
			params: {
				id_message: "string",
				firstname: "string",
				message: "string"
			},
			handler(ctx) {
				return ctx.call("obtenir message", { id_message: ctx.params.id_message })
						.then((db_message) => {
							return Database()
								.then((db) => {
									var allMess = db.get("message");
									if(!allMess.find( { id: ctx.params.id_message }).value()){
										throw new MoleculerError("message", 404, "ERR_CRITICAL", { code: 404, message: "CE MESSAGE N'EXISTE PAS" } );
									}
									var mess = new Models.Message(db_message).create();
									mess.message = ctx.params.message || db_message.message;
									mess.firstname = ctx.params.firstname || db_message.firstname;
									return allMess
										.find({ id: ctx.params.id_message })
										.assign(mess)
										.write()
										.then(() => {
											return mess.message;
										})
										.catch(() => {
											throw new MoleculerError("message", 500, "ERR_CRITICAL", { code: 500, message: "ERREUR FATALE" } )
										});
								})
						})
			}
		}
	}
};