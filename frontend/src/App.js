import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';  // หน้าหลัก
import Login from './Login'; // หน้าล็อคอิน
import Signup from './Signup';  // หน้าสมัครสมาชิก
import AdminDashboard from './admin/AdminDashboard';
import CustomerDashboard from './customer/CustomerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/customer/CustomerDashboard" element={<CustomerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
