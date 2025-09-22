import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotification } from '../../../contexts/NotificationContext';

// CSS animation cho spin
const spinAnimation = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinAnimation;
  document.head.appendChild(style);
}

const ShopAddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct, currentUser } = useAppContext();
  const { showSuccess, showError } = useNotification();

  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    stock: '',
    specifications: '',
    brand: '',
    tags: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Thời trang nam',
    'Thời trang nữ', 
    'Giày dép',
    'Phụ kiện',
    'Đồ điện tử',
    'Sách & Văn phòng phẩm',
    'Nhà cửa & Đời sống',
    'Thể thao & Du lịch'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL preview cho ảnh
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Lưu file để upload sau
      setProduct(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!product.name || !product.price || !product.description || !product.category) {
        showError('Vui lòng điền đầy đủ thông tin bắt buộc!');
        setIsSubmitting(false);
        return;
      }

      if (parseFloat(product.price) <= 0) {
        showError('Giá sản phẩm phải lớn hơn 0!');
        setIsSubmitting(false);
        return;
      }

      // Tạo sản phẩm mới
      const newProduct = {
        shopId: currentUser.id,
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        category: product.category,
        image: product.image instanceof File ? URL.createObjectURL(product.image) : product.image,
        stock: parseInt(product.stock) || 0,
        specifications: product.specifications,
        brand: product.brand,
        tags: product.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'pending',
        submittedAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0
      };

      // Thêm sản phẩm vào hệ thống
      addProduct(newProduct);
      
      showSuccess('Sản phẩm đã được đăng bán thành công! Đang chờ admin duyệt.');
      navigate('/shop/products');
      
    } catch (error) {
      showError('Có lỗi xảy ra khi đăng bán sản phẩm. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      image: '',
      stock: '',
      specifications: '',
      brand: '',
      tags: ''
    });
    setImagePreview('');
  };

  return (
    <div className="shop-add-product-container p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">➕ Đăng bán sản phẩm mới</h1>
        <button
          onClick={() => navigate('/shop/products')}
          style={{
            backgroundColor: '#e5e7eb',
            color: '#1f2937',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '2px solid #d1d5db',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d1d5db';
            e.target.style.borderColor = '#9ca3af';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#e5e7eb';
            e.target.style.borderColor = '#d1d5db';
          }}
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Thông tin cơ bản */}
          <div className="space-y-6">
            <div style={{ 
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
              padding: '24px', 
              borderRadius: '12px', 
              border: '2px solid #0ea5e9',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #0ea5e9'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', 
                  borderRadius: '50%', 
                  width: '48px', 
                  height: '48px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(14, 165, 233, 0.3)'
                }}>
                  📝
                </div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#0c4a6e',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  Thông tin cơ bản
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#0c4a6e', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '18px' }}>🏷️</span>
                    Tên sản phẩm 
                    <span style={{ color: '#dc2626', fontSize: '18px' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid #e0f2fe',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#0c4a6e',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0f2fe';
                      e.target.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#0c4a6e', 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontSize: '18px' }}>💰</span>
                      Giá (VND) 
                      <span style={{ color: '#dc2626', fontSize: '18px' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        style={{
                          width: '100%',
                          padding: '16px',
                          border: '2px solid #e0f2fe',
                          borderRadius: '10px',
                          fontSize: '16px',
                          color: '#0c4a6e',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#0ea5e9';
                          e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e0f2fe';
                          e.target.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.1)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                        placeholder="0"
                        min="0"
                        step="1000"
                        required
                      />
                      <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#0c4a6e',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        VND
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#0c4a6e', 
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontSize: '18px' }}>📦</span>
                      Số lượng tồn kho
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={product.stock}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px solid #e0f2fe',
                        borderRadius: '10px',
                        fontSize: '16px',
                        color: '#0c4a6e',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0f2fe';
                        e.target.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#0c4a6e', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '18px' }}>📂</span>
                    Danh mục 
                    <span style={{ color: '#dc2626', fontSize: '18px' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '16px 50px 16px 16px',
                        border: '2px solid #e0f2fe',
                        borderRadius: '10px',
                        fontSize: '16px',
                        color: '#0c4a6e',
                        backgroundColor: '#ffffff',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)',
                        appearance: 'none',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0ea5e9';
                        e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0f2fe';
                        e.target.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <div style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#0ea5e9',
                      fontSize: '16px',
                      pointerEvents: 'none'
                    }}>
                      ▼
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#0c4a6e', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '18px' }}>🏢</span>
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={product.brand}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid #e0f2fe',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#0c4a6e',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0f2fe';
                      e.target.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    placeholder="Nhập thương hiệu"
                  />
                </div>

                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#0c4a6e', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '18px' }}>🏷️</span>
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={product.tags}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '2px solid #e0f2fe',
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#0c4a6e',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(14, 165, 233, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9';
                      e.target.style.boxShadow = '0 0 0 4px rgba(14, 165, 233, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0f2fe';
                      e.target.style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    placeholder="ví dụ: mới, hot, sale"
                  />
                </div>
              </div>
            </div>

            {/* Mô tả sản phẩm */}
            <div style={{ 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
              padding: '24px', 
              borderRadius: '12px', 
              border: '2px solid #22c55e',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #22c55e'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)', 
                  borderRadius: '50%', 
                  width: '48px', 
                  height: '48px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)'
                }}>
                  📄
                </div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#14532d',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  Mô tả sản phẩm
                </h2>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#14532d', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '18px' }}>📝</span>
                  Mô tả chi tiết 
                  <span style={{ color: '#dc2626', fontSize: '18px' }}>*</span>
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #dcfce7',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#14532d',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(34, 197, 94, 0.1)',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#dcfce7';
                    e.target.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  placeholder="Mô tả chi tiết về sản phẩm, đặc điểm nổi bật, chất liệu, cách sử dụng..."
                  required
                />
              </div>

              <div>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#14532d', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '18px' }}>⚙️</span>
                  Thông số kỹ thuật
                </label>
                <textarea
                  name="specifications"
                  value={product.specifications}
                  onChange={handleInputChange}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #dcfce7',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#14532d',
                    backgroundColor: '#ffffff',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(34, 197, 94, 0.1)',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                    e.target.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#dcfce7';
                    e.target.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                  placeholder="Kích thước, trọng lượng, chất liệu, màu sắc..."
                />
              </div>
            </div>
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="space-y-6">
            <div style={{ 
              background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', 
              padding: '24px', 
              borderRadius: '12px', 
              border: '2px solid #a855f7',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #a855f7'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  background: 'linear-gradient(135deg, #a855f7, #9333ea)', 
                  borderRadius: '50%', 
                  width: '48px', 
                  height: '48px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(168, 85, 247, 0.3)'
                }}>
                  🖼️
                </div>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#581c87',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                  Hình ảnh sản phẩm
                </h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#581c87', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '18px' }}>📷</span>
                    Ảnh sản phẩm chính
                  </label>
                  
                  {/* Custom File Input */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{
                      width: '100%',
                      padding: '20px',
                      border: '2px dashed #c084fc',
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#a855f7';
                      e.currentTarget.style.backgroundColor = '#faf5ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#c084fc';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}>
                      <div style={{ fontSize: '32px', color: '#a855f7' }}>📁</div>
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#581c87' 
                      }}>
                        Chọn ảnh sản phẩm
                      </div>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#6b7280' 
                      }}>
                        Kéo thả hoặc click để chọn file
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    marginTop: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#f3e8ff',
                    borderRadius: '6px',
                    border: '1px solid #c084fc'
                  }}>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#581c87', 
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span>ℹ️</span>
                      Hỗ trợ: JPG, PNG, GIF. Kích thước tối đa: 5MB
                    </p>
                  </div>
                </div>

                {imagePreview && (
                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#581c87', 
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ fontSize: '18px' }}>👁️</span>
                      Xem trước ảnh
                    </label>
                    <div style={{ 
                      border: '2px solid #c084fc', 
                      borderRadius: '12px', 
                      padding: '20px', 
                      backgroundColor: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(168, 85, 247, 0.1)',
                      position: 'relative'
                    }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ 
                          maxWidth: '100%', 
                          height: '280px', 
                          objectFit: 'contain', 
                          margin: '0 auto', 
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#f3e8ff',
                        color: '#581c87',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        border: '1px solid #c084fc'
                      }}>
                        Preview
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '12px 32px',
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              borderRadius: '8px',
              border: '2px solid #d1d5db',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            🔄 Làm mới
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 32px',
              backgroundColor: isSubmitting ? '#e5e7eb' : '#f3e8ff',
              color: isSubmitting ? '#6b7280' : '#581c87',
              borderRadius: '8px',
              border: '2px solid #c084fc',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#e9d5ff';
                e.target.style.borderColor = '#a855f7';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#f3e8ff';
                e.target.style.borderColor = '#c084fc';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                Đang đăng bán...
              </>
            ) : (
              <>
                <span>📤</span>
                Đăng bán sản phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopAddProductPage;
