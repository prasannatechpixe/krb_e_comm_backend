const { Sequelize } = require('sequelize');

// Configure your PostgreSQL database connection
const sequelize = new Sequelize('krbmd_production_db', 'postgres', 'SriKrishna@2', {
  host: '147.79.71.46', // Replace with your PostgreSQL server address
  dialect: 'postgres', // Specify PostgreSQL as the dialect
  port: 5432, // Default PostgreSQL port (change if necessary)
  logging: false, // Set to true for detailed query logs
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('sequelize connection is done.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
  }
})();

module.exports = sequelize;
