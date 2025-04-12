import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // ✅ เพิ่มตรงนี้

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/signup', {
        name,
        email,
        password,
        phone,
        address,
      });

      setSuccessMessage('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');
      setError('');
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4 mt-5">
            <h2 className="text-center mb-4">สมัครสมาชิก</h2>
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="name">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="ชื่อ-นามสกุล"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="email">อีเมล</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="อีเมล"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="password">รหัสผ่าน</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  placeholder="เบอร์โทรศัพท์"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="address">ที่อยู่</label>
                <input
                  type="text"
                  id="address"
                  className="form-control"
                  placeholder="ที่อยู่"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-4">
                สมัครสมาชิก
              </button>

              {/* ✅ ปุ่มย้อนกลับไปหน้า Login */}
              <div className="text-center mt-3">
                <Link to="/login" className="btn btn-link">
                  กลับไปหน้าเข้าสู่ระบบ
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
