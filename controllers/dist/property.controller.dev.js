"use strict";

// controllers/PropertyController.js
var Property = require('../models/properties.model');

var _require = require('sequelize'),
    Op = _require.Op;

var _require2 = require('../helpers/app.uploader'),
    doUploadPhotos = _require2.doUploadPhotos,
    removeFiles = _require2.removeFiles; // Create a new property


var createProperty = function createProperty(req, res) {
  var _req$body, address, city, state, zip_code, bedrooms, bathrooms, price, amenities, description, year_built, square_feet, lot_size, property_type, imageUrls, newProperty;

  return regeneratorRuntime.async(function createProperty$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, address = _req$body.address, city = _req$body.city, state = _req$body.state, zip_code = _req$body.zip_code, bedrooms = _req$body.bedrooms, bathrooms = _req$body.bathrooms, price = _req$body.price, amenities = _req$body.amenities, description = _req$body.description, year_built = _req$body.year_built, square_feet = _req$body.square_feet, lot_size = _req$body.lot_size, property_type = _req$body.property_type;
          _context.prev = 1;
          console.log('Received request body:', req.body); // Call the photo upload function

          _context.next = 5;
          return regeneratorRuntime.awrap(doUploadPhotos(req, res));

        case 5:
          // This will handle the photo upload and attach `req.files`
          imageUrls = req.files.map(function (file) {
            return {
              original: file.original,
              thumbnail: file.thumbnail,
              slide: file.slide
            };
          });
          _context.next = 8;
          return regeneratorRuntime.awrap(Property.create({
            address: address,
            city: city,
            state: state,
            zip_code: zip_code,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            price: price,
            image_urls: imageUrls,
            // Store the image URLs
            amenities: amenities,
            description: description,
            year_built: year_built,
            square_feet: square_feet,
            lot_size: lot_size,
            property_type: property_type
          }));

        case 8:
          newProperty = _context.sent;
          console.log('Property created successfully:', newProperty);
          res.status(201).json({
            message: 'Property created successfully',
            property: newProperty
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);
          console.error('Error creating property:', _context.t0);
          res.status(500).json({
            message: 'Server error',
            error: _context.t0
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
}; // Update a property with photo handling


var updateProperty = function updateProperty(req, res) {
  var id, _req$body2, address, city, state, zip_code, bedrooms, bathrooms, price, amenities, description, year_built, square_feet, lot_size, property_type, image_urls, property, newImageUrls;

  return regeneratorRuntime.async(function updateProperty$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, address = _req$body2.address, city = _req$body2.city, state = _req$body2.state, zip_code = _req$body2.zip_code, bedrooms = _req$body2.bedrooms, bathrooms = _req$body2.bathrooms, price = _req$body2.price, amenities = _req$body2.amenities, description = _req$body2.description, year_built = _req$body2.year_built, square_feet = _req$body2.square_feet, lot_size = _req$body2.lot_size, property_type = _req$body2.property_type, image_urls = _req$body2.image_urls;
          console.log('Updating property with ID:', id);
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Property.findByPk(id));

        case 6:
          property = _context2.sent;

          if (property) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: 'Property not found'
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(doUploadPhotos(req, res));

        case 11:
          newImageUrls = req.files.map(function (file) {
            return {
              original: file.original,
              thumbnail: file.thumbnail,
              slide: file.slide
            };
          });
          property.image_urls = image_urls ? image_urls.concat(newImageUrls) : newImageUrls; // Update other property fields

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
          _context2.next = 28;
          return regeneratorRuntime.awrap(property.save());

        case 28:
          console.log('Property updated:', property);
          res.json({
            message: 'Property updated successfully',
            property: property
          });
          _context2.next = 36;
          break;

        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](3);
          console.error('Error updating property:', _context2.t0);
          res.status(500).json({
            message: 'Server error',
            error: _context2.t0
          });

        case 36:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 32]]);
}; // Delete a property with photo removal


var deleteProperty = function deleteProperty(req, res) {
  var id, property;
  return regeneratorRuntime.async(function deleteProperty$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          console.log('Deleting property with ID:', id);
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Property.findByPk(id));

        case 5:
          property = _context3.sent;

          if (property) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Property not found'
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(removeFiles(req, res));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(property.destroy());

        case 12:
          console.log('Property deleted successfully');
          res.json({
            message: 'Property deleted successfully'
          });
          _context3.next = 20;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](2);
          console.error('Error deleting property:', _context3.t0);
          res.status(500).json({
            message: 'Server error',
            error: _context3.t0
          });

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 16]]);
};

var getAllProperties = function getAllProperties(req, res) {
  var _req$query, _req$query$page, page, _req$query$limit, limit, _req$query$sortBy, sortBy, _req$query$order, order, offset, properties;

  return regeneratorRuntime.async(function getAllProperties$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit, _req$query$sortBy = _req$query.sortBy, sortBy = _req$query$sortBy === void 0 ? 'createdAt' : _req$query$sortBy, _req$query$order = _req$query.order, order = _req$query$order === void 0 ? 'DESC' : _req$query$order;
          _context4.prev = 1;
          offset = (page - 1) * limit; // Calculate the offset for pagination

          _context4.next = 5;
          return regeneratorRuntime.awrap(Property.findAll({
            attributes: ['id', 'address', 'city', 'state', 'zip_code', 'bedrooms', 'bathrooms', 'price', 'image_urls', 'amenities', 'description', 'year_built', 'square_feet', 'lot_size', 'property_type', 'createdAt', 'updatedAt'],
            offset: offset,
            // For pagination
            limit: parseInt(limit),
            // For pagination
            order: [[sortBy, order]] // For sorting

          }));

        case 5:
          properties = _context4.sent;
          _context4.t0 = res.status(200);
          _context4.t1 = properties;
          _context4.t2 = parseInt(page);
          _context4.t3 = parseInt(limit);
          _context4.next = 12;
          return regeneratorRuntime.awrap(Property.count());

        case 12:
          _context4.t4 = _context4.sent;
          _context4.t5 = {
            currentPage: _context4.t2,
            pageSize: _context4.t3,
            totalProperties: _context4.t4
          };
          _context4.t6 = {
            message: 'Properties fetched successfully',
            data: _context4.t1,
            pagination: _context4.t5
          };

          _context4.t0.json.call(_context4.t0, _context4.t6);

          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t7 = _context4["catch"](1);
          console.error("Error fetching properties:", _context4.t7);
          res.status(500).json({
            message: "Error fetching properties",
            error: _context4.t7
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 18]]);
}; // Export controller methods


module.exports = {
  createProperty: createProperty,
  getAllProperties: getAllProperties,
  updateProperty: updateProperty,
  deleteProperty: deleteProperty
};