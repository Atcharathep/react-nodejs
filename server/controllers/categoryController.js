// controllers/categoryController.js
const db = require('../config/db');

// API: ค้นหาประเภทสินค้า
exports.getCategories = (req, res) => {
  db.query('SELECT * FROM product_categories', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// API: เพิ่มประเภทสินค้า
exports.addCategory = (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  db.query('INSERT INTO product_categories (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Category added successfully', category_id: result.insertId });
  });
};
