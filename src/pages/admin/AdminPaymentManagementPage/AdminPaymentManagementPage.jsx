import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const AdminPaymentManagementPage = () => {
  const { payments, users, shops, orders } = useAppContext();
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [filterStatus, setFilterStatus] = useState('all');

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

  const filteredPayments = useMemo(() => {
    let filtered = payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= startDate && paymentDate <= endDate;
    });

    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === filterStatus);
    }

    return filtered;
  }, [payments, startDate, endDate, filterStatus]);

  // Thống kê tổng quan
  const stats = useMemo(() => {
    return {
      // Giao dịch
      totalTransactions: filteredPayments.length,
      completedTransactions: filteredPayments.filter(p => p.status === 'completed').length,
      pendingTransactions: filteredPayments.filter(p => p.status === 'pending').length,
      refundedTransactions: filteredPayments.filter(p => p.status === 'refunded').length,
      
      // Doanh thu
      totalRevenue: filteredPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, payment) => sum + payment.amount, 0),
      totalRefunded: filteredPayments
        .filter(p => p.status === 'refunded')
        .reduce((sum, payment) => sum + (payment.refundAmount || payment.amount), 0),
      netRevenue: 0, // Sẽ tính ở dưới
      
      // Shop và Customer
      activeShops: [...new Set(filteredPayments.map(p => p.shopId).filter(Boolean))].length,
      uniqueCustomers: [...new Set(filteredPayments.map(p => p.userId))].length,
      
      // Phương thức thanh toán
      creditCardPayments: filteredPayments.filter(p => p.method === 'credit_card').length,
      bankTransferPayments: filteredPayments.filter(p => p.method === 'bank_transfer').length,
    };
  }, [filteredPayments]);

  // Tính net revenue
  stats.netRevenue = stats.totalRevenue - stats.totalRefunded;

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

  // Lấy thông tin đơn hàng
  const getOrderInfo = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    return order ? {
      total: order.total,
      status: order.status,
      items: order.items
    } : null;
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
            💳 Báo cáo thanh toán
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px'
          }}>
            Theo dõi tình hình giao dịch và doanh thu trên toàn hệ thống
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
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
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
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="pending">Đang chờ</option>
            <option value="refunded">Đã hoàn tiền</option>
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

        {/* Net Revenue */}
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
            📊 Doanh thu thực
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e40af',
            margin: '0 0 8px 0'
          }}>
            {stats.netRevenue.toLocaleString()} VND
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Sau khi trừ hoàn tiền
          </p>
        </div>

        {/* Total Transactions */}
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
            💳 Tổng giao dịch
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#581c87',
            margin: '0 0 8px 0'
          }}>
            {stats.totalTransactions}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            {stats.completedTransactions} hoàn thành
          </p>
        </div>

        {/* Refunded Amount */}
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '2px solid #fca5a5',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#dc2626',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💸 Đã hoàn tiền
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#dc2626',
            margin: '0 0 8px 0'
          }}>
            {stats.totalRefunded.toLocaleString()} VND
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Từ {stats.refundedTransactions} giao dịch
          </p>
        </div>
      </div>

      {/* Payment Status Overview */}
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
          📈 Trạng thái giao dịch
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: '#f0fdf4',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>Hoàn thành</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>{stats.completedTransactions}</div>
          </div>
          <div style={{
            background: '#fef3c7',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #f59e0b'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#a16207', marginBottom: '4px' }}>Đang chờ</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#a16207' }}>{stats.pendingTransactions}</div>
          </div>
          <div style={{
            background: '#fef2f2',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #ef4444'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>Đã hoàn tiền</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#dc2626' }}>{stats.refundedTransactions}</div>
          </div>
        </div>
      </div>

      {/* Payment Methods Overview */}
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
          💳 Phương thức thanh toán
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{
            background: '#f0fdf4',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #22c55e'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '4px' }}>Thẻ tín dụng</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534' }}>{stats.creditCardPayments}</div>
          </div>
          <div style={{
            background: '#eff6ff',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #3b82f6'
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>Chuyển khoản</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>{stats.bankTransferPayments}</div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
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
          📋 Giao dịch gần đây
        </h2>
        
        {filteredPayments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <p style={{ fontSize: '16px', margin: 0 }}>
              Chưa có giao dịch nào trong khoảng thời gian này
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
                  }}>Mã giao dịch</th>
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
                  }}>Số tiền</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Phương thức</th>
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
                  }}>Ngày thanh toán</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.slice(0, 10).map(payment => (
                  <tr key={payment.id} style={{
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
                      {payment.transactionId}
                    </td>
                    <td style={{
                      padding: '16px',
                      color: '#374151'
                    }}>
                      {getCustomerName(payment.userId)}
                    </td>
                    <td style={{
                      padding: '16px',
                      color: '#374151'
                    }}>
                      {payment.shopId ? getShopName(payment.shopId) : 'N/A'}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: payment.status === 'completed' ? '#059669' : 
                             payment.status === 'refunded' ? '#dc2626' : '#6b7280'
                    }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#374151',
                      fontSize: '14px'
                    }}>
                      {payment.method === 'credit_card' ? '💳 Thẻ tín dụng' : '🏦 Chuyển khoản'}
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
                        backgroundColor: payment.status === 'completed' ? '#f0fdf4' : 
                                       payment.status === 'pending' ? '#fef3c7' : '#fef2f2',
                        color: payment.status === 'completed' ? '#166534' : 
                               payment.status === 'pending' ? '#a16207' : '#dc2626',
                        border: payment.status === 'completed' ? '1px solid #22c55e' : 
                                payment.status === 'pending' ? '1px solid #f59e0b' : '1px solid #ef4444'
                      }}>
                        {payment.status === 'completed' ? '✅ Hoàn thành' :
                         payment.status === 'pending' ? '⏳ Đang chờ' : '💸 Đã hoàn tiền'}
                      </span>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('vi-VN') : 'N/A'}
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

export default AdminPaymentManagementPage;