// routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();

// เส้นทางการสร้างคำสั่งซื้อ
router.post('/orders', orderController.createOrder);

module.exports = router;
