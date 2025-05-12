const express = require('express');
// import express from 'express'
const billingAddressesController = require('../controllers/addresses');

const router = express.Router();

// Define CRUD routes
router.post('/create', billingAddressesController.CreateBillingAddresses);
router.post('/update', billingAddressesController.UpdateBillingAddresses);
router.post('/get', billingAddressesController.GetBillingAddresses);

module.exports = router;
