'use strict';
// const con = require('../config/database/db.conn');
const pool = require('../config/db.connect');   
const appEmail = require('../helpers/app.email');
const AppHelper = require('../helpers/app.helper');
const service = require('../helpers/app.services');
const moment = require("moment");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const dotenv = require('dotenv').config();
const APPURL_EMAIL = process.env.APP_URL_FRONTEND;
const API_URL = process.env.API_URL_BACKEND;


const Users = function (user) {
	this.user_login_id = user.user_login_id;
	this.user_login_username = user.user_login_username;
	this.user_firstname = user.user_firstname;
	this.user_lastname = user.user_lastname;
	//   this.user_login_password = user.user_login_password;
	this.user_login_status = user.user_login_status;
	//   bcrypt.hash(user.user_login_password, salt, function(err, hash) {
	// 	this.user_login_password = hash;
	//   })
};

const CreateUsersModel = function (user) {
	//   this.user_login_id = user.user_login_id;
	this.user_login_username = user.user_login_username;
	this.user_link_id = AppHelper.app_make_id(6);
	this.user_firstname = user.user_firstname;
	this.user_lastname = user.user_lastname;
	this.user_type = user.user_type;
	this.user_part_of = user.user_part_of;
	this.user_login_password = user.user_login_password;
	this.user_login_created_date = moment().format('YYYY-MM-DD HH:mm:ss').toString();
	this.user_login_modified_date = moment().format('YYYY-MM-DD HH:mm:ss').toString();
	this.user_created = user.user_created;
	this.user_login_status = user.user_login_status;
};

const registerTenantModel = function (user) {
	this.user_login_username = user.user_email;
	this.user_link_id = AppHelper.app_make_id(6);
	this.user_firstname = user.user_firstname;
	this.user_lastname = user.user_lastname;
	this.user_phone_number = user.user_phone_number;
	this.user_type = "user";
	this.user_part_of = "tenant";
	this.user_login_password = user.user_login_password;
	this.user_login_created_date = moment().format('YYYY-MM-DD HH:mm:ss').toString();
	this.user_login_modified_date = moment().format('YYYY-MM-DD HH:mm:ss').toString();
	this.user_created = 0;
	this.user_login_status = "disabled";
};


const registerLandlordCompanyModel = function (user) {
	this.company_name = user.company_name;
	this.company_address = user.company_address;
	this.company_city = user.company_city;
	this.company_state = user.company_state;
	this.company_country = user.company_country;
	this.company_mail_address = user.company_mail_address;
	this.company_phone = user.company_phone;
	this.company_email = user.company_email;
	this.company_contact = user.company_contact;
	this.company_landlord_id = user.company_landlord_id;
	this.company_website = user.company_website
	this.company_whatapp = user.company_whatapp
	this.company_fax = user.company_fax
	this.company_contact_name = user.company_contact_name
	this.company_contact_lastname = user.company_contact_lastname
	this.company_contact_phone = user.company_contact_phone
	this.company_contact_cellphone = user.company_contact_cellphone
	this.company_contact_whatapp = user.company_contact_whatapp
	this.company_contact_email = user.company_contact_email
	this.company_registration_type = user.company_registration_type
	this.company_number_search = user.company_number_search
	this.company_contact_middlename = user.company_contact_middlename
	this.company_registeration_no = AppHelper.app_make_id(6);
	this.user_created = 0;
	if (user.user_created != undefined) {
		this.user_created = user.user_created;
	}
	this.ip_address = '';
};

const registerLogsLandlordCompanyModel = function (company_id, logName, user_created) {
	this.company_id = company_id;
	this.log_name = logName;
	this.user_created = user_created;
};

const UpdatePasswordUsersModel = function (user) {
	this.user_login_password = user.user_new_password;
	this.user_login_modified_date = moment().format('YYYY-MM-DD HH:mm:ss').toString();
	this.user_updated = user.user_updated;
};

const UpdateUsersModel = function (user) {
	this.user_firstname = user.user_firstname;
	this.user_lastname = user.user_lastname;
	this.user_login_status = user.user_login_status;
	this.verified_email = user.verified_email;
	this.verified = user.verified;
	this.user_updated = user.user_updated;
	this.user_login_modified_date = moment().format('YYYY-MM-DD HH:mm:ss').toString();
};

