const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

// Define CRUD routes
router.post('/', cartController.getCarts);
router.post('/byId/:id', cartController.getCartById);
router.post('/create', cartController.createCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);
router.post('/cartcount', cartController.cartcount);
module.exports = router;
