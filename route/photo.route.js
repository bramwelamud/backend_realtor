const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/' }); // You can set up custom storage options if needed

// Import the PropertyController (adjust the path if necessary)
const PropertyController = require('../helpers/app.uploader');

// Define routes for uploading and deleting property photos
router.post('/properties/:propertyId/upload', upload.array('photos_property'), PropertyController.doUploadPhotos);
router.delete('/properties/:id/files', PropertyController.removeFiles);

module.exports = router;
