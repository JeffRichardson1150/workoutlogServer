const Sequelize = require('sequelize');
// Create an instance of Sequelize and connect to the database - for postgres, provide the DB name, Username, Password, host, and dialect
const sequelize = new Sequelize(process.env.DATABASE_NAME, 'postgres', process.env.PASS, {
    host: 'localhost',
    dialect: 'postgres'
}); 

// Test whether the connection to the database was successful
sequelize.authenticate()
    .then(() => console.log('************ from db.js ---- database is connected  ********************'))
    .catch((err) => console.log(err));

module.exports = sequelize;