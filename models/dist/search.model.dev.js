"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('sequelize'),
    DataTypes = _require.DataTypes;

var sequelize = require('../config/db.connect');

var User = require('../models/user.model');

var Property = require('../models/properties.model');

var Search = sequelize.define('Search', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  minPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0 // Minimum price cannot be negative

    }
  },
  maxPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isGreaterThanMinPrice: function isGreaterThanMinPrice(value) {
        if (this.minPrice && value < this.minPrice) {
          throw new Error('Max price must be greater than min price');
        }
      }
    }
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  propertyType: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
}); // Set up associations

User.hasMany(Search, {
  foreignKey: 'userId'
});
Search.belongsTo(User, {
  foreignKey: 'userId'
}); // Example of a method to find searches within a price range

Search.getByPriceRange = function _callee(minPrice, maxPrice) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Search.findAll({
            where: {
              minPrice: _defineProperty({}, sequelize.Op.gte, minPrice),
              maxPrice: _defineProperty({}, sequelize.Op.lte, maxPrice)
            }
          }));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}; // Optional: Indexes for optimized querying


Search.addIndex('userId'); // Optimize searches by user

module.exports = Search;