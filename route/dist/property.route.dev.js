"use strict";

// routes/propertyRoutes.js
var express = require('express'); // Ensure this path is correct


var _require = require('../controllers/property.controller'),
    createProperty = _require.createProperty,
    getAllProperties = _require.getAllProperties,
    updateProperty = _require.updateProperty,
    deleteProperty = _require.deleteProperty;

var router = express.Router();
router.get('/queryall_properties', getAllProperties);
router.post('/create_property', createProperty); // router.get('/search', searchNearbyProperties);

router.put('/update:id', updateProperty);
router["delete"]('/delete:id', deleteProperty);
module.exports = router;