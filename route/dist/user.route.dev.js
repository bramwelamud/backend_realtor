"use strict";

// routes/userRoutes.js
var express = require('express');

var _require = require('../controllers/user.controller'),
    register = _require.register,
    login = _require.login,
    getProfile = _require.getProfile,
    updateProfile = _require.updateProfile,
    deleteAccount = _require.deleteAccount,
    getAllUsers = _require.getAllUsers,
    updatePassword = _require.updatePassword,
    forgotPassword = _require.forgotPassword,
    resetPassword = _require.resetPassword;

var _require2 = require('express-validator'),
    check = _require2.check,
    validationResult = _require2.validationResult;

var authMiddleware = require('../middleware/auth'); // Middleware for protecting routes


var router = express.Router(); // Validation rules

var userValidationRules = [check('name').notEmpty().withMessage('Name is required'), check('email').isEmail().withMessage('Invalid email format'), check('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long')]; // Routes

router.post('/register', function (req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
}, register);
router.post('/login', userValidationRules, login);
router.get('/get_profile', authMiddleware, getProfile);
router.put('/update_profile', authMiddleware, updateProfile);
router["delete"]('/delete_account', deleteAccount);
router.get('get_users', authMiddleware, getAllUsers);
router.put('/update_password', authMiddleware, updatePassword);
router.post('/forgot-password', forgotPassword);
var passwordResetValidationRules = [check('token').notEmpty().withMessage('Token is required'), check('password').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long')];
router.post('/reset-password', passwordResetValidationRules, function (req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
}, resetPassword);
module.exports = router;