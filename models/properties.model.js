// models/properties.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.connect');

const Property = sequelize.define('Property', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image_urls: {
        type: DataTypes.JSON, // Using JSON to store array of image URLs
        allowNull: true,
    },
    amenities: {
        type: DataTypes.JSON, // Assuming amenities could be an array or object
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    year_built: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    square_feet: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    lot_size: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    property_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: { // Foreign key to associate Property with User
        type: DataTypes.INTEGER,
        references: {
            model: 'Users', // Name of the table in the database
            key: 'id', // Key in the referenced table
        },
        onDelete: 'CASCADE', // Automatically delete properties when a user is deleted
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the Property model
module.exports = Property;
