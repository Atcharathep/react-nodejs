const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const router = express.Router();

// ตั้งค่าการอัปโหลดไฟล์โดยใช้ multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // กำหนดที่เก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ที่ไม่ซ้ำกัน
  },
});

const upload = multer({ storage: storage });

// เส้นทางการค้นหาสินค้า
router.get('/products', productController.getProducts);

// เส้นทางการเพิ่มสินค้า (รองรับการอัปโหลดรูปภาพ)
router.post('/products', upload.single('image'), productController.addProduct);

// เส้นทางการแก้ไขสินค้า (รองรับการอัปโหลดรูปภาพ)
router.put('/products/:id', upload.single('image'), productController.updateProduct);

// เส้นทางการลบสินค้า
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
