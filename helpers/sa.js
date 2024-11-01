const bcrypt = require('bcryptjs'); // Make sure you have bcryptjs installed

async function comparePassword(plainPassword, hashedPassword) {
    try {
        // Compare the provided plaintext password with the hashed password
        const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);

        if (passwordMatch) {
            console.log('Password matches!');
            return true; // Password is correct
        } else {
            console.log('Password does not match');
            return false; // Password is incorrect
        }
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error; // Rethrow the error for further handling
    }
}

// Example usage
(async () => {
    const plainPassword = '11111'; // The password you want to check
    const hashedPassword = '$2b$10$F6z3K2.P46J8ZEu38I46SeZnRXSeNw3xn.hEAu7LTJSUZFVuEwc2e'; // Example hashed password from your database

    const isMatch = await comparePassword(plainPassword, hashedPassword);
    console.log('Password match result:', isMatch);
})();
