"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// controllers/survey.controller.js
var _require = require('../models/match.model'),
    Match = _require.Match;

var Survey = require('../models/survey.model');

var Property = require('../models/properties.model'); // Ensure correct path


var axios = require('axios');

var submitSurvey = function submitSurvey(req, res) {
  var _req$body, userId, preferences, survey, matchedProperties, matches;

  return regeneratorRuntime.async(function submitSurvey$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, userId = _req$body.userId, preferences = _req$body.preferences; // Get userId and preferences from the request
          // Step 1: Store the survey response

          _context2.next = 4;
          return regeneratorRuntime.awrap(Survey.create({
            userId: userId,
            preferences: preferences
          }));

        case 4:
          survey = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(matchProperties(preferences));

        case 7:
          matchedProperties = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(Promise.all(matchedProperties.map(function _callee(propertyId) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(Match.create({
                      userId: userId,
                      propertyId: propertyId,
                      status: 'new'
                    }));

                  case 2:
                    return _context.abrupt("return", _context.sent);

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            });
          })));

        case 10:
          matches = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(sendToWebhook(userId, matches));

        case 13:
          res.status(201).json({
            message: 'Survey submitted and matches created',
            matches: matches
          });
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            error: 'An error occurred while submitting the survey'
          });

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
}; // Function to match properties based on preferences


var matchProperties = function matchProperties(preferences) {
  var location, priceRange, matchedProperties;
  return regeneratorRuntime.async(function matchProperties$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          // This is a simple example; you can enhance this with your matching logic
          location = preferences.location, priceRange = preferences.priceRange;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Property.findAll({
            where: {
              location: location,
              price: _defineProperty({}, Op.between, priceRange)
            }
          }));

        case 3:
          matchedProperties = _context3.sent;
          return _context3.abrupt("return", matchedProperties.map(function (property) {
            return property.id;
          }));

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // Function to send matches to a webhook


var sendToWebhook = function sendToWebhook(userId, matches) {
  var webhookUrl, payload;
  return regeneratorRuntime.async(function sendToWebhook$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          webhookUrl = 'https://your-webhook-url.com'; // Replace with your actual webhook URL

          payload = {
            userId: userId,
            matches: matches
          };
          _context4.next = 4;
          return regeneratorRuntime.awrap(axios.post(webhookUrl, payload));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports = {
  submitSurvey: submitSurvey
};