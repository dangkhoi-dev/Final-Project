import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import ProductCard from '../shared/ProductCard';
import Banner from '../../components/Banner';
import './HomePage.css';

const HomePage = () => {
  const { products, handleViewDetails } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Chào mừng đến với E-Shop</h1>
        <p className="text-gray-600 mt-2">Nơi mua sắm trực tuyến tốt nhất cho bạn.</p>
      </div>
      
      {/* Banner Carousel */}
      <Banner />
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sản phẩm nổi bật</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        {products.filter(product => product.status === 'approved').slice(0, 4).map(product => (
          <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
        ))}
      </div>
      <div className="text-center mt-8">
        <button 
          onClick={() => navigate('/products')} 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '14px 32px',
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
          🔍 Xem tất cả sản phẩm
        </button>
      </div>
    </div>
  );
};

export default HomePage;
