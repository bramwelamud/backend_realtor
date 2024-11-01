"use strict";

var bcrypt = require('bcryptjs'); // Make sure you have bcryptjs installed


function comparePassword(plainPassword, hashedPassword) {
  var passwordMatch;
  return regeneratorRuntime.async(function comparePassword$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(bcrypt.compare(plainPassword, hashedPassword));

        case 3:
          passwordMatch = _context.sent;

          if (!passwordMatch) {
            _context.next = 9;
            break;
          }

          console.log('Password matches!');
          return _context.abrupt("return", true);

        case 9:
          console.log('Password does not match');
          return _context.abrupt("return", false);

        case 11:
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Error comparing passwords:', _context.t0);
          throw _context.t0;

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
} // Example usage


(function _callee() {
  var plainPassword, hashedPassword, isMatch;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          plainPassword = '11111'; // The password you want to check

          hashedPassword = '$2b$10$F6z3K2.P46J8ZEu38I46SeZnRXSeNw3xn.hEAu7LTJSUZFVuEwc2e'; // Example hashed password from your database

          _context2.next = 4;
          return regeneratorRuntime.awrap(comparePassword(plainPassword, hashedPassword));

        case 4:
          isMatch = _context2.sent;
          console.log('Password match result:', isMatch);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
})();