import React, { useState } from 'react';

const AdminPromotionsPage = () => {
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      name: 'Giảm giá 20% thời trang nam',
      description: 'Áp dụng cho tất cả sản phẩm thời trang nam',
      type: 'percentage',
      value: 20,
      minOrderValue: 500000,
      maxDiscount: 200000,
      startDate: '2025-09-20T00:00:00Z',
      endDate: '2025-09-30T23:59:59Z',
      status: 'active',
      usageCount: 45,
      maxUsage: 100,
      applicableProducts: ['Thời trang nam'],
      applicableUsers: 'all'
    },
    {
      id: 2,
      name: 'Freeship cho đơn hàng từ 300k',
      description: 'Miễn phí vận chuyển cho đơn hàng từ 300.000 VND',
      type: 'freeship',
      value: 0,
      minOrderValue: 300000,
      maxDiscount: 50000,
      startDate: '2025-09-15T00:00:00Z',
      endDate: '2025-10-15T23:59:59Z',
      status: 'active',
      usageCount: 78,
      maxUsage: 200,
      applicableProducts: ['all'],
      applicableUsers: 'all'
    },
    {
      id: 3,
      name: 'Giảm 100k cho khách hàng VIP',
      description: 'Áp dụng cho khách hàng có tổng đơn hàng trên 5 triệu',
      type: 'fixed',
      value: 100000,
      minOrderValue: 1000000,
      maxDiscount: 100000,
      startDate: '2025-09-10T00:00:00Z',
      endDate: '2025-12-31T23:59:59Z',
      status: 'active',
      usageCount: 12,
      maxUsage: 50,
      applicableProducts: ['all'],
      applicableUsers: 'vip'
    },
    {
      id: 4,
      name: 'Flash Sale 50% giày dép',
      description: 'Giảm giá 50% cho tất cả sản phẩm giày dép trong 24h',
      type: 'percentage',
      value: 50,
      minOrderValue: 0,
      maxDiscount: 500000,
      startDate: '2025-09-25T00:00:00Z',
      endDate: '2025-09-26T00:00:00Z',
      status: 'scheduled',
      usageCount: 0,
      maxUsage: 100,
      applicableProducts: ['Giày dép'],
      applicableUsers: 'all'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderValue: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    maxUsage: '',
    applicableProducts: [],
    applicableUsers: 'all'
  });

  const handleCreatePromotion = (e) => {
    e.preventDefault();
    const promotion = {
      id: Date.now(),
      ...newPromotion,
      value: parseFloat(newPromotion.value),
      minOrderValue: parseFloat(newPromotion.minOrderValue),
      maxDiscount: parseFloat(newPromotion.maxDiscount),
      maxUsage: parseInt(newPromotion.maxUsage),
      status: 'active',
      usageCount: 0
    };
    
    setPromotions(prev => [promotion, ...prev]);
    setNewPromotion({
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      minOrderValue: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      maxUsage: '',
      applicableProducts: [],
      applicableUsers: 'all'
    });
    setShowCreateForm(false);
  };

  const handleEditPromotion = (promotion) => {
    setEditingPromotion(promotion);
    setNewPromotion({
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value.toString(),
      minOrderValue: promotion.minOrderValue.toString(),
      maxDiscount: promotion.maxDiscount.toString(),
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      maxUsage: promotion.maxUsage.toString(),
      applicableProducts: promotion.applicableProducts,
      applicableUsers: promotion.applicableUsers
    });
    setShowCreateForm(true);
  };

  const handleUpdatePromotion = (e) => {
    e.preventDefault();
    const updatedPromotion = {
      ...editingPromotion,
      ...newPromotion,
      value: parseFloat(newPromotion.value),
      minOrderValue: parseFloat(newPromotion.minOrderValue),
      maxDiscount: parseFloat(newPromotion.maxDiscount),
      maxUsage: parseInt(newPromotion.maxUsage)
    };
    
    setPromotions(prev => prev.map(p => p.id === editingPromotion.id ? updatedPromotion : p));
    setShowCreateForm(false);
    setEditingPromotion(null);
  };

  const handleDeletePromotion = (promotionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?')) {
      setPromotions(prev => prev.filter(p => p.id !== promotionId));
    }
  };

  const handleStatusChange = (promotionId, newStatus) => {
    setPromotions(prev => prev.map(p => 
      p.id === promotionId ? { ...p, status: newStatus } : p
    ));
  };

  const filteredPromotions = promotions.filter(promotion => 
    filterStatus === 'all' || promotion.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'scheduled': return 'Đã lên lịch';
      case 'expired': return 'Đã hết hạn';
      case 'paused': return 'Tạm dừng';
      default: return 'Không xác định';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'percentage': return 'Phần trăm';
      case 'fixed': return 'Số tiền cố định';
      case 'freeship': return 'Miễn phí vận chuyển';
      default: return type;
    }
  };

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    scheduled: promotions.filter(p => p.status === 'scheduled').length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0)
  };

  const productCategories = ['Thời trang nam', 'Thời trang nữ', 'Giày dép', 'Phụ kiện'];

  return (
    <div className="admin-promotions-container p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🎉 Quản lý Khuyến mãi</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Tạo khuyến mãi mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Tổng khuyến mãi</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Đang hoạt động</h3>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">Đã lên lịch</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Tổng sử dụng</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalUsage}</p>
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
          <option value="active">Đang hoạt động</option>
          <option value="scheduled">Đã lên lịch</option>
          <option value="expired">Đã hết hạn</option>
          <option value="paused">Tạm dừng</option>
        </select>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPromotions.map(promotion => (
          <div key={promotion.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-800">{promotion.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(promotion.status)}`}>
                {getStatusText(promotion.status)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">{promotion.description}</p>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Loại:</span>
                <span className="font-medium">{getTypeText(promotion.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giá trị:</span>
                <span className="font-medium">
                  {promotion.type === 'percentage' ? `${promotion.value}%` : 
                   promotion.type === 'fixed' ? `${promotion.value.toLocaleString()} VND` :
                   'Miễn phí vận chuyển'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Đơn tối thiểu:</span>
                <span className="font-medium">{promotion.minOrderValue.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sử dụng:</span>
                <span className="font-medium">{promotion.usageCount}/{promotion.maxUsage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium text-xs">
                  {new Date(promotion.startDate).toLocaleDateString('vi-VN')} - 
                  {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleEditPromotion(promotion)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                ✏️ Chỉnh sửa
              </button>
              {promotion.status === 'active' ? (
                <button
                  onClick={() => handleStatusChange(promotion.id, 'paused')}
                  className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                >
                  ⏸️ Tạm dừng
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(promotion.id, 'active')}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  ▶️ Kích hoạt
                </button>
              )}
              <button
                onClick={() => handleDeletePromotion(promotion.id)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                🗑️ Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
            </h2>
            
            <form onSubmit={editingPromotion ? handleUpdatePromotion : handleCreatePromotion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên khuyến mãi</label>
                  <input
                    type="text"
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại khuyến mãi</label>
                  <select
                    value={newPromotion.type}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (VND)</option>
                    <option value="freeship">Miễn phí vận chuyển</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  rows="3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newPromotion.type === 'percentage' ? 'Phần trăm (%)' : 
                     newPromotion.type === 'fixed' ? 'Số tiền (VND)' : 'Giá trị'}
                  </label>
                  <input
                    type="number"
                    value={newPromotion.value}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (VND)</label>
                  <input
                    type="number"
                    value={newPromotion.minOrderValue}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, minOrderValue: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa (VND)</label>
                  <input
                    type="number"
                    value={newPromotion.maxDiscount}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, maxDiscount: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lần sử dụng tối đa</label>
                  <input
                    type="number"
                    value={newPromotion.maxUsage}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, maxUsage: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Áp dụng cho</label>
                  <select
                    value={newPromotion.applicableUsers}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, applicableUsers: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="all">Tất cả khách hàng</option>
                    <option value="vip">Khách hàng VIP</option>
                    <option value="new">Khách hàng mới</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục sản phẩm áp dụng</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {productCategories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newPromotion.applicableProducts.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewPromotion(prev => ({
                              ...prev,
                              applicableProducts: [...prev.applicableProducts, category]
                            }));
                          } else {
                            setNewPromotion(prev => ({
                              ...prev,
                              applicableProducts: prev.applicableProducts.filter(p => p !== category)
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingPromotion(null);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
            
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingPromotion(null);
              }}
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

export default AdminPromotionsPage;
