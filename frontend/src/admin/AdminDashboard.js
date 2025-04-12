import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingBasket, FaStore, FaUsers, FaClipboardList } from 'react-icons/fa'; // ใช้ไอคอนจาก react-icons

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5000/orders')
      .then(response => setOrders(response.data))
      .catch(error => console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white d-flex flex-column p-4 position-fixed" style={{ height: '100vh', width: '250px', borderTopRightRadius: '20px', boxShadow: '2px 0 15px rgba(0, 0, 0, 0.1)' }}>
        <div className="d-flex flex-column align-items-center mb-4">
          <Link to="/admin/AdminDashboard">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaXvxLjtlHLd6kNbvjZm0oKDcJ0c4x5SkzlQ&s"
              alt="Logo"
              className="rounded-circle"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
          </Link>
          <Link className="navbar-brand fw-bold text-white mt-2" to="/admin/AdminDashboard">
            ระบบร้านเบเกอร์รี่ออนไลน์
          </Link>
        </div>

        <ul className="navbar-nav flex-column">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/AdminProducts') ? 'active fw-bold' : ''}`} to="/admin/AdminProducts">
              <FaShoppingBasket className="me-2" /> ข้อมูลสินค้า
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/AdminCategories') ? 'active fw-bold' : ''}`} to="/admin/AdminCategories">
              <FaStore className="me-2" /> ประเภทสินค้า
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/AdminCustomers') ? 'active fw-bold' : ''}`} to="/admin/AdminCustomers">
              <FaUsers className="me-2" /> ข้อมูลลูกค้า
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/admin/AdminReports') ? 'active fw-bold' : ''}`} to="/admin/AdminReports">
              <FaClipboardList className="me-2" /> รายงานคำสั่งซื้อ
            </Link>
          </li>
        </ul>

        <button className="btn btn-outline-light mt-auto" onClick={handleLogout}>
          ออกจากระบบ
        </button>
      </div>

      {/* Main Content */}
      <div className="container-fluid ms-md-250" style={{ marginLeft: '250px' }}>
        <div className="container mt-5">
          <h2 className="mb-4">คำสั่งซื้อทั้งหมด</h2>
          <div className="row">
            {orders.length > 0 ? orders.map(order => (
              <div key={order.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm h-100 border border-light">
                  <div className="card-body">
                    <h5 className="card-title">คำสั่งซื้อ #{order.id}</h5>
                    <p className="card-text">ผู้ใช้งาน: {order.user_id}</p>
                    <p className="card-text">ยอดรวม: <strong className="text-success">฿{order.total_price}</strong></p>
                    <p className="card-text">สถานะ:
                      <span className="badge bg-info text-dark ms-2">{order.status}</span>
                    </p>
                    <p className="card-text text-muted mt-2">
                      สร้างเมื่อ: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-muted">ไม่มีคำสั่งซื้อในระบบ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
