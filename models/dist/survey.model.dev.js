"use strict";

// models/Survey.js
var _require = require('sequelize'),
    DataTypes = _require.DataTypes;

var sequelize = require('../config/db.connect'); // Adjust the path as necessary


var Survey = sequelize.define('Survey', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      // Make sure this matches your User model name
      key: 'id'
    },
    allowNull: false
  },
  preferences: {
    type: DataTypes.JSON,
    // Use JSON instead of JSONB
    allowNull: false
  }
}, {
  timestamps: true
});
module.exports = Survey;