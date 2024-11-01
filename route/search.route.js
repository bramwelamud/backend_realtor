// routes/searchRoutes.js
const express = require('express');
const {
    createSearch,
    getUserSearches,
    performSearch
} = require('../controllers/search.controller');

const router = express.Router();

router.post('/search', createSearch);

router.get('/search/user/:userId', getUserSearches);

router.get('/search/properties', performSearch);

module.exports = router;
