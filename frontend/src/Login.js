import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';  // ใช้ useNavigate แทน useHistory ใน react-router-dom v6

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // ใช้ navigate สำหรับการเปลี่ยนเส้นทาง

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ส่งข้อมูลการล็อคอินไปยัง backend
      const response = await axios.post('http://localhost:5000/api/login', { email, password });

      // ถ้าการล็อคอินสำเร็จ
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Decode token เพื่อดึง role
      const decodedToken = JSON.parse(atob(token.split('.')[1]));  // Decode JWT token
      const userRole = decodedToken.role;

      // หากเป็น admin, นำไปที่หน้าแอดมิน
      if (userRole === 'admin') {
        navigate('/admin/AdminDashboard');  // ใช้ navigate แทน history.push()
      } else {
        // หากเป็น user, นำไปที่หน้าลูกค้า
        navigate('/customer/CustomerDashboard');  // ใช้ navigate แทน history.push()
      }
    } catch (error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow p-4 mt-5">
            <h2 className="text-center mb-4">เข้าสู่ระบบ</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">อีเมล</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="กรอกอีเมล"
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
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3">
                เข้าสู่ระบบ
              </button>
            </form>

            {/* ปุ่มไปหน้าลงทะเบียน */}
            <div className="mt-3 text-center">
              <p>ยังไม่มีบัญชี? <Link to="/signup">ลงทะเบียนที่นี่</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
