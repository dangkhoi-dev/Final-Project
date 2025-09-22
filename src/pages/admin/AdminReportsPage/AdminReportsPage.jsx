import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const AdminReportsPage = () => {
  const { users, shops, orders, products, payments } = useAppContext();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('all');

  // Tính toán thống kê
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => {
      return order.status === 'Đã giao' ? sum + order.total : sum;
    }, 0);

    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'Đã giao').length;
    const pendingOrders = orders.filter(order => order.status === 'Đang xử lý').length;
    const cancelledOrders = orders.filter(order => order.status === 'Đã hủy').length;

    const totalCustomers = users.filter(user => user.role === 'customer').length;
    const totalShops = shops.length;
    const totalProducts = products.length;
    const approvedProducts = products.filter(product => product.status === 'approved').length;
    const pendingProducts = products.filter(product => product.status === 'pending').length;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / completedOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalCustomers,
      totalShops,
      totalProducts,
      approvedProducts,
      pendingProducts,
      avgOrderValue
    };
  }, [users, shops, orders, products]);

  // Xuất báo cáo
  const exportReport = (format) => {
    const reportData = {
      date: new Date().toLocaleDateString('vi-VN'),
      stats,
      orders: orders.map(order => ({
        id: order.id,
        date: order.date,
        total: order.total,
        status: order.status,
        items: order.items.length
      })),
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        status: product.status
      }))
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-he-thong-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const csvData = [
        ['Báo cáo hệ thống', new Date().toLocaleDateString('vi-VN')],
        [''],
        ['Tổng quan'],
        ['Tổng doanh thu', new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)],
        ['Tổng đơn hàng', stats.totalOrders],
        ['Đơn hàng hoàn thành', stats.completedOrders],
        ['Đơn hàng đang xử lý', stats.pendingOrders],
        ['Đơn hàng đã hủy', stats.cancelledOrders],
        ['Tổng khách hàng', stats.totalCustomers],
        ['Tổng cửa hàng', stats.totalShops],
        ['Tổng sản phẩm', stats.totalProducts],
        ['Sản phẩm đã duyệt', stats.approvedProducts],
        ['Sản phẩm chờ duyệt', stats.pendingProducts]
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bao-cao-he-thong-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
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
            📊 Báo cáo hệ thống
          </h1>
          <p style={{ fontSize: '16px', opacity: '0.9', margin: '0' }}>
            Xem và xuất các báo cáo về hoạt động của hệ thống
          </p>
        </div>

        {/* Report Type Selector */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {[
            { value: 'overview', label: '📈 Tổng quan', icon: '📊' },
            { value: 'revenue', label: '💰 Doanh thu', icon: '💵' },
            { value: 'orders', label: '📦 Đơn hàng', icon: '📋' },
            { value: 'products', label: '🛍️ Sản phẩm', icon: '🏷️' },
            { value: 'users', label: '👥 Người dùng', icon: '👤' }
          ].map((report) => (
            <button
              key={report.value}
              onClick={() => setSelectedReport(report.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: selectedReport === report.value 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' 
                  : 'white',
                color: selectedReport === report.value ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedReport === report.value 
                  ? '0 4px 15px rgba(139, 92, 246, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{report.icon}</span>
              {report.label}
            </button>
          ))}
        </div>

        {/* Export Options */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => exportReport('json')}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#10b981',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📄 Xuất JSON
          </button>
          <button
            onClick={() => exportReport('csv')}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📊 Xuất CSV
          </button>
        </div>

        {/* Report Content */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          {selectedReport === 'overview' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
                📊 Tổng quan hệ thống
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>💰 Tổng doanh thu</h3>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
                  </p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>📦 Tổng đơn hàng</h3>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{stats.totalOrders}</p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>👥 Khách hàng</h3>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{stats.totalCustomers}</p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: 'white'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>🏪 Cửa hàng</h3>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{stats.totalShops}</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'revenue' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
                💰 Báo cáo doanh thu
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#166534' }}>
                    Tổng doanh thu
                  </h4>
                  <p style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: '#166534' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
                  </p>
                </div>
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#92400e' }}>
                    Đơn hàng hoàn thành
                  </h4>
                  <p style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: '#92400e' }}>
                    {stats.completedOrders}
                  </p>
                </div>
                <div style={{
                  background: '#ede9fe',
                  border: '1px solid #c4b5fd',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#6b21a8' }}>
                    Giá trị đơn hàng TB
                  </h4>
                  <p style={{ fontSize: '20px', fontWeight: '700', margin: '0', color: '#6b21a8' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.avgOrderValue)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'orders' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
                📦 Báo cáo đơn hàng
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#065f46' }}>
                    Tổng đơn hàng
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#065f46' }}>
                    {stats.totalOrders}
                  </p>
                </div>
                <div style={{
                  background: '#dbeafe',
                  border: '1px solid #93c5fd',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#1e40af' }}>
                    Đang xử lý
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#1e40af' }}>
                    {stats.pendingOrders}
                  </p>
                </div>
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#991b1b' }}>
                    Đã hủy
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#991b1b' }}>
                    {stats.cancelledOrders}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'products' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
                🛍️ Báo cáo sản phẩm
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  background: '#f0f9ff',
                  border: '1px solid #7dd3fc',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#0c4a6e' }}>
                    Tổng sản phẩm
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#0c4a6e' }}>
                    {stats.totalProducts}
                  </p>
                </div>
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#166534' }}>
                    Đã duyệt
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#166534' }}>
                    {stats.approvedProducts}
                  </p>
                </div>
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fde047',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#92400e' }}>
                    Chờ duyệt
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#92400e' }}>
                    {stats.pendingProducts}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'users' && (
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
                👥 Báo cáo người dùng
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div style={{
                  background: '#fdf2f8',
                  border: '1px solid #f9a8d4',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#be185d' }}>
                    Tổng khách hàng
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#be185d' }}>
                    {stats.totalCustomers}
                  </p>
                </div>
                <div style={{
                  background: '#f3e8ff',
                  border: '1px solid #c084fc',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#7c3aed' }}>
                    Cửa hàng
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#7c3aed' }}>
                    {stats.totalShops}
                  </p>
                </div>
                <div style={{
                  background: '#ecfdf5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0', color: '#065f46' }}>
                    Tổng người dùng
                  </h4>
                  <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#065f46' }}>
                    {users.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
