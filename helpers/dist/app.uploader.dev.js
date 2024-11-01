'use strict';

var fs = require('fs');

var path = require('path');

var multer = require('multer');

var sharp = require("sharp");

var dotenv = require('dotenv').config();

var moment = require("moment");

var Properties = require('../models/properties.model'); // Import Property model


var pathUploadFolder = process.env.APP_UPLOAD_PATH || path.join(__dirname, '../uploads/');
fs.mkdirSync(pathUploadFolder, {
  recursive: true
}); // Multer storage configuration

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    return cb(null, pathUploadFolder);
  },
  filename: function filename(req, file, cb) {
    var extension = file.mimetype.split("/").pop();
    var filename = "".concat(file.fieldname, "-").concat(Date.now(), ".").concat(extension);
    cb(null, filename);
  }
});
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    // 5 MB per file
    files: 10 // max number of files

  }
}).array('photos_property', 10);
/**
 * Processes and resizes uploaded photos.
 */

var processPhotos = function processPhotos(photos) {
  var imageUrls, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, photo, timestamp, extension, baseName, originalPath, thumbPath, slidePath;

  return regeneratorRuntime.async(function processPhotos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          imageUrls = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 4;
          _iterator = photos[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 31;
            break;
          }

          photo = _step.value;
          timestamp = Date.now();
          extension = path.extname(photo.originalname);
          baseName = "photo_property-".concat(timestamp).concat(extension);
          originalPath = path.join(pathUploadFolder, baseName);
          thumbPath = path.join(pathUploadFolder, "thumbnail_".concat(baseName));
          slidePath = path.join(pathUploadFolder, "slide_".concat(baseName));
          _context.prev = 14;
          _context.next = 17;
          return regeneratorRuntime.awrap(fs.promises.rename(photo.path, originalPath));

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(sharp(originalPath).resize(640, 320).toFile(thumbPath));

        case 19:
          _context.next = 21;
          return regeneratorRuntime.awrap(sharp(originalPath).resize(1200, 779).toFile(slidePath));

        case 21:
          imageUrls.push({
            original: "/uploads/".concat(baseName),
            thumbnail: "/uploads/thumbnail_".concat(baseName),
            slide: "/uploads/slide_".concat(baseName),
            size: photo.size,
            mimeType: photo.mimetype
          });
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](14);
          console.error("Error processing photo ".concat(baseName, ": ").concat(_context.t0.message));
          throw new Error("Error processing photo ".concat(baseName, ": ").concat(_context.t0.message));

        case 28:
          _iteratorNormalCompletion = true;
          _context.next = 6;
          break;

        case 31:
          _context.next = 37;
          break;

        case 33:
          _context.prev = 33;
          _context.t1 = _context["catch"](4);
          _didIteratorError = true;
          _iteratorError = _context.t1;

        case 37:
          _context.prev = 37;
          _context.prev = 38;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 40:
          _context.prev = 40;

          if (!_didIteratorError) {
            _context.next = 43;
            break;
          }

          throw _iteratorError;

        case 43:
          return _context.finish(40);

        case 44:
          return _context.finish(37);

        case 45:
          return _context.abrupt("return", imageUrls);

        case 46:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 33, 37, 45], [14, 24], [38,, 40, 44]]);
};
/**
 * Handles photo upload and processing.
 */


var doUploadPhotos = function doUploadPhotos(req, res) {
  return regeneratorRuntime.async(function doUploadPhotos$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.log("Starting photo upload process...");
          upload(req, res, function _callee(err) {
            var property_id, photos, imageUrls, photoMetadata;
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    console.log("Incoming request files:", req.files);
                    console.log("Request parameters:", req.params);

                    if (!(err instanceof multer.MulterError)) {
                      _context2.next = 7;
                      break;
                    }

                    console.error("Multer error during upload:", err);
                    return _context2.abrupt("return", res.status(500).json({
                      msg: 'Multer error uploading photos',
                      error: err.message
                    }));

                  case 7:
                    if (!err) {
                      _context2.next = 10;
                      break;
                    }

                    console.error("Unknown error during upload:", err);
                    return _context2.abrupt("return", res.status(500).json({
                      msg: 'Error uploading photos',
                      error: err.message
                    }));

                  case 10:
                    if (!(!req.files || req.files.length === 0)) {
                      _context2.next = 13;
                      break;
                    }

                    console.warn("No photos uploaded.");
                    return _context2.abrupt("return", res.status(400).json({
                      msg: 'No photos uploaded'
                    }));

                  case 13:
                    console.log("Uploaded files:", req.files);
                    property_id = req.params.propertyId;

                    if (property_id) {
                      _context2.next = 18;
                      break;
                    }

                    console.error("Property ID is missing in the request parameters.");
                    return _context2.abrupt("return", res.status(400).json({
                      msg: 'Property ID is required'
                    }));

                  case 18:
                    console.log("Property ID: ".concat(property_id));
                    photos = req.files;
                    _context2.next = 22;
                    return regeneratorRuntime.awrap(processPhotos(photos));

                  case 22:
                    imageUrls = _context2.sent;
                    console.log("Image URLs generated:", imageUrls);
                    photoMetadata = {
                      property_id: property_id,
                      photos: imageUrls
                    };
                    Properties.photoUploadMultipleProperty(photoMetadata, function (err, items) {
                      if (err) {
                        console.error("Error saving photos to database:", err);
                        return res.status(500).json({
                          msg: 'Error saving photos',
                          err: err
                        });
                      }

                      console.log("Photos saved successfully in the database:", items);
                      return res.status(200).json({
                        msg: 'Photos uploaded successfully',
                        data: items
                      });
                    });

                  case 26:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          _context3.next = 9;
          break;

        case 5:
          _context3.prev = 5;
          _context3.t0 = _context3["catch"](0);
          console.error('Unexpected server error:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            msg: 'Unexpected server error',
            error: _context3.t0
          }));

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 5]]);
};
/**
 * Deletes files for a specified property.
 */


var removeFiles = function removeFiles(req, res) {
  var regId;
  return regeneratorRuntime.async(function removeFiles$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          regId = req.params.id;
          Properties.photoRemoveFile(regId, function _callee2(err, items) {
            var promises;
            return regeneratorRuntime.async(function _callee2$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!err) {
                      _context4.next = 2;
                      break;
                    }

                    return _context4.abrupt("return", res.status(500).json({
                      msg: 'Error fetching item for removal',
                      err: err
                    }));

                  case 2:
                    _context4.prev = 2;
                    promises = items.data.photos.map(function (photo) {
                      var paths = [path.join(pathUploadFolder, photo.original), path.join(pathUploadFolder, photo.thumbnail), path.join(pathUploadFolder, photo.slide)];
                      return Promise.all(paths.map(fs.promises.unlink));
                    });
                    _context4.next = 6;
                    return regeneratorRuntime.awrap(Promise.all(promises));

                  case 6:
                    res.status(200).json({
                      msg: 'Files removed successfully',
                      item: items
                    });
                    _context4.next = 13;
                    break;

                  case 9:
                    _context4.prev = 9;
                    _context4.t0 = _context4["catch"](2);
                    console.error('Error during file removal:', _context4.t0);
                    res.status(500).json({
                      msg: 'Error occurred while removing files',
                      error: _context4.t0
                    });

                  case 13:
                  case "end":
                    return _context4.stop();
                }
              }
            }, null, null, [[2, 9]]);
          });

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  doUploadPhotos: doUploadPhotos,
  removeFiles: removeFiles
};