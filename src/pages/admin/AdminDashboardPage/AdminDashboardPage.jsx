import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { users, shops, orders, products } = useAppContext();
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const managementSections = [
    {
      title: 'Quản lý Cửa hàng',
      icon: '🏪',
      items: [
        { name: 'Danh sách cửa hàng', path: '/admin/stores', icon: '📋' },
        { name: 'Thêm cửa hàng mới', path: '/admin/stores', icon: '➕' }
      ]
    },
    {
      title: 'Quản lý Sản phẩm',
      icon: '📦',
      items: [
        { name: 'Kiểm duyệt sản phẩm', path: '/admin/products', icon: '✅' },
        { name: 'Sản phẩm chờ duyệt', path: '/admin/products', icon: '⏳' },
        { name: 'Sản phẩm đã từ chối', path: '/admin/products', icon: '❌' }
      ]
    },
    {
      title: 'Quản lý Đơn hàng',
      icon: '📋',
      items: [
        { name: 'Tất cả đơn hàng', path: '/admin/orders', icon: '📄' },
        { name: 'Đơn hàng đang xử lý', path: '/admin/orders', icon: '⏳' },
        { name: 'Đơn hàng đã hoàn thành', path: '/admin/orders', icon: '✅' }
      ]
    },
    {
      title: 'Quản lý Khách hàng',
      icon: '👥',
      items: [
        { name: 'Danh sách khách hàng', path: '/admin/customers', icon: '👤' },
        { name: 'Thông tin chi tiết', path: '/admin/customers', icon: '📊' }
      ]
    },
    {
      title: 'Quản lý Thanh toán',
      icon: '💳',
      items: [
        { name: 'Giao dịch thanh toán', path: '/admin/payments', icon: '💰' },
        { name: 'Báo cáo tài chính', path: '/admin/payments', icon: '📈' }
      ]
    },
          {
            title: 'Báo cáo & Thống kê',
            icon: '📊',
            items: [
              { name: 'Báo cáo hệ thống', path: '/admin/reports', icon: '📋' },
              { name: 'Xuất báo cáo', path: '/admin/reports', icon: '📤' }
            ]
          },
          {
            title: 'Quản lý Đánh giá',
            icon: '⭐',
            items: [
              { name: 'Duyệt đánh giá', path: '/admin/reviews', icon: '✅' },
              { name: 'Báo cáo spam', path: '/admin/reviews', icon: '🚨' },
              { name: 'Thống kê đánh giá', path: '/admin/reviews', icon: '📈' }
            ]
          },
          {
            title: 'Quản lý Khuyến mãi',
            icon: '🎉',
            items: [
              { name: 'Tạo khuyến mãi', path: '/admin/promotions', icon: '➕' },
              { name: 'Danh sách khuyến mãi', path: '/admin/promotions', icon: '📋' },
              { name: 'Thống kê sử dụng', path: '/admin/promotions', icon: '📊' }
            ]
          },
          {
            title: 'Phân quyền & Nhân viên',
            icon: '🔐',
            items: [
              { name: 'Quản lý nhân viên', path: '/admin/permissions', icon: '👥' },
              { name: 'Phân quyền hệ thống', path: '/admin/permissions', icon: '🛡️' },
              { name: 'Lịch sử hoạt động', path: '/admin/permissions', icon: '📜' }
            ]
          },
          {
            title: 'Quản lý Tài chính',
            icon: '💰',
            items: [
              { name: 'Tổng quan tài chính', path: '/admin/finance', icon: '📊' },
              { name: 'Giao dịch & Doanh thu', path: '/admin/finance', icon: '💸' },
              { name: 'Báo cáo tài chính', path: '/admin/finance', icon: '📈' }
            ]
          },
          {
            title: 'Thông báo & Hỗ trợ',
            icon: '📢',
            items: [
              { name: 'Gửi thông báo', path: '/admin/notifications', icon: '📨' },
              { name: 'Hỗ trợ kỹ thuật', path: '/admin/support', icon: '🛠️' }
            ]
          }
  ];

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Trang quản trị</h1>
      <div className="admin-stats-grid">
        <div className="stat-card stat-card-blue">
          <h2 className="stat-number">{users.length}</h2>
          <p className="stat-label">Người dùng</p>
        </div>
        <div className="stat-card stat-card-green">
          <h2 className="stat-number">{shops.length}</h2>
          <p className="stat-label">Cửa hàng</p>
        </div>
        <div className="stat-card stat-card-yellow">
          <h2 className="stat-number">{orders.length}</h2>
          <p className="stat-label">Đơn hàng</p>
        </div>
        <div className="stat-card stat-card-red">
          <h2 className="stat-number">{products.length}</h2>
          <p className="stat-label">Sản phẩm</p>
        </div>
      </div>
              <div className="admin-management-section">
                <h2 className="management-title">Quản lý hệ thống</h2>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  {managementSections.map((section, index) => (
                    <div key={index} style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}>
                      <button
                        onClick={() => toggleSection(section.title)}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                          color: 'white',
                          border: 'none',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '18px' }}>{section.icon}</span>
                          {section.title}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          transform: expandedSections[section.title] ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}>
                          ▼
                        </span>
                      </button>
                      
                      {expandedSections[section.title] && (
                        <div style={{
                          padding: '0',
                          background: '#f9fafb'
                        }}>
                          {section.items.map((item, itemIndex) => (
                            <button
                              key={itemIndex}
                              onClick={() => navigate(item.path)}
                              style={{
                                width: '100%',
                                padding: '12px 20px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '14px',
                                color: '#374151',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                borderBottom: itemIndex < section.items.length - 1 ? '1px solid #e5e7eb' : 'none'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = '#f3f4f6';
                                e.target.style.color = '#8b5cf6';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#374151';
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>{item.icon}</span>
                              {item.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
    </div>
  );
};

export default AdminDashboardPage;
