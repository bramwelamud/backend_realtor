'use strict';

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const cors = require('cors');

// Import your models and routes

// Load environment variables from .env file
dotenv.config();

const app = express();
const API_port = process.env.PORT_API || 4000; // Use port from environment or default to 4000
const API_URL = process.env.APP_URL_FRONTEND;
const API_VERSION = process.env.API_VERSION || 'v1'; // Fallback version if not set in .env

// CORS configuration (allow all origins in development; adjust in production)
const corsOpt = {
    origin: '*', // Adjust in production
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api_key'],
};

// Middleware
app.use(cors(corsOpt));
app.options('*', cors(corsOpt)); // Enable pre-flight requests for all routes
app.use(express.json()); // Parse JSON request bodies

// Import routes
const userRoutes = require('./route/user.route'); // Import user routes
const authRoutes = require('./route/user.auth.route'); // Import authentication routes

app.use(express.static('/uploads'));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
});

// Start the server
app.listen(API_port, () => {
    console.log(`Server is running at http://0.0.0.0:${API_port}`);
    console.log(`Realtor_RA145 API Version: ${API_VERSION}`);
});
