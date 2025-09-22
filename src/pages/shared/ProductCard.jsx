import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onViewDetails }) => {
  const { currentUser, handleAddToCart } = useAppContext();
  const { showWarning } = useNotification();
  const navigate = useNavigate();

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Ngăn việc click vào card
    handleAddToCart(product, 1); // Logic kiểm tra đã được xử lý trong AppContext
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => onViewDetails(product)}>
      <div className="flex items-center p-4">
        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
        <div className="flex-grow ml-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-blue-600 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={handleAddToCartClick}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              whiteSpace: 'nowrap'
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
              (currentUser.role === 'customer' ? '🛒 Thêm vào giỏ' : '👤 Chỉ khách hàng') :
              '🔐 Đăng nhập để mua'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
