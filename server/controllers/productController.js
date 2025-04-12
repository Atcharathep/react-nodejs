const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ตั้งค่า multer สำหรับอัปโหลดรูป
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // โฟลเดอร์เก็บรูป
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); // ตั้งชื่อไฟล์
  }
});

// ฟิลเตอร์สำหรับไฟล์ที่อนุญาตให้อัปโหลด
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

// ตั้งค่าการอัปโหลด
exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// API: ค้นหาสินค้าทั้งหมด
exports.getProducts = (req, res) => {
  db.query(
    `SELECT 
      a.id, a.name, a.description, a.price, a.image_url, 
      b.id AS category_id, b.name AS category_name 
     FROM products AS a 
     INNER JOIN product_categories AS b 
     ON a.category_id = b.id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

// API: เพิ่มสินค้าใหม่
exports.addProduct = (req, res) => {
  const { name, description, price, category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null; // ตรวจสอบว่าอัปโหลดรูปมาหรือไม่

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
  if (!name || !description || !price || !category_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // เพิ่มข้อมูลสินค้าใหม่ในฐานข้อมูล
  db.query(
    'INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
    [name, description, price, image_url, category_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Product added successfully', product_id: result.insertId });
    }
  );
};

// API: แก้ไขข้อมูลสินค้า
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นครบหรือไม่
  if (!name || !description || !price || !category_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ถ้ามีการอัปโหลดไฟล์ใหม่, ลบไฟล์เดิมที่ไม่ใช้แล้ว
  if (req.file) {
    db.query('SELECT image_url FROM products WHERE id = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const oldImage = results[0]?.image_url;
      if (oldImage) {
        const oldImagePath = path.join(__dirname, '../', oldImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
    });
  }

  // คำสั่ง SQL สำหรับอัปเดตข้อมูลสินค้า
  const query = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ? WHERE id = ?';

  db.query(
    query,
    [name, description, price, image_url, category_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
};

// API: ลบสินค้า
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  // ค้นหาภาพสินค้าก่อนลบ
  db.query('SELECT image_url FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const imageUrl = results[0]?.image_url;
    if (imageUrl) {
      const imagePath = path.join(__dirname, '../', imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        }
      });
    }

    // ลบข้อมูลสินค้าจากฐานข้อมูล
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    });
  });
};
