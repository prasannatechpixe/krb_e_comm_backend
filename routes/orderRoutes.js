const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.getOrders);
router.post('/byid/:id', orderController.getOrderById);
router.put('/:id', orderController.UpdateOrder);
router.delete('/:id', orderController.deleteOrder);
router.post('/create', orderController.createOrder);

module.exports = router;
