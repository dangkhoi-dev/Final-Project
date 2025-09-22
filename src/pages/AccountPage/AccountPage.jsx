import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import './AccountPage.css';

const AccountPage = () => {
  const { currentUser, orders } = useAppContext();
  if (!currentUser) return <p>Vui lòng đăng nhập.</p>;

  const userOrders = orders.filter(order => order.userId === currentUser.id);

  return (
    <div className="account-container">
      <h1 className="account-title">Tài khoản của tôi</h1>
      <div className="account-info-section">
        <h2 className="section-title">Thông tin cá nhân</h2>
        <p className="user-info"><strong>Email:</strong> {currentUser.email}</p>
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
