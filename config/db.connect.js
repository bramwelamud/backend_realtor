const util = require('util')
const dotenv = require('dotenv').config();
const mysql = require("mysql2");
const config = require('./db.config');

const pool = mysql.createPool({
    connectionLimit: 150,
    host: config.mySQLConfig.host,
    user:config.mySQLConfig.user,
    password:config.mySQLConfig.password,
    database:config.mySQLConfig.database,
    port:config.mySQLConfig.port,
    multipleStatements: true
})

// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  }
  console.log("Successfully POOL connected to the database.");
  if (connection) connection.release()

  return
})

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

module.exports = pool