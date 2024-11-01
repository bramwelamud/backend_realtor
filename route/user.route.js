// routes/userRoutes.js
const express = require('express');
const { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    deleteAccount, 
    getAllUsers, 
    updatePassword, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/user.controller');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth'); // Middleware for protecting routes

const router = express.Router();

// Validation rules
const userValidationRules = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email format'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Routes
router.post('/register',  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); 
}, register); 

router.post('/login',userValidationRules, login); 
router.get('/get_profile', authMiddleware, getProfile); 
router.put('/update_profile', authMiddleware, updateProfile); 
router.delete('/delete_account', deleteAccount); 
router.get('get_users', authMiddleware, getAllUsers); 
router.put('/update_password', authMiddleware, updatePassword); 
router.post('/forgot-password', forgotPassword); 

const passwordResetValidationRules = [
    check('token').notEmpty().withMessage('Token is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

router.post('/reset-password', passwordResetValidationRules, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); 
}, resetPassword); 

module.exports = router;
