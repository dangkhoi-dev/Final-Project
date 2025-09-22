import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import './ShopDashboardPage.css';

const ShopDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, products, orders, reviews } = useAppContext();
  
  // Lọc dữ liệu của shop
  const shopProducts = products.filter(p => p.shopId === currentUser.id);
  const shopProductIds = shopProducts.map(p => p.id);
  
  const shopOrders = orders.filter(order => 
    order.items.some(item => item.shopId === currentUser.id)
  );
  
  const shopReviews = reviews.filter(review => 
    shopProductIds.includes(review.productId)
  );

  // Tính toán thống kê
  const calculateShopRevenue = (order) => {
    return order.items
      .filter(item => item.shopId === currentUser.id)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const stats = {
    totalProducts: shopProducts.length,
    approvedProducts: shopProducts.filter(p => p.status === 'approved').length,
    pendingProducts: shopProducts.filter(p => p.status === 'pending').length,
    totalOrders: shopOrders.length,
    completedOrders: shopOrders.filter(o => o.status === 'delivered').length,
    pendingOrders: shopOrders.filter(o => o.status === 'pending').length,
    totalRevenue: shopOrders
      .filter(o => o.status === 'delivered')
      .reduce((total, order) => total + calculateShopRevenue(order), 0),
    totalReviews: shopReviews.length,
    averageRating: shopReviews.length > 0
      ? (shopReviews.reduce((sum, review) => sum + review.rating, 0) / shopReviews.length).toFixed(1)
      : 0
  };

  const managementSections = [
    {
      title: 'Quản lý Sản phẩm',
      icon: '📦',
      items: [
        { name: 'Đăng sản phẩm mới', path: '/shop/add-product', icon: '➕' },
        { name: 'Danh sách sản phẩm', path: '/shop/products', icon: '📋' },
        { name: 'Sản phẩm chờ duyệt', path: '/shop/products', icon: '⏳' }
      ]
    },
    {
      title: 'Quản lý Đơn hàng',
      icon: '📦',
      items: [
        { name: 'Tất cả đơn hàng', path: '/shop/orders', icon: '📋' },
        { name: 'Đơn hàng mới', path: '/shop/orders', icon: '🆕' },
        { name: 'Đơn hàng đã giao', path: '/shop/orders', icon: '✅' }
      ]
    },
    {
      title: 'Quản lý Thanh toán',
      icon: '💳',
      items: [
        { name: 'Giao dịch thanh toán', path: '/shop/payments', icon: '💰' },
        { name: 'Doanh thu', path: '/shop/payments', icon: '📈' },
        { name: 'Hoàn tiền', path: '/shop/payments', icon: '🔄' }
      ]
    },
    {
      title: 'Quản lý Đánh giá',
      icon: '⭐',
      items: [
        { name: 'Tất cả đánh giá', path: '/shop/reviews', icon: '📋' },
        { name: 'Đánh giá chưa phản hồi', path: '/shop/reviews', icon: '💬' },
        { name: 'Đánh giá báo cáo', path: '/shop/reviews', icon: '🚨' }
      ]
    },
    {
      title: 'Quản lý Khách hàng',
      icon: '👥',
      items: [
        { name: 'Danh sách khách hàng', path: '/shop/customers', icon: '📋' },
        { name: 'Khách hàng VIP', path: '/shop/customers', icon: '👑' },
        { name: 'Khách hàng mới', path: '/shop/customers', icon: '🆕' }
      ]
    },
    {
      title: 'Phân tích Sản phẩm',
      icon: '📈',
      items: [
        { name: 'Hiệu suất sản phẩm', path: '/shop/analytics', icon: '📊' },
        { name: 'Sản phẩm bán chạy', path: '/shop/analytics', icon: '🏆' },
        { name: 'Phân tích danh mục', path: '/shop/analytics', icon: '📦' }
      ]
    },
    {
      title: 'Báo cáo & Thống kê',
      icon: '📊',
      items: [
        { name: 'Tổng quan doanh số', path: '/shop/reports', icon: '📈' },
        { name: 'Báo cáo sản phẩm', path: '/shop/reports', icon: '📦' },
        { name: 'Báo cáo khách hàng', path: '/shop/reports', icon: '👥' }
      ]
    }
  ];

  return (
    <div className="shop-dashboard-container p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🏪 Dashboard Shop</h1>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200 mb-8">
        <h2 className="text-2xl font-semibold text-purple-800 mb-2">
          Chào mừng, {currentUser.name}! 👋
        </h2>
        <p className="text-purple-600">
          Quản lý shop của bạn một cách hiệu quả với các công cụ mạnh mẽ
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📦 Sản phẩm</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.approvedProducts} đã duyệt</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">📦 Đơn hàng</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.completedOrders} hoàn thành</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">💰 Doanh thu</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalRevenue.toLocaleString()} VND</p>
          <p className="text-sm text-gray-600 mt-1">Từ đơn hàng hoàn thành</p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⭐ Đánh giá</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
          <p className="text-sm text-gray-600 mt-1">Từ {stats.totalReviews} đánh giá</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '32px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>⚡ Thao tác nhanh</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <button
            onClick={() => navigate('/shop/add-product')}
            style={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              color: '#581c87',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #c084fc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(168, 85, 247, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.2)';
              e.target.style.borderColor = '#a855f7';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(168, 85, 247, 0.1)';
              e.target.style.borderColor = '#c084fc';
            }}
          >
            <span style={{ fontSize: '24px' }}>➕</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Đăng sản phẩm mới</div>
              <div style={{ fontSize: '14px', color: '#7c3aed' }}>Thêm sản phẩm để bán</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/shop/orders')}
            style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              color: '#1e40af',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #93c5fd',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.1)';
              e.target.style.borderColor = '#93c5fd';
            }}
          >
            <span style={{ fontSize: '24px' }}>📦</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Xem đơn hàng mới</div>
              <div style={{ fontSize: '14px', color: '#3b82f6' }}>{stats.pendingOrders} đơn chờ xử lý</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/shop/reports')}
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              color: '#166534',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid #86efac',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(34, 197, 94, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
              e.target.style.borderColor = '#4ade80';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.1)';
              e.target.style.borderColor = '#86efac';
            }}
          >
            <span style={{ fontSize: '24px' }}>📊</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Xem báo cáo</div>
              <div style={{ fontSize: '14px', color: '#22c55e' }}>Thống kê doanh số</div>
            </div>
          </button>
        </div>
      </div>

      {/* Management Sections */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">🔧 Quản lý Shop</h2>
        
        {managementSections.map((section, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => navigate(item.path)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="font-medium text-gray-800 group-hover:text-purple-700">
                        {item.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopDashboardPage;