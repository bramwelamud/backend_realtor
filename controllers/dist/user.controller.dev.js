"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('dotenv').config();

var User = require('../models/user.model');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var nodemailer = require('nodemailer');

var crypto = require('crypto');

var _require2 = require('sequelize'),
    Op = _require2.Op;

var JWT_SECRET = process.env.JWT_SECRET;
var JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
var EMAIL_USER = process.env.EMAIL_USER;
var EMAIL_PASS = process.env.EMAIL_PASS;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});
var ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  PASSWORD_MISMATCH: 'Passwords do not match'
};
/**
 * 
 * 
 * 
 * Utility function to send error responses.
 */

var sendErrorResponse = function sendErrorResponse(res, status, message) {
  return res.status(status).json({
    success: false,
    message: message
  });
};
/**
 * Register a new user.
 */


var isValidEmail = function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

function register(req, res) {
  var _req$body, name, email, password, role, membership_tier, phone_number, work_email, trimmedPhoneNumber, trimmedWorkEmail, trimmedRole, existingUser, hashedPassword, newUser;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, role = _req$body.role, membership_tier = _req$body.membership_tier, phone_number = _req$body.phone_number, work_email = _req$body.work_email; // Validate required fields

          if (!(!email || !password || !name)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", sendErrorResponse(res, 400, ERROR_MESSAGES.MISSING_FIELDS));

        case 4:
          // Validate email format
          trimmedPhoneNumber = phone_number ? phone_number.trim() : '';
          trimmedWorkEmail = work_email ? work_email.trim() : '';
          trimmedRole = role ? role.trim() : 'defaultRole'; // Check for existing user

          _context.next = 9;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email.trim()
            }
          }));

        case 9:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", sendErrorResponse(res, 400, 'Email is already registered.'));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 14:
          hashedPassword = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(User.create({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            role: trimmedRole,
            membership_tier: membership_tier,
            phone_number: trimmedPhoneNumber,
            work_email: trimmedWorkEmail
          }));

        case 17:
          newUser = _context.sent;
          res.status(201).json(newUser);
          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          console.error('Error in register function:', _context.t0);
          return _context.abrupt("return", sendErrorResponse(res, 500));

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
}

var login = function login(req, res) {
  var _req$body2, email, password, user, passwordMatch, _JWT_EXPIRATION, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          email = email ? email.trim() : '';
          password = password ? password.trim() : '';
          console.log('Login request received:', {
            email: email
          });

          if (!(!email || !password)) {
            _context2.next = 7;
            break;
          }

          console.log('Missing email or password in request body');
          return _context2.abrupt("return", res.status(400).json({
            message: 'Email and password are required'
          }));

        case 7:
          _context2.prev = 7;
          _context2.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 10:
          user = _context2.sent;

          if (user) {
            _context2.next = 16;
            break;
          }

          console.log("No user found with email: ".concat(email));
          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid credentials'
          }));

        case 16:
          console.log('User found:', user.dataValues);

        case 17:
          console.log('Trimmed password:', password);
          console.log('Stored password:', user.password);
          _context2.next = 21;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 21:
          passwordMatch = _context2.sent;

          if (passwordMatch) {
            _context2.next = 27;
            break;
          }

          console.log('Password does not match');
          return _context2.abrupt("return", res.status(400).json({
            message: 'Invalid credentials'
          }));

        case 27:
          console.log('Password match confirmed');
          console.log('user logged in');

        case 29:
          _JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
          token = jwt.sign({
            id: user.id
          }, JWT_SECRET, {
            expiresIn: _JWT_EXPIRATION
          });
          console.log('Token generated successfully:', token);
          return _context2.abrupt("return", res.json({
            success: true,
            token: token,
            user: user.dataValues,
            message: 'Login successful'
          }));

        case 35:
          _context2.prev = 35;
          _context2.t0 = _context2["catch"](7);
          console.error('Error in login function:', _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            message: 'Server error',
            error: _context2.t0
          }));

        case 39:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 35]]);
};
/**
 * Get user profile.
 */


var getProfile = function getProfile(req, res) {
  var user;
  return regeneratorRuntime.async(function getProfile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 3:
          user = _context3.sent;

          if (user) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", sendErrorResponse(res, 404, 'User not found'));

        case 6:
          return _context3.abrupt("return", res.json({
            success: true,
            user: user
          }));

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error('Error in getProfile function:', _context3.t0);
          return _context3.abrupt("return", sendErrorResponse(res, 500, 'Server error'));

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};
/**
 * Update user profile.
 */


var updateProfile = function updateProfile(req, res) {
  var _req$body3, name, phone_number, work_email, user;

  return regeneratorRuntime.async(function updateProfile$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, name = _req$body3.name, phone_number = _req$body3.phone_number, work_email = _req$body3.work_email;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 4:
          user = _context4.sent;

          if (user) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", sendErrorResponse(res, 404, 'User not found'));

        case 7:
          user.name = name || user.name;
          user.phone_number = phone_number || user.phone_number;
          user.work_email = work_email || user.work_email;
          _context4.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          return _context4.abrupt("return", res.json({
            success: true,
            user: user,
            message: 'Profile updated successfully'
          }));

        case 15:
          _context4.prev = 15;
          _context4.t0 = _context4["catch"](1);
          console.error('Error in updateProfile function:', _context4.t0);
          return _context4.abrupt("return", sendErrorResponse(res, 500, 'Server error'));

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 15]]);
};
/**
 * Delete user account.
 */


