import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const ShopPaymentManagementPage = () => {
  const { currentUser, orders, payments } = useAppContext();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Lọc giao dịch liên quan đến shop
  const shopPayments = payments.filter(payment => 
    payment.shopId === currentUser.id
  );

  const filteredPayments = shopPayments.filter(payment => {
    const statusMatch = filterStatus === 'all' || payment.status === filterStatus;
    
    let periodMatch = true;
    if (filterPeriod !== 'all') {
      const paymentDate = new Date(payment.paymentDate);
      const now = new Date();
      
      switch (filterPeriod) {
        case 'today':
          periodMatch = paymentDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          periodMatch = paymentDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          periodMatch = paymentDate >= monthAgo;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          periodMatch = paymentDate >= yearAgo;
          break;
      }
    }
    
    return statusMatch && periodMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'failed': return 'Thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return 'Không xác định';
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case 'credit_card': return '💳 Thẻ tín dụng';
      case 'bank_transfer': return '🏦 Chuyển khoản';
      case 'cash_on_delivery': return '💰 Thanh toán khi nhận hàng';
      case 'e_wallet': return '📱 Ví điện tử';
      default: return method;
    }
  };

  // Tính toán thống kê
  const calculateShopRevenue = (payment) => {
    const relatedOrder = orders.find(order => order.id === payment.orderId);
    if (!relatedOrder) return 0;
    
    return relatedOrder.items
      .filter(item => item.shopId === currentUser.id)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const stats = {
    total: shopPayments.length,
    completed: shopPayments.filter(p => p.status === 'completed').length,
    pending: shopPayments.filter(p => p.status === 'pending').length,
    failed: shopPayments.filter(p => p.status === 'failed').length,
    refunded: shopPayments.filter(p => p.status === 'refunded').length,
    totalRevenue: shopPayments
      .filter(p => p.status === 'completed')
      .reduce((total, payment) => total + calculateShopRevenue(payment), 0),
    totalRefunded: shopPayments
      .filter(p => p.status === 'refunded')
      .reduce((total, payment) => total + (payment.refundAmount || 0), 0)
  };

  return (
    <div className="shop-payment-management-container p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💳 Quản lý Thanh toán</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Tổng giao dịch</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Hoàn thành</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">Chờ xử lý</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-800">Thất bại</h3>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">💰 Tổng doanh thu</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} VND</p>
          <p className="text-sm text-gray-600 mt-1">Từ giao dịch hoàn thành</p>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">💸 Tổng hoàn tiền</h3>
          <p className="text-3xl font-bold text-red-600">{stats.totalRefunded.toLocaleString()} VND</p>
          <p className="text-sm text-gray-600 mt-1">Từ giao dịch bị hoàn tiền</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="completed">Hoàn thành</option>
          <option value="pending">Chờ xử lý</option>
          <option value="failed">Thất bại</option>
          <option value="refunded">Đã hoàn tiền</option>
        </select>
        
        <select
          value={filterPeriod}
          onChange={(e) => setFilterPeriod(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Tất cả thời gian</option>
          <option value="today">Hôm nay</option>
          <option value="week">7 ngày qua</option>
          <option value="month">30 ngày qua</option>
          <option value="year">1 năm qua</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Giao dịch</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Đơn hàng</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Khách hàng</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Phương thức</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Số tiền Shop</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Trạng thái</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Ngày giao dịch</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm" style={{ color: '#1f2937 !important' }}>
            {filteredPayments.map(payment => {
              const relatedOrder = orders.find(order => order.id === payment.orderId);
              const shopRevenue = calculateShopRevenue(payment);
              
              return (
                <tr key={payment.id} style={{ borderBottom: '1px solid #e5e7eb' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>#{payment.id}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{payment.transactionId}</div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <div style={{ fontWeight: '500', color: '#2563eb' }}>
                      #{payment.orderId}
                    </div>
                  </td>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    {relatedOrder ? (
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>{relatedOrder.customerName}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{relatedOrder.customerEmail}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Không tìm thấy</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <span style={{ fontSize: '14px', color: '#1f2937' }}>{getMethodText(payment.method)}</span>
                  </td>
                  <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#059669' }}>
                        {shopRevenue.toLocaleString()} VND
                      </div>
                      {payment.status === 'refunded' && payment.refundAmount && (
                        <div style={{ fontSize: '12px', color: '#dc2626' }}>
                          Hoàn: {payment.refundAmount.toLocaleString()} VND
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                    <div style={{ fontSize: '14px', color: '#1f2937' }}>
                      {new Date(payment.paymentDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {new Date(payment.paymentDate).toLocaleTimeString('vi-VN')}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có giao dịch nào</h3>
          <p className="text-gray-600">Giao dịch thanh toán sẽ hiển thị ở đây khi có đơn hàng</p>
        </div>
      )}

      {/* Payment Summary */}
      {filteredPayments.length > 0 && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Tóm tắt theo bộ lọc</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredPayments.length}
              </div>
              <div className="text-sm text-gray-600">Tổng giao dịch</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredPayments
                  .filter(p => p.status === 'completed')
                  .reduce((total, payment) => total + calculateShopRevenue(payment), 0)
                  .toLocaleString()} VND
              </div>
              <div className="text-sm text-gray-600">Doanh thu</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredPayments
                  .filter(p => p.status === 'refunded')
                  .reduce((total, payment) => total + (payment.refundAmount || 0), 0)
                  .toLocaleString()} VND
              </div>
              <div className="text-sm text-gray-600">Hoàn tiền</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPaymentManagementPage;
