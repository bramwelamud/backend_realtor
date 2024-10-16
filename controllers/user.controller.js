'use strict';

const Users = require('../models/user.model');
const moment = require("moment");
const APPURL_FRONTEND = process.env.APP_URL_FRONTEND;
// const appUtils = require('../helper/app.utils');

exports.findByEmail = function (req, res) {
	const name = req.body.user_email
	const pass = req.body.user_password;

	Users.findByEmail(name, pass, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + name);
		return res.send(items);
	});
};

exports.doLoginToken = function (req, res) {
	const email = req.body.user_email
	const password = req.body.user_password;
	Users.geLoginEmail(email, password, 1, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + email);
		return res.json(items);
	});
};

exports.doSignInUserLogin = function (req, res) {
	const email = req.body.user_email
	const password = req.body.user_password;
	Users.getSignINEmail(email, password, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + email);
		return res.json(items);
	});
};

exports.doResetPasswordUserLogin = function (req, res) {
	const email = req.body.user_email;
	if (typeof email == "undefined") {
		return res.status(500).send('Error: user_email is not set in request body.');
	}
	Users.resetPasswordUserLogin(email, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ' + email);
		return res.json(items);
	});
};
exports.doFixUserPassword = function (req, res) {

	Users.setFixUserPasswords(function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		console.log(items);
		return res.json(items);
	});
};

exports.editUserLogindID = function (req, res) {
	const userId = req.params.id;
	Users.editUserLogin(userId, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		console.log(items);
		return res.json(items);
	});
};

exports.updateUserLogindID = function (req, res) {
	const userId = req.params.id;
	const userData = req.body;
	Users.updateUserLogin(userId, userData, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		console.log(items);
		return res.json(items);
	});
};
exports.updatePasswordUserLogindID = function (req, res) {
	const userId = req.body.user_login_id;
	const userData = req.body;
	Users.updatePasswordUserLogin(userId, userData, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		console.log(items);
		return res.json(items);
	});
};
exports.createUserLogindID = function (req, res) {
	const userData = req.body;
	Users.createUserLogin(userData, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		// console.log(items);
		return res.json(items);
	});
};

exports.registerLoginLandlord = function (req, res) {
	const userData = req.body;
	Users.registerLandlord(userData, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		// console.log(items);
		return res.json(items);
	});
};

exports.registerTenant = function (req, res) {
	const userData = req.body;
	Users.registerNewTenant(userData, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		// console.log(items);
		return res.json(items);
	});
};

exports.registerCompanyLandlord = function (req, res) {
	const userData = req.body;
	var ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
	ipAddress = ipAddress.split(':')[3];

	Users.createCompanyLandlord(userData, ipAddress, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		return res.json(items);
	});
};

exports.getLoginLandlord = function (req, res) {
	const userData = req.params.id;
	Users.getLandLordUser(userData, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		// console.log(items);
		return res.json(items);
	});
};

exports.updateEmailConfirmLoginLandlord = function (req, res) {
	const userData = req.params.id;
	Users.updateEmailConfirmLandLordUser(userData, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		return res.redirect(APPURL_FRONTEND + "/account/login");

		//return res.json(items);
	});
};
exports.doSendApplication=function(req,res){
	const userData=req.body;
Users.createNewTenantInformations(userData, function(err, items)
{
	if (err) return res.status(500).send('Error is here'+err);
	return res.json(items);
});


};

exports.doLoginLogout = function (req, res) {
	// const email = req.body.user_email
	// const password = req.body.user_password;
	// const token = await auth.attempt(email, password);
	// Users.geLoginEmail(email,password, function(err, items) {
	// 	if (err) return res.status(500).send('Error occured during fetching item for name ' + email);
	return res.json({ status: 'ok', data: 'sdasd' });
	// return res.json({status: 'success',data: token});
	// return res.send(items);
	// return res.send(items);
	// });
};

// exports.geteAllUsersDT = function(req, res) {
// 	let getDataTablesOptions = appUtils.getModelDataTablesOptions(req,'id',['user_first_name']);
// 	Users.getAllUsersDT(getDataTablesOptions, function(err, items) {
// 		if (err){
// 			console.log("Error id value:", getDataTablesOptions,"  --> Error:", err);
// 		}else{
// 			return res.json(items); //res.send(items);
// 		}
// 	});
// };


exports.editUserLogindID = function (req, res) {
	const userId = req.params.id;
	Users.editUserLogin(userId, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching item for name ');
		console.log(items);
		return res.json(items);
	});
};
exports.getInvitationCode = function (req, res) {
	const user_id = req.params.id;
	Users.getUserInvitationCode(user_id, function (err, items) {
		if (err) return res.status(500).send('Error occured during fetching user invitation code ');
		if (items.invitation_code == "" || items.invitation_code == null) {
			Users.generateInvitationCode(user_id, function (err, items2) {
				if (err) return res.status(500).send('Error occured during fetching user invitation code ');
				if(items2.status=="error"){
					return res.status(500).send('user is not found.');
				}
				return res.json({ status: 'success', user: items2 }); //res.send(items);

			});
		} else {
			return res.json({ status: 'success', user: items }); //res.send(items);

		}
	});
};

exports.getUserLoginMe = function (auth, res) {
	Users.getUserLoginDT(auth.user, auth.tokenUID, function (err, items) {
		return res.json({ status: 'success', user: items }); //res.send(items);
	});
};
exports.doDTablesUsers = function (req, res) {
	const user_type = req.body.user_type;
	const user_part_of = req.body.user_part_of;
	let user_landlord = 0;
	if (req.body.user_landlord !== undefined) {
		user_landlord = req.body.user_landlord;
	};
	const optPage = req.body.opt_page;
	const optLimit = req.body.opt_limit;
	const sortBy = req.body.opt_sortby;
	const sortOrder = req.body.opt_sort_order;
	const filter = req.body.opt_filter;
	const filterFields = req.body.opt_filter_fields;

	Users.dataTableUsers(user_type, user_part_of, user_landlord, optPage, optLimit, sortBy, sortOrder, filter, filterFields, function (err, items) {
		if (err) {
			return res.status(500).send('Error occured during fetching item for unique_id ');
		} else {
			return res.send(items);
		}
	});
};