// routes/survey.routes.js
const express = require('express');
const router = express.Router();
const { submitSurvey } = require('../controllers/match.controller');

router.post('/submit', submitSurvey);

module.exports = router;
