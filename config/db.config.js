// dbConfig.js
// define connection config for the database
const dotenv = require('dotenv').config();

module.exports={
    localhost: '127.0.0.1',

    mySQLConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        timeout: 34000
    }
   
}