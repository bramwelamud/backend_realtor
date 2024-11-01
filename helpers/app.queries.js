// user.queries.js
const db = require('../config/db.connect'); // Adjust the path to your database connection file

const queryCheckUserLoginDT = (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?'; // Adjust table name
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return reject(err);
            }
            if (results.length > 0) {
                // Email exists
                resolve({ status: 'error', message: 'Email already in use' });
            } else {
                // Email is available
                resolve({ status: 'ok' });
            }
        });
    });
};

module.exports = { queryCheckUserLoginDT };
