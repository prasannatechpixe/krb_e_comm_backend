const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/checkorderstatus', paymentController.checkOrderStatus);

module.exports = router;
