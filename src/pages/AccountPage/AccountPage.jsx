import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import './AccountPage.css';

const AccountPage = () => {
  const { currentUser, orders, updateProfile } = useAppContext();
  if (!currentUser) return <p>Vui lòng đăng nhập.</p>;

  const userOrders = orders.filter(order => order.userId === currentUser.id);
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [address, setAddress] = useState(currentUser.address || '');

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đã giao hàng';
      case 'delivered': return 'Đã nhận hàng';
      case 'cancelled': return 'Đã hủy';
      case 'refunded': return 'Đã hoàn tiền';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="account-container">
      <h1 className="account-title">Tài khoản của tôi</h1>
      <div className="account-info-section">
        <h2 className="section-title">Thông tin cá nhân</h2>
        <p className="user-info"><strong>Email:</strong> {currentUser.email}</p>
        <div className="user-edit-form">
          <div className="form-row">
            <label>Họ và tên</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Số điện thoại</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Địa chỉ</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <button
            onClick={() => updateProfile({ name, phone, address })}
            className="save-profile-btn"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
      <div className="account-orders-section">
        <h2 className="section-title">Lịch sử đơn hàng</h2>
        {userOrders.length === 0 ? (
          <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="orders-list">
            {userOrders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-header">
                  <p className="order-id">Đơn hàng #{order.id}</p>
                  <p className="order-date">Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                </div>
                <p className="order-total">Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</p>
                <div className="order-statuses">
                  <span className="status-pill">Trạng thái: {getStatusText(order.status)}</span>
                  <div className="status-times">
                    <div>Thanh toán: {order.paymentDate ? new Date(order.paymentDate).toLocaleString('vi-VN') : '—'}</div>
                    <div>Xác nhận: {order.confirmedDate ? new Date(order.confirmedDate).toLocaleString('vi-VN') : '—'}</div>
                    <div>Giao hàng: {order.shippedDate ? new Date(order.shippedDate).toLocaleString('vi-VN') : '—'}</div>
                    <div>Giao thành công: {order.deliveredDate ? new Date(order.deliveredDate).toLocaleString('vi-VN') : '—'}</div>
                    <div>Ước tính giao: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleString('vi-VN') : '—'}</div>
                  </div>
                </div>
                <ul className="order-items">
                  {order.items.map(item => (
                    <li key={item.id} className="order-item-detail">{item.name} (x{item.quantity})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
