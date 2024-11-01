"use strict";

// routes/survey.routes.js
var express = require('express');

var _require = require('../controllers/survey.controller'),
    submitSurvey = _require.submitSurvey; // Adjust the path as necessary


var router = express.Router(); // Route for submitting a survey

router.post('/submit', submitSurvey);
module.exports = router;