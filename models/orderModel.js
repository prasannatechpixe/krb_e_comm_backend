const { DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

const Order = sequelize.define('Orders', {
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
    defaultValue: '0',
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Credit Card', 'Debit Card', 'PayPal', 'UPI', 'Bank Transfer', 'Other']],
    },
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

module.exports = Order;
