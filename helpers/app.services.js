// app.services.js
var jwt = require("jwt-simple");
var moment = require("moment");
const dotenv = require('dotenv').config();
const token_secret = process.env.TOKEN_SECRET || "laD@i-dLad-thisAGLGenToken-UniqueteComposeDecret";
const crypto = require('crypto');

const pool = require('../config/db.connect');

exports.createToken = function (userId) {
  var payload = {
    sub: userId,
    iat: moment().unix(),
    exp: moment().add(60, "days").unix(),
  };
  return jwt.encode(payload, token_secret);
};


// services/invitationService.js
'use strict';

 // Ensure you have your database connection set up

// Function to generate a unique invitation link
let generateLinkInvitation = async function(user_email, user_type) {
    // Check if the user type is valid
    const validUserTypes = ['realtor', 'landlord', 'company'];
    if (!validUserTypes.includes(user_type)) {
        throw new Error("Invalid user type. Must be one of: realtor, landlord, company.");
    }

    // Generate a unique token using crypto
    const token = crypto.randomBytes(32).toString('hex');

    // Set expiration time (48 hours from now)
    const expiresAt = moment().add(48, 'hours').toISOString();

    try {
        // Store the token and expiration time in the database
        await pool.query(
            'INSERT INTO invitation_links (email, token, expires_at, user_type) VALUES (?, ?, ?, ?)',
            [user_email, token, expiresAt, user_type]
        );

        // Construct the invitation link
        const invitationLink = `${process.env.APP_URL_FRONTEND}/invite?token=${token}&type=${user_type}`;

        return {
            message: "Invitation link generated successfully.",
            link: invitationLink,
            expires_at: expiresAt
        };
    } catch (error) {
        throw new Error("Error generating invitation link: " + error.message);
    }
};

// Function to validate the invitation token
const validateInvitationToken = async (token) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM invitation_links WHERE token = ?',
            [token]
        );

        if (rows.length === 0) {
            return { valid: false, message: "Invalid token." };
        }

        const invitation = rows[0];

        // Check if the token is expired
        if (moment().isAfter(invitation.expires_at)) {
            return { valid: false, message: "Token has expired." };
        }

        return { valid: true, invitation };
    } catch (error) {
        throw new Error("Error validating invitation token: " + error.message);
    }
};

// Exporting the functions
module.exports = {
    generateLinkInvitation,
    validateInvitationToken
};
