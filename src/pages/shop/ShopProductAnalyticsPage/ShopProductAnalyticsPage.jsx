import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const ShopProductAnalyticsPage = () => {
  const { currentUser, products, orders } = useAppContext();
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

  // Lọc sản phẩm của shop
  const shopProducts = useMemo(() => {
    return products.filter(product => product.shopId === currentUser.id);
  }, [products, currentUser.id]);

  // Lọc orders của shop theo thời gian
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.date || order.orderDate);
      const isShopOrder = order.shopIds && order.shopIds.includes(currentUser.id);
      return isShopOrder && orderDate >= startDate && orderDate <= endDate;
    });
  }, [orders, currentUser.id, startDate, endDate]);

  // Phân tích hiệu suất sản phẩm
  const productAnalytics = useMemo(() => {
    const analytics = {};
    
    // Khởi tạo analytics cho tất cả sản phẩm
    shopProducts.forEach(product => {
      analytics[product.id] = {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        status: product.status,
        image: product.image,
        totalSold: 0,
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        lastSoldDate: null,
        orders: []
      };
    });
    
    // Tính toán từ orders
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.shopId === currentUser.id && analytics[item.id]) {
          analytics[item.id].totalSold += item.quantity;
          analytics[item.id].totalRevenue += item.price * item.quantity;
          analytics[item.id].totalOrders += 1;
          analytics[item.id].orders.push(order);
          
          const orderDate = new Date(order.date || order.orderDate);
          if (!analytics[item.id].lastSoldDate || orderDate > analytics[item.id].lastSoldDate) {
            analytics[item.id].lastSoldDate = orderDate;
          }
        }
      });
    });
    
    // Tính average order value
    Object.values(analytics).forEach(product => {
      product.averageOrderValue = product.totalOrders > 0 ? product.totalRevenue / product.totalOrders : 0;
    });
    
    return Object.values(analytics).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [shopProducts, filteredOrders, currentUser.id]);

  // Thống kê tổng quan
  const stats = useMemo(() => {
    const totalProducts = shopProducts.length;
    const approvedProducts = shopProducts.filter(p => p.status === 'approved').length;
    const totalSold = productAnalytics.reduce((sum, product) => sum + product.totalSold, 0);
    const totalRevenue = productAnalytics.reduce((sum, product) => sum + product.totalRevenue, 0);
    const bestSellingProduct = productAnalytics.length > 0 ? productAnalytics[0] : null;
    const topCategories = {};
    
    productAnalytics.forEach(product => {
      if (product.totalSold > 0) {
        topCategories[product.category] = (topCategories[product.category] || 0) + product.totalSold;
      }
    });
    
    const topCategory = Object.entries(topCategories).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalProducts,
      approvedProducts,
      totalSold,
      totalRevenue,
      bestSellingProduct,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      averageProductValue: totalProducts > 0 ? totalRevenue / totalProducts : 0
    };
  }, [shopProducts, productAnalytics]);

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
            📊 Phân tích sản phẩm
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px'
          }}>
            Theo dõi hiệu suất và doanh số của từng sản phẩm
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
        {/* Total Products */}
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
            📦 Tổng sản phẩm
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e40af',
            margin: '0 0 8px 0'
          }}>
            {stats.totalProducts}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            {stats.approvedProducts} đã được duyệt
          </p>
        </div>

        {/* Total Sold */}
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
            🛒 Đã bán
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#166534',
            margin: '0 0 8px 0'
          }}>
            {stats.totalSold}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Sản phẩm trong kỳ
          </p>
        </div>

        {/* Total Revenue */}
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
            💰 Doanh thu
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#581c87',
            margin: '0 0 8px 0'
          }}>
            {stats.totalRevenue.toLocaleString()} VND
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Từ bán sản phẩm
          </p>
        </div>

        {/* Best Selling Category */}
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
            🏆 Danh mục hot
          </h3>
          <p style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#a16207',
            margin: '0 0 8px 0'
          }}>
            {stats.topCategory}
          </p>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0
          }}>
            Bán chạy nhất
          </p>
        </div>
      </div>

      {/* Best Selling Product Highlight */}
      {stats.bestSellingProduct && (
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          padding: '24px',
          borderRadius: '16px',
          border: '2px solid #fca5a5',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏆 Sản phẩm bán chạy nhất
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <img 
              src={stats.bestSellingProduct.image} 
              alt={stats.bestSellingProduct.name}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px'
              }}>
                {stats.bestSellingProduct.name}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Đã bán</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#059669' }}>
                    {stats.bestSellingProduct.totalSold} sản phẩm
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Doanh thu</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#059669' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.bestSellingProduct.totalRevenue)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>Số đơn hàng</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#059669' }}>
                    {stats.bestSellingProduct.totalOrders} đơn
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Performance Table */}
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
          📋 Hiệu suất sản phẩm
        </h2>
        
        {productAnalytics.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <p style={{ fontSize: '16px', margin: 0 }}>
              Chưa có dữ liệu bán hàng trong khoảng thời gian này
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
                  }}>Sản phẩm</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Đã bán</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Doanh thu</th>
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
                  }}>Giá trị TB/đơn</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Lần bán cuối</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {productAnalytics.map(product => (
                  <tr key={product.id} style={{
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
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{product.name}</div>
                          <div style={{ fontSize: '14px', color: '#64748b' }}>{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '600',
                      color: product.totalSold > 0 ? '#059669' : '#6b7280'
                    }}>
                      {product.totalSold || 0}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: product.totalRevenue > 0 ? '#059669' : '#6b7280'
                    }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.totalRevenue)}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#374151'
                    }}>
                      {product.totalOrders}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'right',
                      color: '#374151'
                    }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.averageOrderValue)}
                    </td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      {product.lastSoldDate ? new Date(product.lastSoldDate).toLocaleDateString('vi-VN') : 'Chưa bán'}
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
                        backgroundColor: product.status === 'approved' ? '#f0fdf4' : 
                                       product.status === 'pending' ? '#fef3c7' : '#fef2f2',
                        color: product.status === 'approved' ? '#166534' : 
                               product.status === 'pending' ? '#a16207' : '#dc2626',
                        border: product.status === 'approved' ? '1px solid #22c55e' : 
                                product.status === 'pending' ? '1px solid #f59e0b' : '1px solid #ef4444'
                      }}>
                        {product.status === 'approved' ? '✅ Đã duyệt' :
                         product.status === 'pending' ? '⏳ Chờ duyệt' : '❌ Bị từ chối'}
                      </span>
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

export default ShopProductAnalyticsPage;
