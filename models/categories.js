const { DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

const Categories = sequelize.define('Categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    Category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
})

module.exports = Categories;