"use strict";

// models/User.js
var _require = require('sequelize'),
    DataTypes = _require.DataTypes;

var sequelize = require('../config/db.connect'); // Ensure correct path to db.connect


var bcrypt = require('bcrypt'); // Import bcrypt for password hashing


var User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Email format validation

    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('applicant', 'realtor', 'landlord', 'user'),
    // Includes 'user' for default role
    allowNull: false,
    defaultValue: 'user' // Matches default role assignment in the controller

  },
  membership_tier: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold'),
    defaultValue: 'bronze' // Default value as specified

  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9\-()+]+$/i // Optional phone format validation

    }
  },
  work_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true // Email format validation

    }
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordTokenExpiration: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
}); // Hash the password before saving the user

User.beforeCreate(function _callee(user) {
  var saltRounds;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          saltRounds = 10;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.hash(user.password, saltRounds));

        case 3:
          user.password = _context.sent;

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Hash password before updating, only if it was changed

User.beforeUpdate(function _callee2(user) {
  var saltRounds;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!user.changed('password')) {
            _context2.next = 5;
            break;
          }

          saltRounds = 10;
          _context2.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(user.password, saltRounds));

        case 4:
          user.password = _context2.sent;

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // Instance method to compare password for login

User.prototype.comparePassword = function _callee3(candidatePassword) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", bcrypt.compare(candidatePassword, this.password));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  }, null, this);
}; // Export the User model


module.exports = User;