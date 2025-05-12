const { DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneno: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
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
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profilepic: {
    type: DataTypes.STRING,
    defaultValue: 'https://myaltpay.fra1.cdn.digitaloceanspaces.com/profile.png',
  },
});

module.exports = User;
