// controllers/productController.js
const db = require('../config/db');

// API: ค้นหาสินค้าทั้งหมด
exports.getProducts = (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// API: เพิ่มสินค้าใหม่
exports.addProduct = (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;

  if (!name || !description || !price || !category_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query('INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)', 
  [name, description, price, image_url, category_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Product added successfully', product_id: result.insertId });
  });
};
