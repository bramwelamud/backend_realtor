// routes/propertyRoutes.js
const express = require('express');
// Ensure this path is correct
const { createProperty, getAllProperties, updateProperty, deleteProperty } = require('../controllers/property.controller');  
const router = express.Router();



router.get('/queryall_properties',getAllProperties);
router.post('/create_property',createProperty);
// router.get('/search', searchNearbyProperties);
router.put('/update:id', updateProperty);
router.delete('/delete:id', deleteProperty);

module.exports = router;
