// dbConfig.js
// define connection config for the database
const dotenv = require('dotenv').config();

module.exports={
    localhost: '127.0.0.1',

    mySQLConfig: {
        host: '127.0.0.1',
        user: 're_login',
        port:'3306',
        password:'123456789',
        database: 're',
        timeout: 60000
    }
   
}