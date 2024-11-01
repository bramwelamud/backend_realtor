"use strict";

var _require = require('sequelize'),
    Sequelize = _require.Sequelize;

var sequelize = new Sequelize('development_database', 'roo', '12345', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
  logging: function logging(msg) {
    return console.log(msg);
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

function testConnection() {
  return regeneratorRuntime.async(function testConnection$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(sequelize.authenticate());

        case 3:
          console.log('Connection to the database has been established successfully.');
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error('Unable to connect to the database:', _context.t0.message);
          console.error('Error stack:', _context.t0.stack);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
} // Call the function to test the connection


testConnection();
module.exports = sequelize;