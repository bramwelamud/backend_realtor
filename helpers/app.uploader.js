'use strict';

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require("sharp");
const dotenv = require('dotenv').config();
const moment = require("moment");
const Properties = require('../models/properties.model'); // Import Property model

const pathUploadFolder = process.env.APP_UPLOAD_PATH || path.join(__dirname, '../uploads/');
fs.mkdirSync(pathUploadFolder, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, pathUploadFolder),
    filename: (req, file, cb) => {
        const extension = file.mimetype.split("/").pop();
        const filename = `${file.fieldname}-${Date.now()}.${extension}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB per file
        files: 10 // max number of files
    }
}).array('photos_property', 10);

/**
 * Processes and resizes uploaded photos.
 */
const processPhotos = async (photos) => {
    const imageUrls = [];
    for (const photo of photos) {
        const timestamp = Date.now();
        const extension = path.extname(photo.originalname);
        const baseName = `photo_property-${timestamp}${extension}`;
        const originalPath = path.join(pathUploadFolder, baseName);

        const thumbPath = path.join(pathUploadFolder, `thumbnail_${baseName}`);
        const slidePath = path.join(pathUploadFolder, `slide_${baseName}`);

        try {
            await fs.promises.rename(photo.path, originalPath);
            await sharp(originalPath).resize(640, 320).toFile(thumbPath);
            await sharp(originalPath).resize(1200, 779).toFile(slidePath);

            imageUrls.push({
                original: `/uploads/${baseName}`,
                thumbnail: `/uploads/thumbnail_${baseName}`,
                slide: `/uploads/slide_${baseName}`,
                size: photo.size,
                mimeType: photo.mimetype
            });
        } catch (err) {
            console.error(`Error processing photo ${baseName}: ${err.message}`);
            throw new Error(`Error processing photo ${baseName}: ${err.message}`);
        }
    }
    return imageUrls;
};

/**
 * Handles photo upload and processing.
 */const doUploadPhotos = async (req, res) => {
    try {
        console.log("Starting photo upload process...");
        upload(req, res, async (err) => {
            console.log("Incoming request files:", req.files);
            console.log("Request parameters:", req.params);

            if (err instanceof multer.MulterError) {
                console.error("Multer error during upload:", err);
                return res.status(500).json({ msg: 'Multer error uploading photos', error: err.message });
            } else if (err) {
                console.error("Unknown error during upload:", err);
                return res.status(500).json({ msg: 'Error uploading photos', error: err.message });
            }

            if (!req.files || req.files.length === 0) {
                console.warn("No photos uploaded.");
                return res.status(400).json({ msg: 'No photos uploaded' });
            }

            console.log("Uploaded files:", req.files);
            const property_id = req.params.propertyId;
            if (!property_id) {
                console.error("Property ID is missing in the request parameters.");
                return res.status(400).json({ msg: 'Property ID is required' });
            }
            console.log(`Property ID: ${property_id}`);
            const photos = req.files;

            const imageUrls = await processPhotos(photos);
            console.log("Image URLs generated:", imageUrls);

            const photoMetadata = {
                property_id,
                photos: imageUrls
            };

            Properties.photoUploadMultipleProperty(photoMetadata, (err, items) => {
                if (err) {
                    console.error("Error saving photos to database:", err);
                    return res.status(500).json({ msg: 'Error saving photos', err });
                }
                console.log("Photos saved successfully in the database:", items);
                return res.status(200).json({ msg: 'Photos uploaded successfully', data: items });
            });
        });
    } catch (error) {
        console.error('Unexpected server error:', error);
        return res.status(500).json({ msg: 'Unexpected server error', error });
    }
};

/**
 * Deletes files for a specified property.
 */
const removeFiles = async (req, res) => {
    const regId = req.params.id;

    Properties.photoRemoveFile(regId, async (err, items) => {
        if (err) return res.status(500).json({ msg: 'Error fetching item for removal', err });

        try {
            const promises = items.data.photos.map(photo => {
                const paths = [
                    path.join(pathUploadFolder, photo.original),
                    path.join(pathUploadFolder, photo.thumbnail),
                    path.join(pathUploadFolder, photo.slide)
                ];
                return Promise.all(paths.map(fs.promises.unlink));
            });

            await Promise.all(promises);
            res.status(200).json({ msg: 'Files removed successfully', item: items });
        } catch (error) {
            console.error('Error during file removal:', error);
            res.status(500).json({ msg: 'Error occurred while removing files', error });
        }
    });
};

module.exports = { doUploadPhotos, removeFiles };
