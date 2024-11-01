"use strict";

// routes/survey.routes.js
var express = require('express');

var router = express.Router();

var _require = require('../controllers/match.controller'),
    submitSurvey = _require.submitSurvey;

router.post('/submit', submitSurvey);
module.exports = router;