let queryGetUserLogin = function (user_email, user_password, checkTenant = 1) {
	return new Promise(function (resolve, reject) {
		let setSubQuery = ''; if (checkTenant == 0) { setSubQuery = `,(SELECT status_verified FROM rental_application WHERE rental_application.tenant_id=user_login.user_login_id)AS hasRentalApp `; }
		let sqlStement = `SELECT *${setSubQuery} FROM user_login WHERE user_login_username ='${user_email}'`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err -->', err);
			} else {
				if (rows.length > 0) {
					resStat = { status: 'ok', token: service.createToken(user_email), data: rows[0] }; //rows[0].id+'_'+
					bcrypt.compare(user_password, rows[0].user_login_password, function (err, result) {
						if (result == false) {
							resStat = { status: 'error', message: 'Your password is incorrect!', data: null };
						} else {
							if (rows[0].user_login_status == 'disabled') {
								resStat = { status: 'error', message: 'Your account has suspended!', data: null };
							} else if (rows[0].verified_email == 0) {
								resStat = { status: 'error', message: 'Please confirm your email address!', data: null };
							} else {
								if (checkTenant == 1 && rows[0].user_part_of == 'tenant') {
									resStat = { status: 'error', message: 'Authentication Error!', data: null };
								}
							}
						}
						resolve(resStat);
					});
				} else {
					resStat = { status: 'error', message: 'This account does not exist!', data: null };
					resolve(resStat);
				}
			}
		});
	});
}

const getUserProfileId = function (rsUser) {
	if (rsUser.user_type == 'user') {
		// if(rsUser.user_part_of =='landlord'){
		return rsUser.user_part_of
		// }
	} else {
		return 'admin';
	}
}

let queryGetUserLoginDT = function (user_email) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `SELECT * FROM user_login WHERE user_login_username ='${user_email}'`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				if (rows.length > 0) {
					rows[0].user_profile = getUserProfileId(rows[0]);
					resolve(rows[0]);
				} else {
					resolve([]);
				}
			}
		});
	});
}


let getInvitationCode = function (user_id) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `SELECT invitation_code FROM user_login WHERE user_login_id ='${user_id}'`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				if (rows.length > 0) {
					rows[0].user_profile = getUserProfileId(rows[0]);
					resolve(rows[0]);
				} else {
					resolve([]);
				}
			}
		});
	});
}

let queryGenerateInvitationCode = function (user_id) {
	return new Promise(function (resolve, reject) {
		const code = Math.floor(10000000 + Math.random() * 900000000);

		let sqlStement = `update user_login set invitation_code='${code}' WHERE user_login_id=${user_id}`;
		//console.log (sqlStement);
		pool.query(sqlStement, function (err, rows) {
			let resStat = {  };
			if (err) {
				console.log('err', err);
				resStat.status = 'error';
				resStat.message = err;
			}else if(rows.affectedRows == 0){
				resStat.status = 'error';
				resStat.message = "User not found.";
			} else {
				resStat = { invitation_code:""+code };
			}
			resolve(resStat);

		});
	});
}


let queryCheckUserLoginDT = function (user_email) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `SELECT * FROM user_login WHERE user_login_username ='${user_email}'`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null, message: 'This email is exists.' };
			if (err) {
				console.log('err', err);
			} else {
				if (rows.length > 0) { resStat.status = 'found'; } else { resStat.status = 'ok'; }
				resolve(resStat);
			}
		});
	});
}

let queryGetUserLoginID = function (user_login_id) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `SELECT * FROM user_login WHERE user_login_id =${user_login_id}`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				resStat = { status: 'ok', data: rows[0] };
				resolve(resStat);
			}
		});
	});
}

let queryGetUserAll = function () {
	return new Promise(function (resolve, reject) {
		let sqlStement = `SELECT * FROM user_login ORDER BY user_login_username`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				resolve(rows);
			}
		});
	});
}

let queryGetLandLordLogin = function (userLinkId) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `SELECT * FROM user_login WHERE user_link_id ='${userLinkId}'`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				if (rows.length > 0) { resStat.status = 'ok'; resStat.data = rows[0]; } else { resStat.status = 'empty'; }
				resolve(resStat);
			}
		});
	});
}


let queryUpdateEmailConfirmLandLordLogin = function (userLinkId) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `UPDATE user_login SET verified_email=1,user_login_status='enabled' WHERE user_link_id ='${userLinkId}';SELECT * FROM user_login WHERE user_link_id ='${userLinkId}'`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				console.log('err', rows);
				if (rows.length > 0) { resStat.status = 'ok'; resStat.data = rows[1][0]; } else { resStat.status = 'empty'; }
				resolve(resStat);
			}
		});
	});
}


