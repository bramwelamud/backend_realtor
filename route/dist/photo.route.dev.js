"use strict";

var express = require('express');

var router = express.Router();

var multer = require('multer'); // Configure multer for handling file uploads


var upload = multer({
  dest: 'uploads/'
}); // You can set up custom storage options if needed
// Import the PropertyController (adjust the path if necessary)

var PropertyController = require('../helpers/app.uploader'); // Define routes for uploading and deleting property photos


router.post('/properties/:propertyId/upload', upload.array('photos_property'), PropertyController.doUploadPhotos);
router["delete"]('/properties/:id/files', PropertyController.removeFiles);
module.exports = router;