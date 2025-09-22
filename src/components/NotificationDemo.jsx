import React from 'react';
import { useNotificationBell } from '../contexts/NotificationBellContext';

const NotificationDemo = () => {
  const { addNotification } = useNotificationBell();

  const createSampleNotifications = () => {
    // Thông báo cho admin
    addNotification({
      title: 'Đơn hàng mới từ khách hàng',
      message: 'Có 2 đơn hàng mới cần được xử lý',
      type: 'order',
      priority: 'high'
    }, ['admin']);

    // Thông báo cho shop
    addNotification({
      title: 'Sản phẩm được duyệt',
      message: 'Sản phẩm "Giày thể thao Nike" đã được admin duyệt',
      type: 'product',
      priority: 'normal'
    }, ['shop']);

    // Thông báo cho customer
    addNotification({
      title: 'Đơn hàng đang được giao',
      message: 'Đơn hàng #1678886400000 của bạn đang được giao',
      type: 'order',
      priority: 'normal'
    }, ['customer']);

    // Thông báo cho tất cả
    addNotification({
      title: 'Bảo trì hệ thống',
      message: 'Hệ thống sẽ được bảo trì từ 2:00 - 4:00 sáng ngày mai',
      type: 'system',
      priority: 'high'
    }, ['admin', 'shop', 'customer']);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <button
        onClick={createSampleNotifications}
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
        }}
      >
        🔔 Tạo thông báo demo
      </button>
    </div>
  );
};

export default NotificationDemo;