let queryCreateUserLogin = function (insertNewRecord) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `INSERT INTO user_login SET ?`;
		pool.query(sqlStement, insertNewRecord, function (err, rows) {
			let resStat = { status: 'ok', data: null };
			if (err) {
				console.log('err', err);
				resStat.status = 'error';
				resStat.message = err;
			} else {
				resStat = { status: 'ok', data: rows };
				resolve(resStat);
			}
		});
	});
}


let queryCreateLandlordCompany = function (insertNewRecord) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `INSERT INTO company SET ?`;
		pool.query(sqlStement, insertNewRecord, function (err, rows) {
			let resStat = { status: 'ok', data: null };
			if (err) {
				resStat.status = 'error';
				resStat.message = err;
			} else {
				resStat = { status: 'ok', data: rows };
			}
			resolve(resStat);
		});
	});
}


let queryCreateLogLandlordCompany = function (insertNewRecord) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `INSERT INTO company_logs SET ?`;
		pool.query(sqlStement, insertNewRecord, function (err, rows) {
			let resStat = { status: 'ok', data: null };
			if (err) {
				resStat.status = 'error';
				resStat.message = err;
			} else {
				resStat = { status: 'ok', data: rows };
				resolve(resStat);
			}
		});
	});
}


let queryUpdateUserLogin = function (recordIDs, objUpdateRecord) {
	return new Promise(function (resolve, reject) {
		let sqlStement = `UPDATE user_login SET ? WHERE user_login_id=${recordIDs}`;
		pool.query(sqlStement, objUpdateRecord, function (err, rows) {
			if (err) {
				resolve({ status: "error", message: err });
			} else {
				resolve({ status: "ok", data: rows });
			}
		});
	});
}


let queryGetUsersDataTable = function (user_type, user_part_of, user_landlord, optPage, optLimit, sortBy, sortOrder, filterText, filterFields) {

	return new Promise(function (resolve, reject) {
		let filterDate = moment().format('YYYY-MM').toString() + '-01 00:00:00';
		let queryJoin = '';
		let sortDesc = 'ASC'; if (sortOrder == true) { sortDesc = 'DESC'; }
		// let tColumns=parOptions['columns'];
		let startLimit = 0; if (optPage > 1) { startLimit = (optPage - 1) * optLimit; }
		let sQueryFilter = ''; sQueryFilter = ` WHERE user_type='${user_type}' AND user_landlord=${user_landlord} AND user_part_of='${user_part_of}' `; queryJoin = 'AND ';
		if (filterText !== null && typeof filterText != "undefined") {
			if (filterText.length > 0) {
				if (typeof filterText == 'number') {
					sQueryFilter += ` user_login_id=${filterText}`;
				} else {
					sQueryFilter += ` user_login_username LIKE '%${filterText}%' `;
				}
			}
		}
		if (filterFields) {

			if (filterFields.user_login_status != '') {
				sQueryFilter += ` ${queryJoin} user_login_status='${filterFields.user_login_status}'`;
			}
			// if(filterFields.user_type !=''){
			// 	sQueryFilter +=` ${strWhere} ${queryJoin} user_type='${filterFields.user_type}' `; queryJoin='AND '; strWhere=''
			// }

		}
		let OrderBy = `${sortBy} ${sortDesc}`;
		// let subQueryCount = `,(SELECT COUNT(id) FROM agl_user_login WHERE  user_company LIKE '%${companyId}%')AS tRows`; 


		let sqlStement = `SELECT * FROM user_login ${sQueryFilter} ORDER BY ${OrderBy}  LIMIT ${startLimit},${optLimit}`;
		// console.log('sql -->',sqlStement);
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				resolve(rows);
			}
		});
	});
}


let queryQueueGetCounUsers = function (user_type, user_part_of, user_landlord, filterFields) {
	return new Promise(function (resolve, reject) {
		let sQueryFilter = ` WHERE user_type='${user_type}' AND user_landlord=${user_landlord} AND user_part_of='${user_part_of}' `, queryJoin = 'AND';
		if (filterFields) {
			if (filterFields.user_login_status != '') {
				sQueryFilter += ` ${queryJoin} user_login_status='${filterFields.user_login_status}'`;
			}

			// if(filterFields.user_type !=''){
			// 	sQueryFilter +=` ${strWhere} ${queryJoin} user_type='${filterFields.user_type}'`;
			// }
		}
		let sqlStement = `SELECT COUNT(user_login_id)AS countItems FROM user_login ${sQueryFilter}  ORDER BY user_login_status`;
		// let sqlStement = `SELECT COUNT(id)AS countItems,user_status FROM agl_user_login WHERE user_company LIKE '%${companyId}%'  GROUP BY user_status ORDER BY user_status`;
		pool.query(sqlStement, function (err, rows) {
			let resStat = { status: 'error', data: null };
			if (err) {
				console.log('err', err);
			} else {
				resolve(rows);
			}
		});
	});
}


