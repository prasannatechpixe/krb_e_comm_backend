const { DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

const Address = sequelize.define('billing_addresses', {
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
    fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    addressLine: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    postalCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true,
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

module.exports = Address;
