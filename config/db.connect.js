const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('development_database', 'roo', '12345', {
    host: '127.0.0.1', 
    dialect: 'mysql',
    port: 3306,
    logging: (msg) => console.log(msg), 
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        console.error('Error stack:', error.stack);
    }
}

// Call the function to test the connection
testConnection();

module.exports = sequelize;
