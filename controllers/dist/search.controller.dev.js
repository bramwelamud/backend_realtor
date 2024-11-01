"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// controllers/SearchController.js
var _require = require('../models/search.model'),
    Search = _require.Search;

var _require2 = require('../models/properties.model'),
    Property = _require2.Property;

var _require3 = require('sequelize'),
    Op = _require3.Op; // Create a new search


var createSearch = function createSearch(req, res) {
  var _req$body, userId, location, minPrice, maxPrice, bedrooms, bathrooms, propertyType, newSearch;

  return regeneratorRuntime.async(function createSearch$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, location = _req$body.location, minPrice = _req$body.minPrice, maxPrice = _req$body.maxPrice, bedrooms = _req$body.bedrooms, bathrooms = _req$body.bathrooms, propertyType = _req$body.propertyType;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(Search.create({
            userId: userId,
            location: location,
            minPrice: minPrice,
            maxPrice: maxPrice,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            propertyType: propertyType
          }));

        case 4:
          newSearch = _context.sent;
          res.status(201).json(newSearch);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context.t0
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Get all searches for a user


var getUserSearches = function getUserSearches(req, res) {
  var userId, searches;
  return regeneratorRuntime.async(function getUserSearches$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userId = req.params.userId;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Search.findAll({
            where: {
              userId: userId
            }
          }));

        case 4:
          searches = _context2.sent;
          res.json(searches);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context2.t0
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}; // Perform a search based on the criteria


var performSearch = function performSearch(req, res) {
  var _req$query, location, minPrice, maxPrice, bedrooms, bathrooms, propertyType, whereClause, properties, recommendedProperties;

  return regeneratorRuntime.async(function performSearch$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$query = req.query, location = _req$query.location, minPrice = _req$query.minPrice, maxPrice = _req$query.maxPrice, bedrooms = _req$query.bedrooms, bathrooms = _req$query.bathrooms, propertyType = _req$query.propertyType;
          whereClause = {
            location: _defineProperty({}, Op.like, "%".concat(location, "%")),
            price: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, minPrice || 0), // Minimum price
            _defineProperty({}, Op.lte, maxPrice || Infinity) // Maximum price
            ]),
            bedrooms: _defineProperty({}, Op.gte, bedrooms || 0),
            bathrooms: _defineProperty({}, Op.gte, bathrooms || 0),
            propertyType: propertyType || _defineProperty({}, Op.ne, null) // Not null if provided

          };
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Property.findAll({
            where: whereClause
          }));

        case 5:
          properties = _context3.sent;

          if (!(properties.length === 0)) {
            _context3.next = 11;
            break;
          }

          _context3.next = 9;
          return regeneratorRuntime.awrap(findNearbyProperties(location, 5));

        case 9:
          recommendedProperties = _context3.sent;
          return _context3.abrupt("return", res.json({
            message: 'No properties found for the specified criteria. Here are some recommendations within 5 miles.',
            properties: recommendedProperties
          }));

        case 11:
          res.json(properties);
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](2);
          res.status(500).json({
            message: 'Server error',
            error: _context3.t0
          });

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 14]]);
}; // Function to find nearby properties within a specified distance (miles)


var findNearbyProperties = function findNearbyProperties(location, distance) {
  var _ref4, latitude, longitude;

  return regeneratorRuntime.async(function findNearbyProperties$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(getCoordinatesFromLocation(location));

        case 2:
          _ref4 = _context4.sent;
          latitude = _ref4.latitude;
          longitude = _ref4.longitude;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Property.findAll({
            where: sequelize.where(sequelize.fn('ST_Distance_Sphere', sequelize.fn('ST_MakePoint', sequelize.col('longitude'), sequelize.col('latitude')), sequelize.fn('ST_MakePoint', longitude, latitude)), _defineProperty({}, Op.lt, distance * 1609.34) // Convert miles to meters
            )
          }));

        case 7:
          return _context4.abrupt("return", _context4.sent);

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // Function to convert location to coordinates


var getCoordinatesFromLocation = function getCoordinatesFromLocation(location) {
  return regeneratorRuntime.async(function getCoordinatesFromLocation$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", {
            latitude: 0,
            longitude: 0
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // Export controller methods


module.exports = {
  createSearch: createSearch,
  getUserSearches: getUserSearches,
  performSearch: performSearch
};