'use strict';
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require("sharp");
const dotenv = require('dotenv').config();
const moment = require("moment");
const pathUploadFolder = process.env.APP_UPLOAD_PATH || './uploads/';
const Properties = require('../models/properties.model');

// const AppUploader = function (email) {
// 	this.email_bbc = email.email_bbc;
// 	this.email_to = email.email_to;
// 	this.email_subject = email.email_subject;
// 	this.email_body = email.email_body;
// };


const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, pathUploadFolder);
	},
	filename: function (req, file, callback) {
		let thisDT = moment().format('YYYY-MM-DDD HH:mm:ss A').toString();
		let extArray = file.mimetype.split("/");
		let extension = extArray[extArray.length - 1];
		callback(null, file.fieldname + '-' + Date.now() + '.' + extension);
	}
});
const upload = multer({ storage: storage }).single('photo_property');

exports.doUploadPhotos = async (req, res) => {
    
    // * Check if has file attached
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.photo_property ) {
    if (!req.files || Object.keys(req.files).length === 0  ) {
        return res.status(400).json({msg: 'There is not photo in request'});
    }
    const property_id =req.params.propertyId;
    const category_id =req.params.categoryId;
    const photos = req.files;
    let groupPhotos=[],imgCounter=1;
    for (const key in photos) {
       
        const photo = photos[key];
        
        const insertPhoto = {};
        insertPhoto.property_id = property_id;
        insertPhoto.file_size = photo.size;
        insertPhoto.file_mime_type = photo.mimetype;

        
        //* Define path
        let extArray = photo.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        const name = `photo_property-_${imgCounter}_${Date.now()}.${extension}`;
        const uploadPath = path.join('uploads', name);

        insertPhoto.file_name = name;
        insertPhoto.file_location = uploadPath;

        const fileThumbnail = `thumbnail_${name}`;
        const uploadPathThumbnail = path.join('uploads', fileThumbnail);
        
        const fileSlide = `slide_${name}`;
        const uploadPathSlide = path.join('uploads', fileSlide);

       
        imgCounter++;
        const photoMultipleInsert =[property_id,insertPhoto.file_size,insertPhoto.file_mime_type,insertPhoto.file_name,insertPhoto.file_location,fileThumbnail,fileSlide,category_id];

        groupPhotos.push(photoMultipleInsert);
        // groupPhotos.push(insertPhoto);

        //* Use the mv() method to place the photo somewhere on your server
        photo.mv(uploadPath, async (err)  =>  {
            if (err) return res.status(500).json({ err });
            await sharp(uploadPath)
            .resize(640, 320)
            .toFile(uploadPathThumbnail);

            await sharp(uploadPath)
            .resize(1200, 779)
            .toFile(uploadPathSlide);
        });
    };
    
    // //* Create photo field DB
    Properties.photoUploadMultipleProperty(groupPhotos, function (err, items) {
    	if (err) return res.status(500).send('Error occured during fetching item for property_id '+property_id);
    	return res.send({ status: 'ok', 'message': 'File is uploaded.', item: items });
    });
   
}

exports.removeFiles = async (req, res) => {
    const regId = req.params.id;
    Properties.photoRemoveFile(regId, function (err, items) {
    	if (err) return res.status(500).send('Error occured during fetching item for regId '+regId);
        try {
            fs.unlinkSync(pathUploadFolder+items.data.file_name) //file removed
            fs.unlinkSync(pathUploadFolder+items.data.file_thumbnail) //file removed
            fs.unlinkSync(pathUploadFolder+items.data.file_slider) //file removed
            return res.send({ status: 'ok', 'message': 'File is removed.', item: items });
        } catch(error) {
            console.error(error);
            return res.status(500).send('Error occured during fetching item for regId '+regId);
        }
    	
    });
}
