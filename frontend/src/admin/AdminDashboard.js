import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // ส่ง request ไปยัง API เพื่อดึงข้อมูลคำสั่งซื้อทั้งหมด
    axios.get('http://localhost:5000/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the orders:", error);
      });
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Orders</h3>
      <div className="order-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <h4>Order ID: {order.id}</h4>
            <p>Total Price: ${order.total_price}</p>
            <p>Status: {order.status}</p>
            <p>User ID: {order.user_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
