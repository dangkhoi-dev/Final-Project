import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useNotification } from '../../contexts/NotificationContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, handleAddToCart, currentUser } = useAppContext();
  const { showWarning } = useNotification();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === parseInt(id) && p.status === 'approved');

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  const handleAddToCartClick = () => {
    handleAddToCart(product, quantity); // Logic kiểm tra đã được xử lý trong AppContext
  };

  if (!product) {
    return null;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-layout">
        <div className="product-image-section">
          <img className="product-detail-image" src={product.image} alt={product.name} />
        </div>
        <div className="product-info-section">
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-detail-price">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </p>
          <p className="product-description">{product.description}</p>
          <div className="quantity-section">
            <label htmlFor="quantity" className="quantity-label">Số lượng:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="quantity-input"
            />
          </div>
          {!currentUser ? (
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <p className="text-yellow-800 font-medium">Bạn cần đăng nhập để mua sản phẩm</p>
                </div>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/login')} 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    marginTop: '10px',
                    marginBottom: '10px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  🔐 Đăng nhập để mua
                </button>
                <button 
                  onClick={() => navigate('/register')} 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(107, 114, 128, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.3)';
                  }}
                >
                  ✨ Tạo tài khoản mới
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleAddToCartClick} 
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              {currentUser ? 
                (currentUser.role === 'customer' ? '🛒 Thêm vào giỏ hàng' : '👤 Chỉ khách hàng mới có thể mua') :
                '🔐 Đăng nhập để mua'
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
