import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { useNotificationBell } from '../../../contexts/NotificationBellContext';

const AdminNotificationsPage = () => {
  const { users, shops } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const { addNotification } = useNotificationBell();
  
  const [notification, setNotification] = useState({
    type: 'general',
    recipient: 'all',
    title: '',
    message: '',
    priority: 'normal'
  });

  const [sentNotifications, setSentNotifications] = useState([
    {
      id: 1,
      type: 'maintenance',
      recipient: 'all',
      title: 'Bảo trì hệ thống',
      message: 'Hệ thống sẽ được bảo trì từ 2:00 - 4:00 sáng ngày 22/01/2025',
      priority: 'high',
      sentAt: '2025-01-21T10:00:00Z',
      sentTo: 'Tất cả người dùng'
    },
    {
      id: 2,
      type: 'promotion',
      recipient: 'customers',
      title: 'Khuyến mãi đặc biệt',
      message: 'Giảm giá 20% cho tất cả sản phẩm thời trang nam',
      priority: 'normal',
      sentAt: '2025-01-20T15:30:00Z',
      sentTo: 'Khách hàng'
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendNotification = () => {
    if (!notification.title.trim() || !notification.message.trim()) {
      showError('Vui lòng điền đầy đủ tiêu đề và nội dung!');
      return;
    }

    const newNotification = {
      id: Date.now(),
      ...notification,
      sentAt: new Date().toISOString(),
      sentTo: getRecipientText(notification.recipient)
    };

    setSentNotifications(prev => [newNotification, ...prev]);
    
    // Add to notification bell for target roles
    const targetRoles = notification.recipient === 'all' 
      ? ['admin', 'shop', 'customer'] 
      : [notification.recipient];
    
    addNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority
    }, targetRoles);
    
    // Reset form
    setNotification({
      type: 'general',
      recipient: 'all',
      title: '',
      message: '',
      priority: 'normal'
    });

    showSuccess('Thông báo đã được gửi thành công!');
  };

  const getRecipientText = (recipient) => {
    switch (recipient) {
      case 'all': return 'Tất cả người dùng';
      case 'customers': return 'Khách hàng';
      case 'shops': return 'Cửa hàng';
      case 'admins': return 'Quản trị viên';
      default: return 'Tất cả người dùng';
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'general': return '📢';
      case 'maintenance': return '🔧';
      case 'promotion': return '🎉';
      case 'security': return '🔒';
      case 'update': return '🔄';
      default: return '📢';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'general': return 'Thông báo chung';
      case 'maintenance': return 'Bảo trì hệ thống';
      case 'promotion': return 'Khuyến mãi';
      case 'security': return 'Bảo mật';
      case 'update': return 'Cập nhật';
      default: return 'Thông báo chung';
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
            📢 Gửi thông báo
          </h1>
          <p style={{ fontSize: '16px', opacity: '0.9', margin: '0' }}>
            Gửi thông báo đến cửa hàng và khách hàng
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Send Notification Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
              📝 Tạo thông báo mới
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                Loại thông báo
              </label>
              <select
                name="type"
                value={notification.type}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="general">📢 Thông báo chung</option>
                <option value="maintenance">🔧 Bảo trì hệ thống</option>
                <option value="promotion">🎉 Khuyến mãi</option>
                <option value="security">🔒 Bảo mật</option>
                <option value="update">🔄 Cập nhật</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                Gửi đến
              </label>
              <select
                name="recipient"
                value={notification.recipient}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="all">👥 Tất cả người dùng</option>
                <option value="customers">🛍️ Khách hàng</option>
                <option value="shops">🏪 Cửa hàng</option>
                <option value="admins">👨‍💼 Quản trị viên</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                Mức độ ưu tiên
              </label>
              <select
                name="priority"
                value={notification.priority}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="low">🟢 Thấp</option>
                <option value="normal">🟡 Bình thường</option>
                <option value="high">🔴 Cao</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                Tiêu đề
              </label>
              <input
                type="text"
                name="title"
                value={notification.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề thông báo..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                Nội dung
              </label>
              <textarea
                name="message"
                value={notification.message}
                onChange={handleInputChange}
                placeholder="Nhập nội dung thông báo..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              onClick={handleSendNotification}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              📤 Gửi thông báo
            </button>
            
            {/* Info about notification targeting */}
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              color: '#0c4a6e',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px' }}>💡</span>
                <strong>Lưu ý về gửi thông báo:</strong>
              </div>
              <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.5' }}>
                <li><strong>Tất cả người dùng:</strong> Gửi đến admin, shop và customer</li>
                <li><strong>Khách hàng:</strong> Chỉ gửi đến các tài khoản customer</li>
                <li><strong>Cửa hàng:</strong> Chỉ gửi đến các tài khoản shop</li>
                <li><strong>Quản trị viên:</strong> Chỉ gửi đến các tài khoản admin</li>
              </ul>
              <div style={{ marginTop: '8px', fontSize: '12px', opacity: '0.8' }}>
                Mỗi role sẽ có thông báo riêng biệt và không ảnh hưởng đến nhau
              </div>
            </div>
          </div>

          {/* Notification History */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
              📋 Lịch sử thông báo
            </h2>

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {sentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    background: '#fafafa'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{getTypeIcon(notif.type)}</span>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#374151' }}>
                        {notif.title}
                      </h3>
                    </div>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        background: getPriorityColor(notif.priority)
                      }}
                    >
                      {notif.priority === 'high' ? 'Cao' : notif.priority === 'normal' ? 'Bình thường' : 'Thấp'}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                    {notif.message}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#9ca3af' }}>
                    <span>📤 {notif.sentTo}</span>
                    <span>🕒 {new Date(notif.sentAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
            📊 Thống kê thông báo
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Tổng thông báo</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{sentNotifications.length}</p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Khách hàng</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>
                {users.filter(user => user.role === 'customer').length}
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Cửa hàng</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{shops.length}</p>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Ưu tiên cao</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>
                {sentNotifications.filter(n => n.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
