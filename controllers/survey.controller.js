// controllers/SurveyController.js
const { Survey } = require('../models/survey.model'); // Adjust the path as necessary
const { Match } = require('../models/match.model'); // Ensure correct path
const Property = require('../models/properties.model'); // Ensure correct path
const axios = require('axios');
const { Op } = require('sequelize');

const submitSurvey = async (req, res) => {
    try {
        const { userId, preferences } = req.body; // Get userId and preferences from the request

        // Step 1: Store the survey response
        const survey = await Survey.create({ userId, preferences });

        // Step 2: Match properties based on preferences
        const matchedProperties = await matchProperties(preferences);

        // Step 3: Create matches for each matched property
        const matches = await Promise.all(
            matchedProperties.map(async (propertyId) => {
                return await Match.create({ userId, propertyId, status: 'new' });
            })
        );

        // Step 4: Send matched properties to the client via webhook
        await sendToWebhook(userId, matches);

        res.status(201).json({ message: 'Survey submitted and matches created', matches });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while submitting the survey' });
    }
};

// Function to match properties based on preferences
const matchProperties = async (preferences) => {
    const { location, priceRange } = preferences;

    const matchedProperties = await Property.findAll({
        where: {
            location: {
                [Op.like]: `%${location}%`, // Example: fuzzy search for location
            },
            price: {
                [Op.between]: priceRange,
            },
        },
    });

    // If no properties found, return nearby properties
    if (matchedProperties.length === 0) {
        return await findNearbyProperties(location);
    }

    return matchedProperties.map(property => property.id);
};

// Function to find nearby properties (dummy implementation)
const findNearbyProperties = async (location) => {
    // Logic to find properties within 5 miles of the given location
    // For now, returning an empty array as a placeholder
    return [];
};

// Function to send matches to a webhook
const sendToWebhook = async (userId, matches) => {
    const webhookUrl = 'https://your-webhook-url.com'; // Replace with your actual webhook URL
    const payload = {
        userId,
        matches,
    };

    await axios.post(webhookUrl, payload);
};

module.exports = { submitSurvey };
