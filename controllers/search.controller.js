// controllers/SearchController.js
const { Search } = require('../models/search.model');
const { Property } = require('../models/properties.model');
const { Op } = require('sequelize');

// Create a new search
const createSearch = async (req, res) => {
    const { userId, location, minPrice, maxPrice, bedrooms, bathrooms, propertyType } = req.body;

    try {
        const newSearch = await Search.create({
            userId,
            location,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            propertyType
        });

        res.status(201).json(newSearch);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all searches for a user
const getUserSearches = async (req, res) => {
    const { userId } = req.params;

    try {
        const searches = await Search.findAll({ where: { userId } });
        res.json(searches);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Perform a search based on the criteria
const performSearch = async (req, res) => {
    const { location, minPrice, maxPrice, bedrooms, bathrooms, propertyType } = req.query;

    const whereClause = {
        location: {
            [Op.like]: `%${location}%` // Example: fuzzy search for location
        },
        price: {
            [Op.and]: [
                { [Op.gte]: minPrice || 0 }, // Minimum price
                { [Op.lte]: maxPrice || Infinity } // Maximum price
            ]
        },
        bedrooms: {
            [Op.gte]: bedrooms || 0
        },
        bathrooms: {
            [Op.gte]: bathrooms || 0
        },
        propertyType: propertyType || { [Op.ne]: null } // Not null if provided
    };

    try {
        // First, attempt to find properties based on the criteria
        let properties = await Property.findAll({ where: whereClause });

        // If no properties found, recommend properties within 5 miles
        if (properties.length === 0) {
            const recommendedProperties = await findNearbyProperties(location, 5);
            return res.json({
                message: 'No properties found for the specified criteria. Here are some recommendations within 5 miles.',
                properties: recommendedProperties,
            });
        }

        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Function to find nearby properties within a specified distance (miles)
const findNearbyProperties = async (location, distance) => {
    // Assuming you have a method to convert location to coordinates (latitude, longitude)
    const { latitude, longitude } = await getCoordinatesFromLocation(location);
    
    // A basic implementation using Sequelize to filter properties based on distance
    return await Property.findAll({
        where: sequelize.where(
            sequelize.fn('ST_Distance_Sphere', 
                sequelize.fn('ST_MakePoint', sequelize.col('longitude'), sequelize.col('latitude')), 
                sequelize.fn('ST_MakePoint', longitude, latitude)
            ),
            { [Op.lt]: distance * 1609.34 } // Convert miles to meters
        )
    });
};

// Function to convert location to coordinates
const getCoordinatesFromLocation = async (location) => {
    // Placeholder: Implement a geocoding service (e.g., Google Maps API) to get coordinates
    // This example assumes you have a way to get latitude and longitude based on the location name
    return { latitude: 0, longitude: 0 }; // Replace with actual coordinates
};

// Export controller methods
module.exports = {
    createSearch,
    getUserSearches,
    performSearch
};