Users.findByEmail = function (user_email, user_password, result) {
	queryGetUserLogin(user_email, user_password).then(function (uidOP) {
		if (uidOP.status == 'ok') { //queryQueueCompany
			result(null, uidOP);
		}
	});
};



Users.geLoginEmail = function (user_email, user_password, checkTenant, result) {
	queryGetUserLogin(user_email, user_password, checkTenant).then(function (uidOP) {
		if (uidOP.status == 'ok') { //queryQueueCompany
			result(null, { status: 'success', token: uidOP.token });
		} else {
			result(null, { status: uidOP.status, message: uidOP.message });
		}
	});
};


Users.getSignINEmail = function (user_email, user_password, result) {
	queryGetUserLogin(user_email, user_password, 0).then(function (uidOP) {
		if (uidOP.status == 'ok') { //queryQueueCompany
			result(null, uidOP);
		} else {
			result(null, uidOP);
		}
	});
};


Users.getUserInvitationCode = function (user_id, result) {
	getInvitationCode(user_id).then(function (uidOP) {
		result(null, uidOP);
	});
};

Users.getUserLoginDT = function (user_email, userTokenID, result) {
	queryGetUserLoginDT(user_email).then(function (uidOP) {
		result(null, uidOP);
	});
};

Users.createNewTenantInformations=function(userData,result) {
	queryCreateNewRentalApplications(userData).then(function (uid){
			if(uid.status== 'ok'){
				result(null,uid);
			}
	});
};
Users.resetPasswordUserLogin = function (user_email, result) {
	queryGetUserLoginDT(user_email).then(function (uidOP) {
		if (uidOP.user_login_username == user_email) {
			const UrlResetPassword = APPURL_EMAIL + '/account/recovery-pwd?q=' + uidOP.user_link_id;
			const emailBody = {
				email_to: user_email,
				email_subject: 'Password Change Request - Link Enclosed',
				email_body: AppHelper.app_template_user_password(uidOP, UrlResetPassword)
			};

			appEmail.doSendEmail(emailBody, function (err, email) {
				result(null, { status: 'ok', message: 'Your account has been updated' });
			});

		} else {
			result(null, { status: 'error', message: 'This account does not exist' });
		}

	});
};
const setUpdatePassword = function (thisRow) {
	this.user_login_password = thisRow.user_login_password;
}
Users.setFixUserPasswords = function (result) {
	let userGroupUpdated = [];
	queryGetUserAll().then(function (uidOP) {
		uidOP.forEach((thisUser, index, array) => {
			// const objUserUpdate = new setUpdatePassword(thisUser);
			// bcrypt.hash(thisUser.user_login_password, salt, function(err, hash) {
			//     objUserUpdate.user_login_password=hash;
			//     queryUpdateUserLogin(thisUser.user_login_id,objUserUpdate).then(function(uiUserUpdate){
			userGroupUpdated.push(thisUser);
			if (index == array.length - 1) {
				result(null, { status: 'ok', message: userGroupUpdated })
			}
			//     })
			// })
		});
		// result(null, uidOP);
	});
};

Users.createUserLogin = function (setNewRecord, result) {
	const userNewSchema = new CreateUsersModel(setNewRecord);
	queryCheckUserLoginDT(userNewSchema.user_login_username).then(function (uiCheckEmail) {
		if (uiCheckEmail.status == 'ok') {
			bcrypt.hash(userNewSchema.user_login_password, salt, function (err, hash) {
				userNewSchema.user_login_password = hash;
				queryCreateUserLogin(userNewSchema).then(function (uid) {
					const emailBody = {
						email_to: userNewSchema.user_login_username,
						email_subject: 'WA - Confirm Email',
						email_body: `<h1>Hello ${userNewSchema.user_firstname}</h1><p> Please confirm your email <a href="${API_URL}/api/bo/email-confirm/${userNewSchema.user_link_id}">click here</a>.</p>`
					};

					appEmail.doSendEmail(emailBody, function (err, email) {
						result(null, uid);
					});
					// result(null, uid);
				});
			})
		} else {
			result(null, uiCheckEmail);
		}
	})
};
// Fix usr
Users.createCompanyLandlord = function (setNewRecord, ipAddress, result) {
	const userNewSchema = new registerLandlordCompanyModel(setNewRecord);
	userNewSchema.ip_address = ipAddress;
	queryCreateLandlordCompany(userNewSchema).then(function (uid) {
		// console.log('debug',uid);
		const logCompanyNewSchema = new registerLogsLandlordCompanyModel(uid.data.insertId, 'Contract Agreement: Fill out the company form.', userNewSchema.user_created);
		// console.log('logCompanyNewSchema',logCompanyNewSchema);
		queryCreateLogLandlordCompany(logCompanyNewSchema).then(function (uidLog) {
			result(null, uid);
		});
	});

};