var deleteAccount = function deleteAccount(req, res) {
  var user;
  return regeneratorRuntime.async(function deleteAccount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 3:
          user = _context5.sent;

          if (user) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", sendErrorResponse(res, 404, 'User not found'));

        case 6:
          _context5.next = 8;
          return regeneratorRuntime.awrap(user.destroy());

        case 8:
          return _context5.abrupt("return", res.json({
            success: true,
            message: 'Account deleted successfully'
          }));

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.error('Error in deleteAccount function:', _context5.t0);
          return _context5.abrupt("return", sendErrorResponse(res, 500, 'Server error'));

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};
/**
 * Get all users.
 */


var getAllUsers = function getAllUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getAllUsers$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(User.findAll());

        case 3:
          users = _context6.sent;
          return _context6.abrupt("return", res.json({
            success: true,
            users: users
          }));

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          console.error('Error in getAllUsers function:', _context6.t0);
          return _context6.abrupt("return", sendErrorResponse(res, 500, 'Server error'));

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};
/**
 * Update user password.
 */


var updatePassword = function updatePassword(req, res) {
  var _req$body4, oldPassword, newPassword, user;

  return regeneratorRuntime.async(function updatePassword$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body4 = req.body, oldPassword = _req$body4.oldPassword, newPassword = _req$body4.newPassword;
          _context7.prev = 1;
          _context7.next = 4;
          return regeneratorRuntime.awrap(User.findByPk(req.user.id));

        case 4:
          user = _context7.sent;
          _context7.t0 = !user;

          if (_context7.t0) {
            _context7.next = 10;
            break;
          }

          _context7.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(oldPassword, user.password));

        case 9:
          _context7.t0 = !_context7.sent;

        case 10:
          if (!_context7.t0) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", sendErrorResponse(res, 400, 'Old password is incorrect'));

        case 12:
          _context7.next = 14;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 14:
          user.password = _context7.sent;
          _context7.next = 17;
          return regeneratorRuntime.awrap(user.save());

        case 17:
          return _context7.abrupt("return", res.json({
            success: true,
            message: 'Password updated successfully'
          }));

        case 20:
          _context7.prev = 20;
          _context7.t1 = _context7["catch"](1);
          console.error('Error in updatePassword function:', _context7.t1);
          return _context7.abrupt("return", sendErrorResponse(res, 500, 'Server error'));

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[1, 20]]);
};
/**
 * Forgot password: send reset link.
 */


var forgotPassword = function forgotPassword(req, res) {
  var email, user, resetToken, resetLink;
  return regeneratorRuntime.async(function forgotPassword$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          email = req.body.email;
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              email: email
            }
          }));

        case 4:
          user = _context8.sent;

          if (user) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", sendErrorResponse(res, 400, 'User not found'));

        case 7:
          resetToken = crypto.randomBytes(32).toString('hex');
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpires = Date.now() + 3600000;
          _context8.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          resetLink = "http://your-frontend-url/reset-password?token=".concat(resetToken);
          _context8.next = 15;
          return regeneratorRuntime.awrap(transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: "<p>Click <a href=\"".concat(resetLink, "\">here</a> to reset your password.</p>")
          }));

        case 15:
          return _context8.abrupt("return", res.json({
            success: true,
            message: 'Reset link sent to your email'
          }));

        case 18:
          _context8.prev = 18;
          _context8.t0 = _context8["catch"](1);
          console.error('Error in forgotPassword function:', _context8.t0);
          return _context8.abrupt("return", sendErrorResponse(res, 500, 'Server error'));

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 18]]);
};
/**
 * Reset password with token.
 */


var resetPassword = function resetPassword(req, res) {
  var _req$body5, token, newPassword, user;

  return regeneratorRuntime.async(function resetPassword$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body5 = req.body, token = _req$body5.token, newPassword = _req$body5.newPassword;
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            where: {
              resetPasswordToken: token,
              resetPasswordExpires: _defineProperty({}, Op.gt, Date.now())
            }
          }));

        case 4:
          user = _context9.sent;

          if (user) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", sendErrorResponse(res, 400, 'Invalid or expired token'));

        case 7:
          _context9.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 9:
          user.password = _context9.sent;
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;
          _context9.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          return _context9.abrupt("return", res.json({
            success: true,
            message: 'Password reset successfully'
          }));

        case 17:
          _context9.prev = 17;
          _context9.t0 = _context9["catch"](1);
          console.error('Error in resetPassword function:', _context9.t0);
          return _context9.abrupt("return", sendErrorResponse(res, 500, 'Server error'));

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 17]]);
};

module.exports = {
  register: register,
  login: login,
  getProfile: getProfile,
  updateProfile: updateProfile,
  deleteAccount: deleteAccount,
  getAllUsers: getAllUsers,
  updatePassword: updatePassword,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword
};