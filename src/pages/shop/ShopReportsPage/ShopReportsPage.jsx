import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const ShopReportsPage = () => {
  const { currentUser, products, orders, payments, reviews } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Lọc dữ liệu của shop
  const shopProducts = products.filter(p => p.shopId === currentUser.id);
  const shopProductIds = shopProducts.map(p => p.id);
  
  const shopOrders = orders.filter(order => 
    order.shopIds && order.shopIds.includes(currentUser.id)
  );
  
  const shopPayments = payments.filter(payment => 
    payment.shopId === currentUser.id
  );
  
  const shopReviews = reviews.filter(review => 
    shopProductIds.includes(review.productId)
  );

  // Tính toán thống kê theo thời gian
  const getDateRange = (period) => {
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange(selectedPeriod);

  // Lọc dữ liệu theo thời gian
  const filteredOrders = shopOrders.filter(order => {
    const orderDate = new Date(order.date || order.orderDate);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const filteredPayments = shopPayments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate);
    return paymentDate >= startDate && paymentDate <= endDate;
  });

  const filteredReviews = shopReviews.filter(review => {
    const reviewDate = new Date(review.createdAt);
    return reviewDate >= startDate && reviewDate <= endDate;
  });

  // Tính toán thống kê
  const calculateShopRevenue = (order) => {
    return order.items
      .filter(item => item.shopId === currentUser.id)
      .reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const stats = {
    // Sản phẩm
    totalProducts: shopProducts.length,
    approvedProducts: shopProducts.filter(p => p.status === 'approved').length,
    pendingProducts: shopProducts.filter(p => p.status === 'pending').length,
    rejectedProducts: shopProducts.filter(p => p.status === 'rejected').length,
    
    // Đơn hàng
    totalOrders: filteredOrders.length,
    completedOrders: filteredOrders.filter(o => o.status === 'delivered').length,
    pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
    cancelledOrders: filteredOrders.filter(o => o.status === 'cancelled').length,
    
    // Doanh thu & Thanh toán
    totalRevenue: filteredOrders
      .filter(o => o.status === 'delivered')
      .reduce((total, order) => total + calculateShopRevenue(order), 0),
    totalPayments: filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0),
    averageOrderValue: filteredOrders.length > 0 
      ? filteredOrders.reduce((total, order) => total + calculateShopRevenue(order), 0) / filteredOrders.length
      : 0,
    
    // Thống kê thanh toán
    totalTransactions: filteredPayments.length,
    completedTransactions: filteredPayments.filter(p => p.status === 'completed').length,
    pendingTransactions: filteredPayments.filter(p => p.status === 'pending').length,
    refundedTransactions: filteredPayments.filter(p => p.status === 'refunded').length,
    
    // Đánh giá
    totalReviews: filteredReviews.length,
    averageRating: filteredReviews.length > 0
      ? (filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length).toFixed(1)
      : 0,
    positiveReviews: filteredReviews.filter(r => r.rating >= 4).length,
    negativeReviews: filteredReviews.filter(r => r.rating <= 2).length,
    
    // Khách hàng
    uniqueCustomers: new Set(filteredOrders.map(o => o.customerId)).size
  };

  // Sản phẩm bán chạy
  const getTopSellingProducts = () => {
    const productSales = {};
    
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.shopId === currentUser.id) {
          if (!productSales[item.id]) {
            productSales[item.id] = {
              id: item.id,
              name: item.name,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.id].quantity += item.quantity;
          productSales[item.id].revenue += item.price * item.quantity;
        }
      });
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  // Xuất báo cáo
  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      dateRange: `${startDate.toLocaleDateString('vi-VN')} - ${endDate.toLocaleDateString('vi-VN')}`,
      shopId: currentUser.id,
      shopName: currentUser.name,
      stats,
      topSellingProducts: getTopSellingProducts()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `shop-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const OverviewReport = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">💰 Doanh thu</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalRevenue.toLocaleString()} VND</p>
          <p className="text-sm text-gray-600 mt-1">Trong {selectedPeriod === 'week' ? 'tuần' : selectedPeriod === 'month' ? 'tháng' : selectedPeriod === 'quarter' ? 'quý' : 'năm'} này</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2">📦 Đơn hàng</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.completedOrders} đã hoàn thành</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">💳 Thanh toán</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalTransactions}</p>
          <p className="text-sm text-gray-600 mt-1">{stats.completedTransactions} đã hoàn thành</p>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">📊 Tổng thanh toán</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalPayments.toLocaleString()} VND</p>
          <p className="text-sm text-gray-600 mt-1">Từ {stats.totalTransactions} giao dịch</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">👥 Khách hàng</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.uniqueCustomers}</p>
          <p className="text-sm text-gray-600 mt-1">Khách hàng duy nhất</p>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⭐ Đánh giá TB</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
          <p className="text-sm text-gray-600 mt-1">Từ {stats.totalReviews} đánh giá</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Thống kê sản phẩm</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tổng sản phẩm:</span>
              <span className="font-semibold">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between">
              <span>Đã duyệt:</span>
              <span className="font-semibold text-green-600">{stats.approvedProducts}</span>
            </div>
            <div className="flex justify-between">
              <span>Chờ duyệt:</span>
              <span className="font-semibold text-yellow-600">{stats.pendingProducts}</span>
            </div>
            <div className="flex justify-between">
              <span>Bị từ chối:</span>
              <span className="font-semibold text-red-600">{stats.rejectedProducts}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 Thống kê đơn hàng</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Tổng đơn hàng:</span>
              <span className="font-semibold">{stats.totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Đã hoàn thành:</span>
              <span className="font-semibold text-green-600">{stats.completedOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Chờ xử lý:</span>
              <span className="font-semibold text-yellow-600">{stats.pendingOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Đã hủy:</span>
              <span className="font-semibold text-red-600">{stats.cancelledOrders}</span>
            </div>
            <div className="flex justify-between">
              <span>Giá trị TB/đơn:</span>
              <span className="font-semibold text-blue-600">{stats.averageOrderValue.toLocaleString()} VND</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🏆 Sản phẩm bán chạy</h3>
        {getTopSellingProducts().length > 0 ? (
          <div className="space-y-3">
            {getTopSellingProducts().map((product, index) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">#{index + 1}</span>
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-gray-600">ID: {product.id}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{product.quantity} sản phẩm</div>
                  <div className="text-sm text-gray-600">{product.revenue.toLocaleString()} VND</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Chưa có dữ liệu bán hàng trong khoảng thời gian này</p>
        )}
      </div>
    </div>
  );

  const ProductReport = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📦 Báo cáo sản phẩm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600">Tổng sản phẩm</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{stats.approvedProducts}</div>
            <div className="text-sm text-gray-600">Đã duyệt</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingProducts}</div>
            <div className="text-sm text-gray-600">Chờ duyệt</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">{stats.rejectedProducts}</div>
            <div className="text-sm text-gray-600">Bị từ chối</div>
          </div>
        </div>
      </div>
    </div>
  );

  const SalesReport = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Báo cáo doanh số</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} VND</div>
            <div className="text-sm text-gray-600">Tổng doanh thu</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Tổng đơn hàng</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{stats.averageOrderValue.toLocaleString()} VND</div>
            <div className="text-sm text-gray-600">Giá trị TB/đơn</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="shop-reports-container p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Báo cáo & Thống kê</h1>
        <button
          onClick={exportReport}
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            color: '#166534',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '2px solid #86efac',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
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
          <span>📥</span>
          Xuất báo cáo
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="week">7 ngày qua</option>
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>
        
        <select
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="overview">Tổng quan</option>
          <option value="products">Sản phẩm</option>
          <option value="sales">Doanh số</option>
        </select>
      </div>

      {/* Date Range Info */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">📅</span>
          <span className="font-semibold text-blue-800">
            Khoảng thời gian: {startDate.toLocaleDateString('vi-VN')} - {endDate.toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && <OverviewReport />}
      {selectedReport === 'products' && <ProductReport />}
      {selectedReport === 'sales' && <SalesReport />}
    </div>
  );
};

export default ShopReportsPage;
