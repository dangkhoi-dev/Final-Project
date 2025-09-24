import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import './AdminPromotionsPage.css';

const AdminPromotionsPage = () => {
  const { promotions, setPromotions } = useAppContext();
  /* Fallback seed if context has no promotions */
  const [seeded] = useState(false);
  const [localPromotions, setLocalPromotions] = useState([
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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('startDate');

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

  const promoSource = promotions && promotions.length ? promotions : localPromotions;

  const filteredPromotions = useMemo(() => {
    const byStatus = promoSource.filter(promotion => filterStatus === 'all' || promotion.status === filterStatus);
    const bySearch = byStatus.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    const sorted = [...bySearch].sort((a, b) => {
      if (sortBy === 'startDate') return new Date(b.startDate) - new Date(a.startDate);
      if (sortBy === 'endDate') return new Date(a.endDate) - new Date(b.endDate);
      if (sortBy === 'usage') return (b.usageCount || 0) - (a.usageCount || 0);
      return 0;
    });
    return sorted;
  }, [promoSource, filterStatus, search, sortBy]);

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
    <div className="admin-promotions">
      <div className="admin-promotions__header">
        <h1 className="admin-title">🎉 Quản lý Khuyến mãi</h1>
        <div className="controls">
          <div className="search">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên/mô tả..." />
            <span className="icon">🔍</span>
            {search && (<button className="clear" onClick={() => setSearch('')}>✕</button>)}
          </div>
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="startDate">Mới tạo gần đây</option>
            <option value="endDate">Sắp hết hạn</option>
            <option value="usage">Lượt sử dụng nhiều</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowCreateForm(true)}><span>➕</span> Tạo khuyến mãi</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats">
        <div className="stat"><h3>Tổng khuyến mãi</h3><div className="value">{stats.total}</div></div>
        <div className="stat"><h3>Đang hoạt động</h3><div className="value">{stats.active}</div></div>
        <div className="stat"><h3>Đã lên lịch</h3><div className="value">{stats.scheduled}</div></div>
        <div className="stat"><h3>Tổng sử dụng</h3><div className="value">{stats.totalUsage}</div></div>
      </div>

      {/* Filters */}
      <div className="filters">
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'active', label: 'Đang hoạt động' },
          { key: 'scheduled', label: 'Đã lên lịch' },
          { key: 'expired', label: 'Đã hết hạn' },
          { key: 'paused', label: 'Tạm dừng' }
        ].map(f => (
          <button key={f.key} onClick={() => setFilterStatus(f.key)} className={`filter-btn ${filterStatus === f.key ? 'active' : ''}`}>{f.label}</button>
        ))}
        <div className="result"><span>Kết quả:</span><span className="badge">{filteredPromotions.length}</span></div>
      </div>

      {/* Promotions List */}
      <div className="promotions-grid">
        {filteredPromotions.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            Không có khuyến mãi nào khớp bộ lọc/tìm kiếm
          </div>
        ) : filteredPromotions.map(promotion => (
          <div key={promotion.id} className="promotion-card">
            <div className={`ribbon ${promotion.status === 'active' ? 'active' : promotion.status === 'scheduled' ? 'scheduled' : promotion.status === 'expired' ? 'expired' : 'paused'}`}></div>
            <div className="promotion-card__head">
              <h3 className="promotion-card__title">{promotion.name}</h3>
              <span className={`status-badge ${promotion.status === 'active' ? 'status-active' : promotion.status === 'scheduled' ? 'status-scheduled' : promotion.status === 'expired' ? 'status-expired' : ''}`}>{getStatusText(promotion.status)}</span>
            </div>
            <p className="promotion-desc">{promotion.description}</p>
            <div className="chips">
              <span className="chip type">{getTypeText(promotion.type)}</span>
              <span className="chip value">{promotion.type === 'percentage' ? `${promotion.value}%` : promotion.type === 'fixed' ? `${promotion.value.toLocaleString()} VND` : 'Freeship'}</span>
            </div>
            <div className="promotion-meta">
              <div className="row"><span className="label">Loại:</span><span className="value">{getTypeText(promotion.type)}</span></div>
              <div className="row"><span className="label">Giá trị:</span><span className="value">{promotion.type === 'percentage' ? `${promotion.value}%` : promotion.type === 'fixed' ? `${promotion.value.toLocaleString()} VND` : 'Miễn phí vận chuyển'}</span></div>
              <div className="row"><span className="label">Đơn tối thiểu:</span><span className="value">{promotion.minOrderValue.toLocaleString()} VND</span></div>
              <div className="row"><span className="label">Sử dụng:</span><span className="value">{promotion.usageCount}/{promotion.maxUsage}</span></div>
              <div className="row"><span className="label">Thời gian:</span><span className="value">{new Date(promotion.startDate).toLocaleDateString('vi-VN')} - {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</span></div>
            </div>
            <div className="card-actions">
              <button className="btn btn-blue" onClick={() => handleEditPromotion(promotion)}>✏️ Chỉnh sửa</button>
              {promotion.status === 'active' ? (
                <button className="btn btn-yellow" onClick={() => handleStatusChange(promotion.id, 'paused')}>⏸️ Tạm dừng</button>
              ) : (
                <button className="btn btn-green" onClick={() => handleStatusChange(promotion.id, 'active')}>▶️ Kích hoạt</button>
              )}
              <button className="btn btn-red" onClick={() => handleDeletePromotion(promotion.id)}>🗑️ Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}</h2>
            <form onSubmit={editingPromotion ? handleUpdatePromotion : handleCreatePromotion}>
              <div className="form-grid cols-2">
                <div>
                  <label className="form-label">Tên khuyến mãi</label>
                  <input type="text" className="form-input" value={newPromotion.name} onChange={(e) => setNewPromotion(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">Loại khuyến mãi</label>
                  <select className="form-select" value={newPromotion.type} onChange={(e) => setNewPromotion(prev => ({ ...prev, type: e.target.value }))}>
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền (VND)</option>
                    <option value="freeship">Miễn phí vận chuyển</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Mô tả</label>
                <textarea className="form-textarea" rows="3" value={newPromotion.description} onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))} required />
              </div>
              <div className="form-grid cols-3">
                <div>
                  <label className="form-label">{newPromotion.type === 'percentage' ? 'Phần trăm (%)' : newPromotion.type === 'fixed' ? 'Số tiền (VND)' : 'Giá trị'}</label>
                  <input type="number" className="form-input" value={newPromotion.value} onChange={(e) => setNewPromotion(prev => ({ ...prev, value: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">Đơn tối thiểu (VND)</label>
                  <input type="number" className="form-input" value={newPromotion.minOrderValue} onChange={(e) => setNewPromotion(prev => ({ ...prev, minOrderValue: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">Giảm tối đa (VND)</label>
                  <input type="number" className="form-input" value={newPromotion.maxDiscount} onChange={(e) => setNewPromotion(prev => ({ ...prev, maxDiscount: e.target.value }))} required />
                </div>
              </div>
              <div className="form-grid cols-2">
                <div>
                  <label className="form-label">Ngày bắt đầu</label>
                  <input type="date" className="form-input" value={newPromotion.startDate} onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">Ngày kết thúc</label>
                  <input type="date" className="form-input" value={newPromotion.endDate} onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))} required />
                </div>
              </div>
              <div className="form-grid cols-2">
                <div>
                  <label className="form-label">Số lần sử dụng tối đa</label>
                  <input type="number" className="form-input" value={newPromotion.maxUsage} onChange={(e) => setNewPromotion(prev => ({ ...prev, maxUsage: e.target.value }))} required />
                </div>
                <div>
                  <label className="form-label">Áp dụng cho</label>
                  <select className="form-select" value={newPromotion.applicableUsers} onChange={(e) => setNewPromotion(prev => ({ ...prev, applicableUsers: e.target.value }))}>
                    <option value="all">Tất cả khách hàng</option>
                    <option value="vip">Khách hàng VIP</option>
                    <option value="new">Khách hàng mới</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Danh mục sản phẩm áp dụng</label>
                <div className="form-grid cols-2" style={{gap:'8px', marginTop:'8px'}}>
                  {productCategories.map(category => (
                    <label key={category} style={{display:'flex', alignItems:'center', gap:'6px'}}>
                      <input type="checkbox" checked={newPromotion.applicableProducts.includes(category)} onChange={(e) => {
                        if (e.target.checked) {
                          setNewPromotion(prev => ({ ...prev, applicableProducts: [...prev.applicableProducts, category] }));
                        } else {
                          setNewPromotion(prev => ({ ...prev, applicableProducts: prev.applicableProducts.filter(p => p !== category) }));
                        }
                      }} />
                      {category}
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-gray" onClick={() => { setShowCreateForm(false); setEditingPromotion(null); }}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editingPromotion ? 'Cập nhật' : 'Tạo mới'}</button>
              </div>
            </form>
            <button className="modal-close" onClick={() => { setShowCreateForm(false); setEditingPromotion(null); }}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromotionsPage;
