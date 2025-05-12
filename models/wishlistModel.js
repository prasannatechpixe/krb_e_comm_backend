const { DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  productId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('now'), // Ensures the default is the current timestamp
    allowNull: false, // Ensures the column cannot have NULL values
    field: 'createdAt', // Ensures it maps to the correct column name
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.fn('now'), // Ensures the default is the current timestamp
    allowNull: false, // Ensures the column cannot have NULL values
    field: 'updatedAt', // Ensures it maps to the correct column name
  },
});

module.exports = Wishlist;
