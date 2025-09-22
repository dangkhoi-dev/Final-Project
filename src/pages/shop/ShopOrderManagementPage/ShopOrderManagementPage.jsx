import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotification } from '../../../contexts/NotificationContext';

const ShopOrderManagementPage = () => {
  const { currentUser, orders, setOrders } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Lọc đơn hàng của shop hiện tại
  const shopOrders = orders.filter(order => 
    order.items.some(item => item.shopId === currentUser.id)
  );

  const filteredOrders = shopOrders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const now = new Date().toISOString();
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        
        // Cập nhật timestamps dựa trên trạng thái
        switch (newStatus) {
          case 'confirmed':
            updatedOrder.confirmedDate = now;
            break;
          case 'shipped':
            updatedOrder.shippedDate = now;
            break;
          case 'delivered':
            updatedOrder.deliveredDate = now;
            break;
          default:
            break;
        }
        
        return updatedOrder;
      }
      return order;
    }));
    showSuccess(`Đơn hàng #${orderId} đã được cập nhật trạng thái thành "${getStatusText(newStatus)}"`);
    setSelectedOrder(null);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      setOrders(orders.map(order => 
        order.id === orderId ? { 
          ...order, 
          status: 'cancelled',
          cancelReason: 'Shop hủy đơn hàng'
        } : order
      ));
      showSuccess(`Đơn hàng #${orderId} đã được hủy`);
      setSelectedOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

  const getShopItems = (order) => {
    return order.items.filter(item => item.shopId === currentUser.id);
  };

  const calculateShopTotal = (order) => {
    return getShopItems(order).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const stats = {
    total: shopOrders.length,
    pending: shopOrders.filter(o => o.status === 'pending').length,
    confirmed: shopOrders.filter(o => o.status === 'confirmed').length,
    shipped: shopOrders.filter(o => o.status === 'shipped').length,
    delivered: shopOrders.filter(o => o.status === 'delivered').length,
    cancelled: shopOrders.filter(o => o.status === 'cancelled').length,
    totalRevenue: shopOrders
      .filter(o => o.status === 'delivered')
      .reduce((total, order) => total + calculateShopTotal(order), 0)
  };

  return (
    <div className="shop-order-management-container p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📦 Quản lý Đơn hàng</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">Chờ xác nhận</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Đã xác nhận</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Đã giao hàng</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Đã nhận hàng</h3>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-800">Đã hủy</h3>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 mb-8">
        <h3 className="text-lg font-semibold text-green-800 mb-2">💰 Doanh thu từ đơn hàng hoàn thành</h3>
        <p className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} VND</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipped">Đã giao hàng</option>
          <option value="delivered">Đã nhận hàng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Đơn hàng</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Khách hàng</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Sản phẩm</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Tổng tiền</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Trạng thái</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Ngày đặt</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm" style={{ color: '#1f2937 !important' }}>
            {filteredOrders.map(order => {
              const shopItems = getShopItems(order);
              const shopTotal = calculateShopTotal(order);
              
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>#{order.id}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.paymentMethod}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>{order.customerName}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.customerEmail}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {shopItems.map((item, index) => (
                        <div key={index} style={{ fontSize: '12px', color: '#1f2937' }}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <span style={{ fontWeight: '600', color: '#059669' }}>
                      {shopTotal.toLocaleString()} VND
                    </span>
                  </td>
                  <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                    >
                      👁️ Xem
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-600">Đơn hàng sẽ hiển thị ở đây khi có khách hàng đặt mua sản phẩm</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Chi tiết đơn hàng #{selectedOrder.id}
            </h2>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  👤 Thông tin khách hàng
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  fontSize: '14px'
                }}>
                  <div style={{ color: '#374151' }}>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>Điện thoại:</span> {selectedOrder.phone}
                  </div>
                  <div style={{ color: '#374151' }}>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>Phương thức thanh toán:</span> {selectedOrder.paymentMethod}
                  </div>
                </div>
                <div style={{
                  marginTop: '12px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>Địa chỉ giao hàng:</span> {selectedOrder.shippingAddress}
                </div>
              </div>

              {/* Payment & Shipping Info */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #86efac'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#166534',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  💳 Thông tin thanh toán & giao hàng
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  fontSize: '14px'
                }}>
                  <div style={{ color: '#374151' }}>
                    <span style={{ fontWeight: '600', color: '#166534' }}>💰 Thời gian thanh toán:</span>
                    <div style={{ color: '#059669', fontWeight: '500' }}>
                      {selectedOrder.paymentDate ? new Date(selectedOrder.paymentDate).toLocaleString('vi-VN') : 'Chưa thanh toán'}
                    </div>
                  </div>
                  <div style={{ color: '#374151' }}>
                    <span style={{ fontWeight: '600', color: '#166534' }}>✅ Thời gian xác nhận:</span>
                    <div style={{ color: selectedOrder.confirmedDate ? '#059669' : '#6b7280', fontWeight: '500' }}>
                      {selectedOrder.confirmedDate ? new Date(selectedOrder.confirmedDate).toLocaleString('vi-VN') : 'Chưa xác nhận'}
                    </div>
                  </div>
                  <div style={{ color: '#374151' }}>
                    <span style={{ fontWeight: '600', color: '#166534' }}>🚚 Thời gian giao hàng:</span>
                    <div style={{ color: selectedOrder.shippedDate ? '#059669' : '#6b7280', fontWeight: '500' }}>
                      {selectedOrder.shippedDate ? new Date(selectedOrder.shippedDate).toLocaleString('vi-VN') : 'Chưa giao hàng'}
                    </div>
                  </div>
                  <div style={{ color: '#374151' }}>
                    <span style={{ fontWeight: '600', color: '#166534' }}>📦 Thời gian giao thành công:</span>
                    <div style={{ color: selectedOrder.deliveredDate ? '#059669' : '#6b7280', fontWeight: '500' }}>
                      {selectedOrder.deliveredDate ? new Date(selectedOrder.deliveredDate).toLocaleString('vi-VN') : 'Chưa giao thành công'}
                    </div>
                  </div>
                  <div style={{ color: '#374151', gridColumn: '1 / -1' }}>
                    <span style={{ fontWeight: '600', color: '#166534' }}>⏰ Ước tính giao hàng:</span>
                    <div style={{ color: '#7c3aed', fontWeight: '500' }}>
                      {selectedOrder.estimatedDelivery ? new Date(selectedOrder.estimatedDelivery).toLocaleString('vi-VN') : 'Chưa có thông tin'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Sản phẩm trong đơn hàng</h3>
                {getShopItems(selectedOrder).map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">Số lượng: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {(item.price * item.quantity).toLocaleString()} VND
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.price.toLocaleString()} VND/SP
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-300">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="font-bold text-green-600 text-lg">
                    {calculateShopTotal(selectedOrder).toLocaleString()} VND
                  </span>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Trạng thái đơn hàng</h3>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                  <div className="text-sm text-gray-600">
                    Ngày đặt: {new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: '2px solid #d1d5db',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  Đóng
                </button>
                
                {selectedOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'confirmed')}
                      style={{
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        color: '#1e40af',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: '2px solid #93c5fd',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                        e.target.style.borderColor = '#60a5fa';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.borderColor = '#93c5fd';
                      }}
                    >
                      ✅ Xác nhận đơn hàng
                    </button>
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                      style={{
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        color: '#dc2626',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: '2px solid #fca5a5',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                        e.target.style.borderColor = '#f87171';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                        e.target.style.borderColor = '#fca5a5';
                      }}
                    >
                      ❌ Hủy đơn hàng
                    </button>
                  </>
                )}
                
                {selectedOrder.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped')}
                    style={{
                      background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                      color: '#581c87',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: '2px solid #c084fc',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.2)';
                      e.target.style.borderColor = '#a855f7';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = '#c084fc';
                    }}
                  >
                    🚚 Đánh dấu đã giao hàng
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOrderManagementPage;
