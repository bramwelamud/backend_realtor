require('dotenv').config();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET|| '123456789';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});


const ERROR_MESSAGES = {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists',
    PASSWORD_MISMATCH: 'Passwords do not match',
};



/**
 * 
 * 
 * 
 * Utility function to send error responses.
 */
const sendErrorResponse = (res, status, message) => {
    return res.status(status).json({ success: false, message });
};

/**
 * Register a new user.
 */const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};



async function register(req, res) {
    try {
        const { name, email, password, role, membership_tier, phone_number, work_email } = req.body;

        // Validate required fields
        if (!email || !password || !name) {
            return sendErrorResponse(res, 400, ERROR_MESSAGES.MISSING_FIELDS);
        }

        // Validate email format
        

        const trimmedPhoneNumber = phone_number ? phone_number.trim() : '';
        const trimmedWorkEmail = work_email ? work_email.trim() : '';
        const trimmedRole = role ? role.trim() : 'defaultRole';

        // Check for existing user
        const existingUser = await User.findOne({ where: { email: email.trim() } });
        if (existingUser) {
            return sendErrorResponse(res, 400, 'Email is already registered.');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            role: trimmedRole,
            membership_tier,
            phone_number: trimmedPhoneNumber,
            work_email: trimmedWorkEmail,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error in register function:', error);
        return sendErrorResponse(res, 500);
    }
}

const login = async (req, res) => {
    let { email, password } = req.body;

    // Log the received email and password
    console.log('Received email:', email);
    console.log('Received password:', password);

    email = email?.trim();  // Use optional chaining to avoid TypeError
    password = password?.trim();

    if (!email || !password) {
        console.log('Missing email or password in request body');
        return sendErrorResponse(res, 400, 'Email and password are required');
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`No user found with email: ${email}`);
            return sendErrorResponse(res, 400, ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // Compare the provided password with the stored hash
        const passwordMatch = bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Password does not match');
            return sendErrorResponse(res, 400, ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        // If everything is successful, generate the token...
        const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        console.log('Token generated successfully:', token);

        return res.json({ success: true, token, user, message: 'Login successful' });
    } catch (error) {
        console.error('Error in login function:', error);
        return sendErrorResponse(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
};





/**
 * Get user profile.
 */

const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }
        return res.json({ success: true, user });
    } catch (error) {
        console.error('Error in getProfile function:', error);
        return sendErrorResponse(res, 500, 'Server error');
    }
};

/**
 * Update user profile.
 */
const updateProfile = async (req, res) => {
    const { name, phone_number, work_email } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }

        user.name = name || user.name;
        user.phone_number = phone_number || user.phone_number;
        user.work_email = work_email || user.work_email;

        await user.save();
        return res.json({ success: true, user, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error in updateProfile function:', error);
        return sendErrorResponse(res, 500, 'Server error');
    }
};

/**
 * Delete user account.
 */
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return sendErrorResponse(res, 404, 'User not found');
        }

        await user.destroy();
        return res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error in deleteAccount function:', error);
        return sendErrorResponse(res, 500, 'Server error');
    }
};

/**
 * Get all users.
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.json({ success: true, users });
    } catch (error) {
        console.error('Error in getAllUsers function:', error);
        return sendErrorResponse(res, 500, 'Server error');
    }
};

/**
 * Update user password.
 */
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return sendErrorResponse(res, 400, 'Old password is incorrect');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error in updatePassword function:', error);
        return sendErrorResponse(res, 500, 'Server error');
    }
};

/**
 * Forgot password: send reset link.
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return sendErrorResponse(res, 400, 'User not found');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `http://your-frontend-url/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        return res.json({ success: true, message: 'Reset link sent to your email' });
    } catch (error) {
        console.error('Error in forgotPassword function:', error);
        return sendErrorResponse(res, 500, 'Server error');
    }
};

/**
 * Reset password with token.
 */
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() },
            },
        });
        if (!user) {
            return sendErrorResponse(res, 400, 'Invalid or expired token');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error in resetPassword function:', error);
        return sendErrorResponse(res, 500, 'Server error');
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    deleteAccount,
    getAllUsers,
    updatePassword,
    forgotPassword,
    resetPassword,
};
