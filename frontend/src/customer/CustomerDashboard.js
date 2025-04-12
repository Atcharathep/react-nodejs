import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // ส่ง request ไปยัง API เพื่อนำข้อมูลสินค้ามาแสดง
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products:", error);
      });
  }, []);

  return (
    <div>
      <center>
      <h2>Customer Dashboard</h2>
      <h3>Our Products</h3>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.image_url} alt={product.name} width="100" />
          </div>
        ))}
      </div>
      </center>
    </div>
  );
};

export default CustomerDashboard;
