const express = require('express');
const brandController = require('../controllers/brandsAndCategories');

const router = express.Router();

// Define CRUD routes
router.post('/create', brandController.createBrand);
router.post('/getbrandorcats', brandController.getBrandsOrcategories);
router.get('/brandsWithProducts', brandController.brandsWithProducts);
router.get('/categoriesWithProducts', brandController.categoriesWithProducts);

module.exports = router;
