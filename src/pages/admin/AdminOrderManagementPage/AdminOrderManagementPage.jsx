import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const AdminOrderManagementPage = () => {
  const { orders, users, shops, payments } = useAppContext();
  const [filterPeriod, setFilterPeriod] = useState('month');

  // Lọc dữ liệu theo thời gian
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

  const { startDate, endDate } = getDateRange(filterPeriod);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.date || order.orderDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }, [orders, startDate, endDate]);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }, [payments, startDate, endDate]);

  // Thống kê tổng quan
  const stats = useMemo(() => {
    return {
      // Đơn hàng
      totalOrders: filteredOrders.length,
      pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
      confirmedOrders: filteredOrders.filter(o => o.status === 'confirmed').length,
      shippedOrders: filteredOrders.filter(o => o.status === 'shipped').length,
      deliveredOrders: filteredOrders.filter(o => o.status === 'delivered').length,
      cancelledOrders: filteredOrders.filter(o => o.status === 'cancelled').length,
      
      // Thanh toán
      totalTransactions: filteredPayments.length,
      completedTransactions: filteredPayments.filter(p => p.status === 'completed').length,
      pendingTransactions: filteredPayments.filter(p => p.status === 'pending').length,
      refundedTransactions: filteredPayments.filter(p => p.status === 'refunded').length,
      
      // Doanh thu
      totalRevenue: filteredPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0),
      
      // Shop và Customer
      activeShops: [...new Set(filteredOrders.flatMap(o => o.shopIds || []))].length,
      uniqueCustomers: [...new Set(filteredOrders.map(o => o.userId))].length,
    };
  }, [filteredOrders, filteredPayments]);

  // Lấy tên khách hàng
  const getCustomerName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Unknown Customer';
  };

  // Lấy tên shop
  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : `Shop ${shopId}`;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            📊 Thống kê đơn hàng
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px'
          }}>
            Theo dõi tình hình đơn hàng và thanh toán trên toàn hệ thống
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="week">7 ngày qua</option>
            <option value="month">Tháng này</option>
            <option value="quarter">3 tháng qua</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Total Orders */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '2px solid #93c5fd',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📦 Tổng đơn hàng
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e40af',
            margin: '0 0 8px 0'
          }}>
            {stats.totalOrders}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            {stats.deliveredOrders} đã giao thành công
          </p>
        </div>

        {/* Total Revenue */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '2px solid #86efac',
          boxShadow: '0 4px 20px rgba(34, 197, 94, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#166534',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💰 Tổng doanh thu
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#166534',
            margin: '0 0 8px 0'
          }}>
            {stats.totalRevenue.toLocaleString()} VND
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Từ {stats.completedTransactions} giao dịch
          </p>
        </div>

        {/* Active Shops */}
        <div style={{
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '2px solid #c084fc',
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#581c87',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏪 Shop hoạt động
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#581c87',
            margin: '0 0 8px 0'
          }}>
            {stats.activeShops}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Có giao dịch trong kỳ
          </p>
        </div>

        {/* Unique Customers */}
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '2px solid #f59e0b',
          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#a16207',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👥 Khách hàng
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#a16207',
            margin: '0 0 8px 0'
          }}>
            {stats.uniqueCustomers}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Khách hàng duy nhất
          </p>
        </div>
      </div>

      {/* Order Status Overview */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📈 Trạng thái đơn hàng
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: '#fef3c7',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #f59e0b'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#a16207', marginBottom: '4px' }}>Chờ xác nhận</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#a16207' }}>{stats.pendingOrders}</div>
          </div>
          <div style={{
            background: '#eff6ff',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #3b82f6'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>Đã xác nhận</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>{stats.confirmedOrders}</div>
          </div>
          <div style={{
            background: '#f3e8ff',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #a855f7'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#581c87', marginBottom: '4px' }}>Đang giao</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#581c87' }}>{stats.shippedOrders}</div>
          </div>
          <div style={{
            background: '#f0fdf4',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>Đã giao</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>{stats.deliveredOrders}</div>
          </div>
          <div style={{
            background: '#fef2f2',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #ef4444'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>Đã hủy</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>{stats.cancelledOrders}</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Đơn hàng gần đây
        </h2>
        
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '16px', margin: 0 }}>
              Chưa có đơn hàng nào trong khoảng thời gian này
            </p>
          </div>
        ) : (
          <div style={{
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Mã đơn hàng</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Khách hàng</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Shop</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Tổng tiền</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Trạng thái</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 10).map(order => (
                  <tr key={order.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      padding: '16px',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      #{order.id}
                    </td>
                    <td style={{
                      padding: '16px',
                      color: '#374151'
                    }}>
                      {getCustomerName(order.userId)}
                    </td>
                    <td style={{
                      padding: '16px',
                      color: '#374151'
                    }}>
                      {order.shopIds ? order.shopIds.map(shopId => getShopName(shopId)).join(', ') : 'N/A'}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: order.status === 'pending' ? '#fef3c7' : 
                                       order.status === 'confirmed' ? '#eff6ff' :
                                       order.status === 'shipped' ? '#f3e8ff' :
                                       order.status === 'delivered' ? '#f0fdf4' : '#fef2f2',
                        color: order.status === 'pending' ? '#a16207' : 
                               order.status === 'confirmed' ? '#1e40af' :
                               order.status === 'shipped' ? '#581c87' :
                               order.status === 'delivered' ? '#166534' : '#dc2626',
                        border: order.status === 'pending' ? '1px solid #f59e0b' : 
                                order.status === 'confirmed' ? '1px solid #3b82f6' :
                                order.status === 'shipped' ? '1px solid #a855f7' :
                                order.status === 'delivered' ? '1px solid #22c55e' : '1px solid #ef4444'
                      }}>
                        {order.status === 'pending' ? '⏳ Chờ xác nhận' :
                         order.status === 'confirmed' ? '✅ Đã xác nhận' :
                         order.status === 'shipped' ? '🚚 Đang giao' :
                         order.status === 'delivered' ? '📦 Đã giao' : '❌ Đã hủy'}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      {new Date(order.date || order.orderDate).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderManagementPage;