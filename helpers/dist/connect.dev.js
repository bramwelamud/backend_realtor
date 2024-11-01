"use strict";

// models/index.js or wherever you set up associations
var User = require('../models/user.model'); // Adjust path if necessary


var Survey = require('../models/survey.model');

User.hasMany(Survey, {
  foreignKey: 'userId',
  as: 'surveys'
});
Survey.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});