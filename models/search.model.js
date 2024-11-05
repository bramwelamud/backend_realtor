const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect');
const User = require('../models/user.model');

const Search = sequelize.define('Search', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    maxPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            isGreaterThanMinPrice(value) {
                if (this.minPrice && value < this.minPrice) {
                    throw new Error('Max price must be greater than min price');
                }
            },
        },
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    propertyType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['userId'],
        },
    ],
});

// Set up associations
User.hasMany(Search, { foreignKey: 'userId' });
Search.belongsTo(User, { foreignKey: 'userId' });

// Example of a method to find searches within a price range
Search.getByPriceRange = async function (minPrice, maxPrice) {
    return await Search.findAll({
        where: {
            minPrice: { [sequelize.Op.gte]: minPrice },
            maxPrice: { [sequelize.Op.lte]: maxPrice },
        },
    });
};

module.exports = Search;
