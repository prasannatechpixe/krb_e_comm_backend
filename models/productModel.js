const { DataTypes } = require('sequelize');
const sequelize = require('../db/postgres');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price_in_usd: {
    type: DataTypes.DECIMAL(10, 2), // Correct way to use DECIMAL
    allowNull: false,
    defaultValue: 0.00,
  },
  price_in_inr: {
    type: DataTypes.DECIMAL(10, 2), // Correct way to use DECIMAL
    allowNull: false,
    defaultValue: 0.00,
  },
  discountPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brandId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  useCase: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  images: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [], // Default is an empty array
  },
  showIn: {
    type: DataTypes.JSONB,
    defaultValue: ['All'], // Default is ['All']
    allowNull: false,
  },
  tags: {
    type: DataTypes.STRING, // For search optimization and filtering
    allowNull: true,
  },
  Availability: {
    type: DataTypes.ENUM('In Stock', 'Out of Stock', 'Pre-order'),
    defaultValue: 'In Stock', // Default is In Stock. Can be 'In Stock', 'Out of Stock', 'Pre-order'
  },
  specifications: {
    type: DataTypes.JSONB, // Key-value pairs for specifications like color, size, etc.
    allowNull: true,
    defaultValue: [],
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  youtubeLinks: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  manual: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  product_details: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  multiShowIn: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  },
  features: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
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

module.exports = Product;