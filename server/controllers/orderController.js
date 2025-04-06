// controllers/orderController.js
const db = require('../config/db');

// API: สร้างคำสั่งจองสินค้า
exports.createOrder = (req, res) => {
  const { user_id, total_price, items } = req.body;

  db.query('INSERT INTO orders (user_id, total_price) VALUES (?, ?)', [user_id, total_price], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const order_id = result.insertId;

    items.forEach(item => {
      db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
      [order_id, item.product_id, item.quantity, item.price]);
    });

    res.status(201).json({ message: 'Order created successfully' });
  });
};
