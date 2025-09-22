import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotification } from '../../../contexts/NotificationContext';

const AdminProductManagementPage = () => {
  const { allProducts, setProducts, shops } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Lọc sản phẩm theo trạng thái
  const filteredProducts = useMemo(() => {
    if (filterStatus === 'all') return allProducts;
    return allProducts.filter(product => product.status === filterStatus);
  }, [allProducts, filterStatus]);

  // Thống kê
  const stats = useMemo(() => {
    return {
      total: allProducts.length,
      pending: allProducts.filter(p => p.status === 'pending').length,
      approved: allProducts.filter(p => p.status === 'approved').length,
      rejected: allProducts.filter(p => p.status === 'rejected').length
    };
  }, [allProducts]);

  // Lấy tên shop
  const getShopName = (shopId) => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : 'Unknown Shop';
  };

  // Phê duyệt sản phẩm
  const handleApprove = (productId) => {
    const updatedProducts = allProducts.map(product => 
      product.id === productId 
        ? { ...product, status: 'approved', reviewedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    showSuccess('Sản phẩm đã được phê duyệt!');
  };

  // Từ chối sản phẩm
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      showError('Vui lòng nhập lý do từ chối!');
      return;
    }

    const updatedProducts = allProducts.map(product => 
      product.id === selectedProduct.id 
        ? { 
            ...product, 
            status: 'rejected', 
            reviewedAt: new Date().toISOString(),
            rejectionReason: rejectionReason.trim()
          }
        : product
    );
    setProducts(updatedProducts);
    showSuccess('Sản phẩm đã bị từ chối!');
    setIsModalOpen(false);
    setSelectedProduct(null);
    setRejectionReason('');
  };

  // Mở modal từ chối
  const openRejectModal = (product) => {
    setSelectedProduct(product);
    setRejectionReason('');
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setRejectionReason('');
  };

  // Xóa sản phẩm
  const handleDelete = (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) {
      const updatedProducts = allProducts.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      showSuccess('Sản phẩm đã được xóa!');
    }
  };

  // Lấy màu status
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Lấy text status
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Chờ duyệt';
      case 'approved': return '✅ Đã duyệt';
      case 'rejected': return '❌ Bị từ chối';
      default: return 'Unknown';
    }
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
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: 0
        }}>
          🔍 Kiểm duyệt Sản phẩm
        </h1>
        
        {/* Filter */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontWeight: '600', color: '#374151' }}>Lọc theo:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Bị từ chối</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Tổng sản phẩm</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Chờ duyệt</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.pending}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Đã duyệt</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.approved}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Bị từ chối</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.rejected}</p>
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Sản phẩm</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Cửa hàng</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Giá</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Trạng thái</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Ngày gửi</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product.id} style={{ 
                borderBottom: index < filteredProducts.length - 1 ? '1px solid #e5e7eb' : 'none',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '8px' 
                      }}
                    />
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {product.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', color: '#374151' }}>
                  {getShopName(product.shopId)}
                </td>
                <td style={{ padding: '16px', fontWeight: '600', color: '#059669' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'white',
                    background: getStatusColor(product.status)
                  }}>
                    {getStatusText(product.status)}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>
                  {new Date(product.submittedAt).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {product.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(product.id)}
                          style={{
                            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                            color: '#166534',
                            border: '2px solid #86efac',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          ✅ Duyệt
                        </button>
                        <button
                          onClick={() => openRejectModal(product)}
                          style={{
                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                            color: '#dc2626',
                            border: '2px solid #fca5a5',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          ❌ Từ chối
                        </button>
                      </>
                    )}
                    
                    {/* Nút xóa cho tất cả sản phẩm */}
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        color: '#374151',
                        border: '2px solid #d1d5db',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                  
                  {product.status === 'rejected' && product.rejectionReason && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#ef4444', 
                      maxWidth: '200px', 
                      marginTop: '8px',
                      padding: '8px',
                      background: '#fef2f2',
                      borderRadius: '4px',
                      border: '1px solid #fecaca'
                    }}>
                      <strong>Lý do từ chối:</strong> {product.rejectionReason}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px', 
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Không có sản phẩm nào phù hợp với bộ lọc
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {isModalOpen && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              margin: '0 0 16px', 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              ❌ Từ chối sản phẩm
            </h2>
            
            <div style={{ marginBottom: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '600' }}>
                {selectedProduct.name}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                {selectedProduct.category} • {getShopName(selectedProduct.shopId)}
              </p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Lý do từ chối *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do từ chối sản phẩm..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '2px solid #d1d5db',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                style={{
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  color: '#dc2626',
                  border: '2px solid #fca5a5',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                ❌ Từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagementPage;
