// routes/productRoutes.js
const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// เส้นทางการค้นหาสินค้า
router.get('/products', productController.getProducts);

// เส้นทางการเพิ่มสินค้า
router.post('/products', productController.addProduct);

module.exports = router;
