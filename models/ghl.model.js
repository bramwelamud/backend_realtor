const db = require('../config/db.connect'); // Database connection
const axios = require('axios'); // HTTP client for sending requests
const dotenv = require('dotenv').config(); // Ensure you're using environment variables correctly

// Function to get user data and send to the webhook
async function sendUserDataToGhl() {
  try {
    // Use setInterval to run the code block every 3 seconds (3000 milliseconds)
    setInterval(async () => {
      try {
        // Fetch user data from the database (adjust query to match your schema)
        const [users] = await db.query("SELECT user_firstname, user_lastname, user_phone_number, user_email FROM users WHERE status = 'active'");

        if (users && users.length > 0) {
          // Loop through each active user and send their data to the webhook
          for (const user of users) {
            // Destructure the user fields from the result
            const { user_firstname, user_lastname, user_phone_number, user_email } = user;

            // Prepare additional data fields like user type and part
            const userData = {
              user_login_username: user_email,      // Use email as the login username
              user_link_id: AppHelper.app_make_id(6), // Generate a unique link ID
              user_firstname,                       // User's first name
              user_lastname,                        // User's last name
              user_phone_number,                    // User's phone number
              user_type: "user",                    // Fixed user type
              user_part_of: "tenant",               // Fixed part (tenant)
              // You can add other fields as needed
            };

            // Send the data to the webhook
            await axios.post(process.env.WEBHOOK_URL, userData)
              .then(response => {
                console.log(`Successfully sent data for user ${user_firstname} ${user_lastname} to the webhook`);
              })
              .catch(error => {
                console.error(`Error sending data for user ${user_firstname} ${user_lastname}:`, error.message);
              });
          }
        } else {
          console.log('No active users found to send.');
        }
      } catch (dbError) {
        console.error('Error fetching users from the database:', dbError.message);
      }
    }, 3000); // Repeat every 3 seconds
  } catch (error) {
    console.error('Error in sendUserDataToGhl function:', error.message);
  }
}

// Call the function to start sending user data
sendUserDataToGhl();
