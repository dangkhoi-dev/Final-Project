import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationBellContext = createContext();

export const useNotificationBell = () => {
  const context = useContext(NotificationBellContext);
  if (!context) {
    throw new Error('useNotificationBell must be used within a NotificationBellProvider');
  }
  return context;
};

export const NotificationBellProvider = ({ children }) => {
  const [notifications, setNotifications] = useState({
    admin: [
      {
        id: 1,
        title: 'Đơn hàng mới',
        message: 'Bạn có 3 đơn hàng mới cần xử lý',
        type: 'order',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 phút trước
        priority: 'high'
      },
      {
        id: 2,
        title: 'Sản phẩm chờ duyệt',
        message: '5 sản phẩm mới đang chờ được duyệt',
        type: 'product',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 giờ trước
        priority: 'normal'
      },
      {
        id: 3,
        title: 'Bảo trì hệ thống',
        message: 'Hệ thống sẽ được bảo trì từ 2:00 - 4:00 sáng ngày mai',
        type: 'system',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 ngày trước
        priority: 'high'
      },
      {
        id: 4,
        title: 'Khách hàng mới',
        message: '10 khách hàng mới đã đăng ký hôm nay',
        type: 'customer',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 giờ trước
        priority: 'normal'
      }
    ],
    shop: [
      {
        id: 5,
        title: 'Sản phẩm được duyệt',
        message: 'Sản phẩm "Áo thun nam" đã được admin duyệt',
        type: 'product',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        priority: 'normal'
      },
      {
        id: 6,
        title: 'Đơn hàng mới',
        message: 'Bạn có 1 đơn hàng mới từ khách hàng',
        type: 'order',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        priority: 'high'
      }
    ],
    customer: [
      {
        id: 7,
        title: 'Đơn hàng được xác nhận',
        message: 'Đơn hàng #1678886400000 của bạn đã được xác nhận',
        type: 'order',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        priority: 'normal'
      },
      {
        id: 8,
        title: 'Khuyến mãi đặc biệt',
        message: 'Giảm giá 20% cho tất cả sản phẩm thời trang nam',
        type: 'promotion',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        priority: 'normal'
      }
    ]
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // Lưu notifications vào localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Lấy thông báo theo role hiện tại
  const getCurrentNotifications = () => {
    if (!currentUserRole) return [];
    return notifications[currentUserRole] || [];
  };

  const unreadCount = getCurrentNotifications().filter(n => !n.isRead).length;

  const markAsRead = (notificationId) => {
    if (!currentUserRole) return;
    setNotifications(prev => ({
      ...prev,
      [currentUserRole]: prev[currentUserRole].map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    }));
  };

  const markAllAsRead = () => {
    if (!currentUserRole) return;
    setNotifications(prev => ({
      ...prev,
      [currentUserRole]: prev[currentUserRole].map(notification => 
        ({ ...notification, isRead: true })
      )
    }));
  };

  const addNotification = (notification, targetRoles = ['admin']) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => {
      const updated = { ...prev };
      targetRoles.forEach(role => {
        if (updated[role]) {
          updated[role] = [newNotification, ...updated[role]];
        }
      });
      return updated;
    });
  };

  const removeNotification = (notificationId) => {
    if (!currentUserRole) return;
    setNotifications(prev => ({
      ...prev,
      [currentUserRole]: prev[currentUserRole].filter(notification => notification.id !== notificationId)
    }));
  };

  const removeAllNotifications = () => {
    if (!currentUserRole) return;
    setNotifications(prev => ({
      ...prev,
      [currentUserRole]: []
    }));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'product': return '🛍️';
      case 'system': return '🔧';
      case 'customer': return '👤';
      case 'payment': return '💳';
      case 'promotion': return '🎉';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'normal': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const value = {
    notifications: getCurrentNotifications(),
    unreadCount,
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    removeAllNotifications,
    getNotificationIcon,
    getPriorityColor,
    formatTimeAgo,
    setCurrentUserRole,
    currentUserRole
  };

  return (
    <NotificationBellContext.Provider value={value}>
      {children}
    </NotificationBellContext.Provider>
  );
};
