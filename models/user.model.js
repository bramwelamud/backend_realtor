// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect'); // Ensure correct path to db.connect
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true, // Email format validation
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('applicant', 'realtor', 'landlord', 'user'), // Includes 'user' for default role
            allowNull: false,
            defaultValue: 'user', // Matches default role assignment in the controller
        },
        membership_tier: {
            type: DataTypes.ENUM('bronze', 'silver', 'gold'),
            defaultValue: 'bronze', // Default value as specified
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^[0-9\-()+]+$/i, // Optional phone format validation
            },
        },
        work_email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true, // Email format validation
            },
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordTokenExpiration: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving the user
User.beforeCreate(async (user) => {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
});

// Hash password before updating, only if it was changed
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
});

// Instance method to compare password for login
// User.prototype.comparePassword = async function (candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);
// };

// Export the User model
module.exports = User;
