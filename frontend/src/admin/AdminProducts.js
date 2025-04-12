import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingBasket, FaStore, FaUsers, FaClipboardList, FaTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ type: '', show: false, product: null });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category_id: '', image: null });
  const [updatedProduct, setUpdatedProduct] = useState({ name: '', description: '', price: '', category_id: '', image: '' });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products:", err));

    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, [products]);  // เมื่อมีการเปลี่ยนแปลงใน 'products' ก็จะดึงข้อมูลใหม่มาแสดง

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  // Filter products based on searchQuery
  const filteredProducts = products.filter(product =>
    product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle modal actions (add, edit, delete)
  const handleModal = (type, product = null) => {
    setModal({ type, show: true, product });
    if (type === 'edit' && product) {
      setUpdatedProduct({ ...product });
    } else if (type === 'add') {
      setNewProduct({ name: '', description: '', price: '', category_id: '', image: null });
    }
  };

  // Add new product
  const handleAddProduct = useCallback(() => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    formData.append('category_id', newProduct.category_id);
    if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    axios.post('http://localhost:5000/api/products', formData)
      .then((res) => {
        setProducts([...products, res.data]);
        setModal({ type: '', show: false, product: null });
        setNewProduct({ name: '', description: '', price: '', category_id: '', image: null });

        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสินค้าเรียบร้อยแล้ว!',
          showConfirmButton: false,
          timer: 2000
        });
      })
      .catch((err) => {
        console.error("Error adding product:", err);

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถเพิ่มสินค้าได้',
        });
      });
  }, [newProduct, products]);

  // Update product
  const handleUpdateProduct = useCallback(() => {
    if (modal.product) {
      const formData = new FormData();
      formData.append('name', updatedProduct.name);
      formData.append('description', updatedProduct.description);
      formData.append('price', updatedProduct.price);
      formData.append('category_id', updatedProduct.category_id);

      // Check if a new image has been selected
      if (updatedProduct.image) {
        formData.append('image', updatedProduct.image);
      }

      axios.put(`http://localhost:5000/api/products/${modal.product.id}`, formData)
        .then(() => {
          // Update the product in state immediately
          setProducts(products.map(product =>
            product.id === modal.product.id
              ? {
                ...product,
                ...updatedProduct,
                image_url: updatedProduct.image
                  ? `/uploads/${updatedProduct.image.name}`
                  : product.image_url,
              }
              : product
          ));
          setModal({ type: '', show: false, product: null });

          Swal.fire({
            icon: 'success',
            title: 'อัปเดตสินค้าสำเร็จ!',
            showConfirmButton: false,
            timer: 2000,
          });
        })
        .catch(err => {
          console.error("Error updating product:", err);

          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถอัปเดตสินค้าได้',
          });
        });

    }
  }, [modal, updatedProduct, products]);

  // Handle file input change
  const handleFileChange = (e) => {
    if (modal.type === 'add') {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    } else if (modal.type === 'edit') {
      setUpdatedProduct({ ...updatedProduct, image: e.target.files[0] });
    }
  };

  // Delete product
  const handleDelete = useCallback(() => {
    if (modal.product) {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "สินค้าจะถูกลบอย่างถาวร!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:5000/api/products/${modal.product.id}`)
            .then(() => {
              setProducts(products.filter(product => product.id !== modal.product.id));
              setModal({ type: '', show: false, product: null });

              Swal.fire({
                icon: 'success',
                title: 'ลบสินค้าสำเร็จ!',
                showConfirmButton: false,
                timer: 2000,
              });
            })
            .catch(err => {
              console.error("Error deleting product:", err);

              Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถลบสินค้าได้',
              });
            });
        }
      });
    }
  }, [modal, products]);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white d-flex flex-column p-4 position-fixed" style={{ height: '100vh', width: '250px', borderTopRightRadius: '20px', boxShadow: '2px 0 15px rgba(0, 0, 0, 0.1)' }}>
        <div className="d-flex flex-column align-items-center mb-4">
          <Link to="/admin/AdminDashboard">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaXvxLjtlHLd6kNbvjZm0oKDcJ0c4x5SkzlQ&s" alt="Logo" className="rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
          </Link>
          <Link className="navbar-brand fw-bold text-white mt-2" to="/admin/AdminDashboard">ระบบร้านเบเกอร์รี่ออนไลน์</Link>
        </div>

        <ul className="navbar-nav flex-column">
          <li className="nav-item"><Link className={`nav-link ${isActive('/admin/AdminProducts') ? 'active fw-bold' : ''}`} to="/admin/AdminProducts"><FaShoppingBasket className="me-2" /> ข้อมูลสินค้า</Link></li>
          <li className="nav-item"><Link className={`nav-link ${isActive('/admin/AdminCategories') ? 'active fw-bold' : ''}`} to="/admin/AdminCategories"><FaStore className="me-2" /> ประเภทสินค้า</Link></li>
          <li className="nav-item"><Link className={`nav-link ${isActive('/admin/AdminCustomers') ? 'active fw-bold' : ''}`} to="/admin/AdminCustomers"><FaUsers className="me-2" /> ข้อมูลลูกค้า</Link></li>
          <li className="nav-item"><Link className={`nav-link ${isActive('/admin/AdminReports') ? 'active fw-bold' : ''}`} to="/admin/AdminReports"><FaClipboardList className="me-2" /> รายงานคำสั่งซื้อ</Link></li>
        </ul>

        <button className="btn btn-outline-light mt-auto" onClick={handleLogout}>ออกจากระบบ</button>
      </div>

      {/* Main Content */}
      <div className="container-fluid ms-md-250" style={{ marginLeft: '250px' }}>
        <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>รายการสินค้า</h2>
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                className="form-control me-3"
                placeholder="ค้นหาสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={() => handleModal('add')}>
                <FaPlus className="me-2" /> เพิ่มสินค้า
              </button>
            </div>
          </div>

          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                  <div className="card shadow-sm h-100">
                    {product.image_url && (
                      <img src={`http://localhost:5000${product.image_url}`} className="card-img-top" alt={product.name} style={{ objectFit: 'cover', height: '200px' }} />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text fw-bold text-primary">฿{product.price}</p>
                      <p className="card-text"><strong>ประเภท: </strong>{product.category_name}</p>
                      <div className="d-flex justify-content-between gap-3">
                        <button className="btn btn-warning w-100" onClick={() => handleModal('edit', product)}>
                          <FaEdit className="me-2" /> แก้ไข
                        </button>

                        <button className="btn btn-danger w-100" onClick={() => handleModal('delete', product)}>
                          <FaTrashAlt className="me-2" /> ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">ยังไม่มีข้อมูลสินค้า</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Components for Add, Edit, Delete */}
      {modal.show && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modal.type === 'add' ? 'เพิ่มสินค้าใหม่' : modal.type === 'edit' ? 'แก้ไขข้อมูลสินค้า' : 'ยืนยันการลบสินค้า'}</h5>
              </div>
              <div className="modal-body">
                {modal.type !== 'delete' ? (
                  <form>
                    <div className="mb-3">
                      <label htmlFor="productName" className="form-label">ชื่อสินค้า</label>
                      <input
                        type="text"
                        className="form-control"
                        id="productName"
                        value={modal.type === 'add' ? newProduct.name : updatedProduct.name}
                        onChange={(e) => modal.type === 'add'
                          ? setNewProduct({ ...newProduct, name: e.target.value })
                          : setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="productDescription" className="form-label">คำอธิบาย</label>
                      <textarea
                        className="form-control"
                        id="productDescription"
                        rows="3"
                        value={modal.type === 'add' ? newProduct.description : updatedProduct.description}
                        onChange={(e) => modal.type === 'add'
                          ? setNewProduct({ ...newProduct, description: e.target.value })
                          : setUpdatedProduct({ ...updatedProduct, description: e.target.value })
                        }
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="productPrice" className="form-label">ราคา</label>
                      <input
                        type="number"
                        className="form-control"
                        id="productPrice"
                        value={modal.type === 'add' ? newProduct.price : updatedProduct.price}
                        onChange={(e) => modal.type === 'add'
                          ? setNewProduct({ ...newProduct, price: e.target.value })
                          : setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="productCategory" className="form-label">ประเภทสินค้า</label>
                      <select
                        className="form-control"
                        id="productCategory"
                        value={modal.type === 'add' ? newProduct.category_id : updatedProduct.category_id}
                        onChange={(e) => modal.type === 'add'
                          ? setNewProduct({ ...newProduct, category_id: e.target.value })
                          : setUpdatedProduct({ ...updatedProduct, category_id: e.target.value })
                        }
                      >
                        <option value="">เลือกประเภทสินค้า</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    {modal.type === 'add' && (
                      <div className="mb-3">
                        <label htmlFor="productImage" className="form-label">เลือกรูปภาพ</label>
                        <input
                          type="file"
                          className="form-control"
                          id="productImage"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                    {modal.type === 'edit' && (
                      <div className="mb-3">
                        <label htmlFor="productImage" className="form-label">เลือกรูปภาพใหม่ (ถ้ามี)</label>
                        <input
                          type="file"
                          className="form-control"
                          id="productImage"
                          onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.files[0] })}
                        />
                        {updatedProduct.image && (
                          <div className="mt-2">
                            <strong>รูปภาพปัจจุบัน:</strong>
                            <img
                              src={`http://localhost:5000${modal.product.image_url}`}
                              alt="Current Product"
                              className="img-fluid"
                              style={{ maxHeight: '100px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                  </form>
                ) : (
                  <p>คุณต้องการลบสินค้านี้ใช่ไหม?</p>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModal({ type: '', show: false, product: null })}>ปิด</button>
                <button className={`btn ${modal.type === 'delete' ? 'btn-danger' : 'btn-primary'}`} onClick={modal.type === 'delete' ? handleDelete : modal.type === 'add' ? handleAddProduct : handleUpdateProduct}>
                  {modal.type === 'delete' ? 'ลบ' : modal.type === 'add' ? 'บันทึกสินค้า' : 'อัปเดตสินค้า'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
