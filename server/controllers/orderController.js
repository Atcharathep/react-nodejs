// controllers/orderController.js
const db = require('../config/db');

// API: สร้างคำสั่งจองสินค้า
exports.createOrder = async (req, res) => {
  const { user_id, total_price, items } = req.body;

  try {
    // เริ่มต้นทำการแทรกคำสั่งจอง
    const [orderResult] = await db.promise().query('INSERT INTO orders (user_id, total_price) VALUES (?, ?)', [user_id, total_price]);
    const order_id = orderResult.insertId;

    // บันทึกข้อมูลในตาราง order_items ทีละรายการ
    const orderItemsPromises = items.map(item => {
      return db.promise().query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
        [order_id, item.product_id, item.quantity, item.price]);
    });

    // รอให้คำสั่งบันทึกทั้งหมดเสร็จสมบูรณ์
    await Promise.all(orderItemsPromises);

    // ส่งคำตอบกลับไปที่ผู้ใช้งานเมื่อคำสั่งจองและรายการสินค้าถูกบันทึกเรียบร้อยแล้ว
    res.status(201).json({ message: 'Order created successfully' });

  } catch (err) {
    // หากเกิดข้อผิดพลาดใดๆ ในการบันทึกคำสั่งจองหรือรายการสินค้า
    res.status(500).json({ error: err.message });
  }
};

// API: แก้ไขคำสั่งจองสินค้า
exports.updateOrder = async (req, res) => {
  const { order_id } = req.params;
  const { total_price, items } = req.body;

  try {
    // แก้ไขข้อมูลคำสั่งจอง
    await db.promise().query('UPDATE orders SET total_price = ? WHERE id = ?', [total_price, order_id]);

    // ลบรายการสินค้าเก่าทั้งหมดใน order_items ก่อนที่จะเพิ่มรายการใหม่
    await db.promise().query('DELETE FROM order_items WHERE order_id = ?', [order_id]);

    // บันทึกข้อมูลในตาราง order_items ใหม่
    const orderItemsPromises = items.map(item => {
      return db.promise().query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', 
        [order_id, item.product_id, item.quantity, item.price]);
    });

    // รอให้การบันทึกเสร็จสมบูรณ์
    await Promise.all(orderItemsPromises);

    // ส่งคำตอบกลับไปที่ผู้ใช้งานเมื่อคำสั่งจองได้รับการแก้ไขเรียบร้อยแล้ว
    res.status(200).json({ message: 'Order updated successfully' });

  } catch (err) {
    // หากเกิดข้อผิดพลาดใดๆ ในการแก้ไขคำสั่งจอง
    res.status(500).json({ error: err.message });
  }
};

// API: ลบคำสั่งจองสินค้า
exports.deleteOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
    // ลบข้อมูลจากตาราง order_items ก่อน
    await db.promise().query('DELETE FROM order_items WHERE order_id = ?', [order_id]);

    // ลบข้อมูลจากตาราง orders
    await db.promise().query('DELETE FROM orders WHERE id = ?', [order_id]);

    // ส่งคำตอบกลับไปที่ผู้ใช้งานเมื่อคำสั่งจองถูกลบเรียบร้อยแล้ว
    res.status(200).json({ message: 'Order deleted successfully' });

  } catch (err) {
    // หากเกิดข้อผิดพลาดในการลบคำสั่งจอง
    res.status(500).json({ error: err.message });
  }
};

// API: ค้นหาคำสั่งจองทั้งหมด
exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.promise().query('SELECT * FROM orders');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// API: ค้นหาคำสั่งจองตาม ID
exports.getOrderById = async (req, res) => {
  const { order_id } = req.params;

  try {
    const [order] = await db.promise().query('SELECT * FROM orders WHERE id = ?', [order_id]);

    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ค้นหาข้อมูลใน order_items
    const [items] = await db.promise().query('SELECT * FROM order_items WHERE order_id = ?', [order_id]);

    res.status(200).json({ order: order[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
