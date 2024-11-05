// controllers/PropertyController.js

const Property = require('../models/properties.model');
const { Op } = require('sequelize');
const { doUploadPhotos, removeFiles } = require('../helpers/app.uploader');

// Create a new property
const createProperty = async (req, res) => {
    const {
        address, city, state, zip_code, bedrooms, bathrooms, price,
        amenities, description, year_built, square_feet, lot_size, property_type
    } = req.body;

    try {
        console.log('Received request body:', req.body);

        // Call the photo upload function
        await doUploadPhotos(req, res); // This will handle the photo upload and attach `req.files`

        const imageUrls = req.files.map(file => ({
            original: file.original,
            thumbnail: file.thumbnail,
            slide: file.slide,
        }));

        const newProperty = await Property.create({
            address, city, state, zip_code, bedrooms, bathrooms, price,
            image_urls: imageUrls, // Store the image URLs
            amenities, description, year_built, square_feet, lot_size, property_type
        });

        console.log('Property created successfully:', newProperty);
        res.status(201).json({ message: 'Property created successfully', property: newProperty });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a property with photo handling
const updateProperty = async (req, res) => {
    const { id } = req.params;
    const {
        address, city, state, zip_code, bedrooms, bathrooms, price,
        amenities, description, year_built, square_feet, lot_size, property_type, image_urls
    } = req.body;

    console.log('Updating property with ID:', id);

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Handle new photo uploads
        await doUploadPhotos(req, res);

        const newImageUrls = req.files.map(file => ({
            original: file.original,
            thumbnail: file.thumbnail,
            slide: file.slide,
        }));

        property.image_urls = image_urls ? image_urls.concat(newImageUrls) : newImageUrls;

        // Update other property fields
        property.address = address || property.address;
        property.city = city || property.city;
        property.state = state || property.state;
        property.zip_code = zip_code || property.zip_code;
        property.bedrooms = bedrooms || property.bedrooms;
        property.bathrooms = bathrooms || property.bathrooms;
        property.price = price || property.price;
        property.amenities = amenities || property.amenities;
        property.description = description || property.description;
        property.year_built = year_built || property.year_built;
        property.square_feet = square_feet || property.square_feet;
        property.lot_size = lot_size || property.lot_size;
        property.property_type = property_type || property.property_type;

        await property.save();
        console.log('Property updated:', property);
        res.json({ message: 'Property updated successfully', property });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a property with photo removal
const deleteProperty = async (req, res) => {
    const { id } = req.params;
    console.log('Deleting property with ID:', id);

    try {
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Remove associated photos
        await removeFiles(req, res);

        await property.destroy();
        console.log('Property deleted successfully');
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


const getAllProperties = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC' } = req.query;

    try {
        const offset = (page - 1) * limit; // Calculate the offset for pagination

        const properties = await Property.findAll({
            attributes: [
                'id', 'address', 'city', 'state', 'zip_code', 'bedrooms', 'bathrooms', 
                'price', 'image_urls', 'amenities', 'description', 'year_built', 
                'square_feet', 'lot_size', 'property_type', 'createdAt', 'updatedAt'
            ],
            offset, // For pagination
            limit: parseInt(limit), // For pagination
            order: [[sortBy, order]], // For sorting
        });

        res.status(200).json({
            message: 'Properties fetched successfully',
            data: properties,
            pagination: {
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
                totalProperties: await Property.count(), // Total count for frontend pagination
            },
        });
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Error fetching properties", error });
    }
};

// Export controller methods
module.exports = {
    createProperty,
    getAllProperties,
    
    updateProperty,
    deleteProperty
};
