// models/index.js or wherever you set up associations
const User = require('../models/user.model'); // Adjust path if necessary
const Survey = require('../models/survey.model');

User.hasMany(Survey, { foreignKey: 'userId', as: 'surveys' });
Survey.belongsTo(User, { foreignKey: 'userId', as: 'user' });
