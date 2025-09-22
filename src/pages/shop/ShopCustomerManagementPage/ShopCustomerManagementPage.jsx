import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const ShopCustomerManagementPage = () => {
  const { currentUser, orders, users, payments } = useAppContext();
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

  // Lọc orders của shop
  const shopOrders = useMemo(() => {
    return orders.filter(order => 
      order.shopIds && order.shopIds.includes(currentUser.id)
    );
  }, [orders, currentUser.id]);

  // Lọc orders theo thời gian
  const filteredOrders = useMemo(() => {
    return shopOrders.filter(order => {
      const orderDate = new Date(order.date || order.orderDate);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }, [shopOrders, startDate, endDate]);

  // Lấy danh sách khách hàng unique
  const customers = useMemo(() => {
    const customerMap = new Map();
    
    filteredOrders.forEach(order => {
      const userId = order.userId;
      if (!customerMap.has(userId)) {
        const user = users.find(u => u.id === userId);
        const customerOrders = filteredOrders.filter(o => o.userId === userId);
        const totalSpent = customerOrders.reduce((sum, order) => {
          const shopItems = order.items.filter(item => item.shopId === currentUser.id);
          return sum + shopItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
        }, 0);
        
        customerMap.set(userId, {
          id: userId,
          email: user ? user.email : 'Unknown',
          name: user ? user.name || user.email.split('@')[0] : 'Unknown',
          totalOrders: customerOrders.length,
          totalSpent: totalSpent,
          lastOrderDate: Math.max(...customerOrders.map(o => new Date(o.date || o.orderDate).getTime())),
          firstOrderDate: Math.min(...customerOrders.map(o => new Date(o.date || o.orderDate).getTime())),
          orders: customerOrders
        });
      }
    });
    
    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [filteredOrders, users, currentUser.id]);

  // Thống kê
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
    const averageOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;
    
    return {
      totalCustomers,
      totalRevenue,
      averageOrderValue,
      repeatCustomers,
      newCustomers: customers.filter(c => c.totalOrders === 1).length
    };
  }, [customers]);

  // Lấy thông tin chi tiết khách hàng
  const getCustomerDetails = (customerId) => {
    return customers.find(c => c.id === customerId);
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
            👥 Quản lý khách hàng
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px'
          }}>
            Theo dõi và phân tích khách hàng của shop
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
        {/* Total Customers */}
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
            👥 Tổng khách hàng
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e40af',
            margin: '0 0 8px 0'
          }}>
            {stats.totalCustomers}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            {stats.repeatCustomers} khách hàng quay lại
          </p>
        </div>

        {/* Total Revenue from Customers */}
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
            💰 Doanh thu từ khách hàng
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
            Trong khoảng thời gian này
          </p>
        </div>

        {/* Average Order Value */}
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
            📊 Giá trị trung bình
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#581c87',
            margin: '0 0 8px 0'
          }}>
            {stats.averageOrderValue.toLocaleString()} VND
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Trên mỗi khách hàng
          </p>
        </div>

        {/* New vs Repeat Customers */}
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
            🆕 Khách hàng mới
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#a16207',
            margin: '0 0 8px 0'
          }}>
            {stats.newCustomers}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            vs {stats.repeatCustomers} khách quay lại
          </p>
        </div>
      </div>

      {/* Customer List */}
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
          📋 Danh sách khách hàng
        </h2>
        
        {customers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
            <p style={{ fontSize: '16px', margin: 0 }}>
              Chưa có khách hàng nào trong khoảng thời gian này
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
                  }}>Khách hàng</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Số đơn hàng</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Tổng chi tiêu</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Loại khách</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Đơn hàng gần nhất</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Khách hàng từ</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(customer => (
                  <tr key={customer.id} style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <td style={{
                      padding: '16px',
                      color: '#1f2937'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{customer.name}</div>
                        <div style={{ fontSize: '14px', color: '#64748b' }}>{customer.email}</div>
                      </div>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {customer.totalOrders}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: '#059669'
                    }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent)}
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
                        backgroundColor: customer.totalOrders > 1 ? '#f0fdf4' : '#fef3c7',
                        color: customer.totalOrders > 1 ? '#166534' : '#a16207',
                        border: customer.totalOrders > 1 ? '1px solid #22c55e' : '1px solid #f59e0b'
                      }}>
                        {customer.totalOrders > 1 ? '🔄 Khách quay lại' : '🆕 Khách mới'}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      {new Date(customer.lastOrderDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      {new Date(customer.firstOrderDate).toLocaleDateString('vi-VN')}
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

export default ShopCustomerManagementPage;
