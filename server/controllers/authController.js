const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// สมัครลูกค้าใหม่
exports.signup = (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password || !phone || !address) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเช็คอีเมล' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้ไปแล้ว' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน' });

      db.query(
        'INSERT INTO users (name, email, password, phone, address, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [name, email, hashedPassword, phone, address],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลลูกค้า' });
          }
          res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
        }
      );
    });
  });
};

// ล็อกอิน
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = results[0];

    // ตรวจสอบรหัสผ่าน
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน' });

      if (!isMatch) {
        return res.status(400).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }

      // สร้าง JWT token พร้อม role
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },  // ส่ง role ไปด้วย
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'ล็อกอินสำเร็จ', token });
    });
  });
};
