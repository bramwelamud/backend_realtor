"use strict";

// models/match.model.js
var _require = require('sequelize'),
    DataTypes = _require.DataTypes;

var sequelize = require('../config/db.connect');

var User = require('../models/user.model'); // Import User model


var Property = require('../models/properties.model'); // Import Property model


var Match = sequelize.define('Match', {
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
  propertyId: {
    type: DataTypes.INTEGER,
    references: {
      model: Property,
      key: 'id'
    },
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'notified', 'favorited'),
    defaultValue: 'new'
  }
}, {
  timestamps: true
}); // Set up associations

User.hasMany(Match, {
  foreignKey: 'userId'
});
Match.belongsTo(User, {
  foreignKey: 'userId'
});
Property.hasMany(Match, {
  foreignKey: 'propertyId'
});
Match.belongsTo(Property, {
  foreignKey: 'propertyId'
});
module.exports = Match;