Users.generateInvitationCode = function (user_id, result) {
	queryGenerateInvitationCode(user_id).then(function (uid) {
			result(null, uid);
	});
};



Users.registerLandlord = function (setNewRecord, result) {
	const userNewSchema = new registerLandlordModel(setNewRecord);
	queryCheckUserLoginDT(userNewSchema.user_login_username).then(function (uiCheckEmail) {
		if (uiCheckEmail.status == 'ok') {
			bcrypt.hash(userNewSchema.user_login_password, salt, function (err, hash) {
				userNewSchema.user_login_password = hash;
				queryCreateUserLogin(userNewSchema).then(function (uid) {
					const emailBody = {
						email_to: userNewSchema.user_login_username,
						email_subject: 'WA - Confirm Email',
						email_body: `<h1>Hello ${userNewSchema.user_firstname}</h1><p> Please confirm your email <a href="${API_URL}/api/bo/email-confirm/${userNewSchema.user_link_id}">click here</a>.</p>`
					};

					appEmail.doSendEmail(emailBody, function (err, email) {
						result(null, uid);
					});
				});
			});
		} else {
			result(null, uiCheckEmail);
		}
	})
};
Users.registerNewTenant = function (setNewRecord, result) {
	const userNewSchema = new registerTenantModel(setNewRecord);
	queryCheckUserLoginDT(userNewSchema.user_login_username).then(function (uiCheckEmail) {
		if (uiCheckEmail.status == 'ok') {
			bcrypt.hash(userNewSchema.user_login_password, salt, function (err, hash) {
				userNewSchema.user_login_password = hash;
				queryCreateUserLogin(userNewSchema).then(function (uid) {
					const emailBody = {
						email_to: userNewSchema.user_login_username,
						email_subject: 'WA - Confirm Email',
						email_body: `<h1>Hello ${userNewSchema.user_firstname}</h1><p> Please confirm your email <a href="${API_URL}/api/bo/email-confirm/${userNewSchema.user_link_id}">click here</a>.</p>`
					};

					appEmail.doSendEmail(emailBody, function (err, email) {
						result(null, uid);
					});
				});
			});
		} else {
			result(null, uiCheckEmail);
		}
	})
};

Users.editUserLogin = function (setRSId, result) {
	queryGetUserLoginID(setRSId).then(function (uid) {
		result(null, uid);
	});
};
Users.updateUserLogin = function (setRSId, objUserSchema, result) {
	const userUpdateSchema = new UpdateUsersModel(objUserSchema);
	queryUpdateUserLogin(setRSId, userUpdateSchema).then(function (uid) {
		result(null, uid);
	});
};

Users.getLandLordUser = function (setRSId, result) {
	queryGetLandLordLogin(setRSId).then(function (uid) {
		result(null, uid);
	});
};

Users.updateEmailConfirmLandLordUser = function (setRSId, result) {
	queryUpdateEmailConfirmLandLordLogin(setRSId).then(function (uid) {
		const emailBody = {
			email_to: uid.data.user_login_username,
			email_subject: 'WA - Welcome',
			email_body: AppHelper.app_template_landlord_welcome(uid.data)
		};

		appEmail.doSendEmail(emailBody, function (err, email) {
			result(null, uid);
		});
		// result(null, uid);
	});
};

Users.updatePasswordUserLogin = function (setRSId, objUserSchema, result) {
	const userUpdateSchema = new UpdatePasswordUsersModel(objUserSchema);
	bcrypt.hash(userUpdateSchema.user_login_password, salt, function (err, hash) {
		userUpdateSchema.user_login_password = hash;
		queryUpdateUserLogin(setRSId, userUpdateSchema).then(function (uid) {
			result(null, uid);
		});
	})

};

Users.dataTableUsers = function (user_type, user_part_of, user_landlord, optPage, optLimit, sortBy, sortOrder, filterText, filterFields, result) {
	queryGetUsersDataTable(user_type, user_part_of, user_landlord, optPage, optLimit, sortBy, sortOrder, filterText, filterFields).then(function (uidItems) {
		queryQueueGetCounUsers(user_type, user_part_of, user_landlord, filterFields).then(function (uid) {
			result(null, { count: uid, items: uidItems });
		});
	});
}

module.exports = Users;

