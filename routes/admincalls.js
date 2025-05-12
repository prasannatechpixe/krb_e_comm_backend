const express = require('express');
// import express from 'express'
const admincalls = require('../controllers/admincalls');

const router = express.Router();

// Define CRUD routes
router.post('/alluserorders', admincalls.getOrders);
router.post('/getByid/:id', admincalls.getOrderById);
// router.post('/get', );

module.exports = router;
