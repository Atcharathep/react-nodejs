const express = require('express');
const categoryController = require('../controllers/categoryController'); // ควรเป็น categoryController
const router = express.Router();

// เส้นทางการค้นหาประเภทสินค้า
router.get('/categories', categoryController.getCategories); // ฟังก์ชัน getCategories ต้องเป็น function

// เส้นทางการเพิ่มประเภทสินค้า
router.post('/categories', categoryController.addCategory); // ฟังก์ชัน addCategory ต้องเป็น function

module.exports = router;
