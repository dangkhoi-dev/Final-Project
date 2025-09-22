import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotification } from '../../../contexts/NotificationContext';
import './ShopProductManagementPage.css';

const ShopProductManagementPage = () => {
  const navigate = useNavigate();
  const { currentUser, products, setProducts } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  
  const shopProducts = products.filter(p => p.shopId === currentUser.id);
  
  const filteredProducts = shopProducts.filter(product => 
    filterStatus === 'all' || product.status === filterStatus
  );

  const handleDelete = (productId) => {
    if(window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== productId));
      showSuccess('Sản phẩm đã được xóa thành công!');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? { ...updatedProduct, status: 'pending' } : p
    ));
    setEditingProduct(null);
    showSuccess('Sản phẩm đã được cập nhật và gửi lại để duyệt!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Bị từ chối';
      default: return 'Không xác định';
    }
  };

  const stats = {
    total: shopProducts.length,
    approved: shopProducts.filter(p => p.status === 'approved').length,
    pending: shopProducts.filter(p => p.status === 'pending').length,
    rejected: shopProducts.filter(p => p.status === 'rejected').length
  };

  return (
    <div className="shop-product-container p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📦 Quản lý Sản phẩm</h1>
        <button
          onClick={() => navigate('/shop/add-product')}
          style={{
            background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
            color: '#581c87',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '2px solid #c084fc',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(168, 85, 247, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.2)';
            e.target.style.borderColor = '#a855f7';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(168, 85, 247, 0.1)';
            e.target.style.borderColor = '#c084fc';
          }}
        >
          <span>➕</span>
          Đăng sản phẩm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Tổng sản phẩm</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Đã duyệt</h3>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">Chờ duyệt</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-800">Bị từ chối</h3>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
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
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
          <option value="rejected">Bị từ chối</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Sản phẩm</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Giá</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Danh mục</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Trạng thái</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Ngày đăng</th>
              <th style={{ padding: '12px 24px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm" style={{ color: '#1f2937 !important' }}>
            {filteredProducts.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{product.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 24px', color: '#1f2937' }}>
                  <span style={{ fontWeight: '600', color: '#15803d' }}>
                    {product.price.toLocaleString()} VND
                  </span>
                </td>
                <td style={{ padding: '12px 24px', color: '#1f2937' }}>{product.category}</td>
                <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                  {product.rejectionReason && (
                    <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                      {product.rejectionReason}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                  {new Date(product.submittedAt).toLocaleDateString('vi-VN')}
                </td>
                <td style={{ padding: '12px 24px', textAlign: 'center', color: '#1f2937' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có sản phẩm nào</h3>
          <p className="text-gray-600 mb-4">Bắt đầu đăng bán sản phẩm đầu tiên của bạn</p>
          <button
            onClick={() => navigate('/shop/add-product')}
            style={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              color: '#581c87',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '2px solid #c084fc',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(168, 85, 247, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.2)';
              e.target.style.borderColor = '#a855f7';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(168, 85, 247, 0.1)';
              e.target.style.borderColor = '#c084fc';
            }}
          >
            ➕ Đăng sản phẩm mới
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopProductManagementPage;
