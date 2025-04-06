// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// เส้นทางสมัครสมาชิก
router.post('/signup', authController.signup);

// เส้นทางเข้าสู่ระบบ
router.post('/login', authController.login);

module.exports = router;
