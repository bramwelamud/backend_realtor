// routes/survey.routes.js
const express = require('express');
const { submitSurvey } = require('../controllers/survey.controller'); // Adjust the path as necessary

const router = express.Router();

// Route for submitting a survey
router.post('/submit', submitSurvey);

module.exports = router;
