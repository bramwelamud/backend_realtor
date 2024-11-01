"use strict";

// routes/searchRoutes.js
var express = require('express');

var _require = require('../controllers/search.controller'),
    createSearch = _require.createSearch,
    getUserSearches = _require.getUserSearches,
    performSearch = _require.performSearch;

var router = express.Router();
router.post('/search', createSearch);
router.get('/search/user/:userId', getUserSearches);
router.get('/search/properties', performSearch);
module.exports = router;