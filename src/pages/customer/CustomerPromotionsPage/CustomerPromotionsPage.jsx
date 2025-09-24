import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import './CustomerPromotionsPage.css';

const CustomerPromotionsPage = () => {
  const { promotions } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('active');
  const [search, setSearch] = useState('');
  const [showMobilePanel, setShowMobilePanel] = useState(false);

    const stats = useMemo(() => ({
    total: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    scheduled: promotions.filter(p => p.status === 'scheduled').length,
    expired: promotions.filter(p => p.status === 'expired').length,
  }), [promotions]);

  const filtered = useMemo(() => {
    return promotions
      .filter(p => statusFilter === 'all' || p.status === statusFilter)
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
  }, [promotions, statusFilter, search]);

  const getTypeText = (type) => {
    switch (type) {
      case 'percentage': return 'Phần trăm';
      case 'fixed': return 'Số tiền cố định';
      case 'freeship': return 'Miễn phí vận chuyển';
      default: return type;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'expired': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderValue = (p) => {
    if (p.type === 'percentage') return `${p.value}%`;
    if (p.type === 'fixed') return `${p.value.toLocaleString()} VND`;
    return 'Freeship';
  };

  return (
    <div className="cp-container">
      <div className="cp-hero">
        <div className="cp-hero-head">
          <div>
            <h1>🎉 Khuyến mãi & Ưu đãi</h1>
            <p>Khám phá các ưu đãi đang diễn ra dành cho bạn</p>
          </div>
          <div className="cp-hero-stats">
            <div className="cp-stat cp-stat--active">
              <div className="cp-stat-label">Đang hoạt động</div>
              <div className="cp-stat-value">{stats.active}</div>
            </div>
            <div className="cp-stat cp-stat--scheduled">
              <div className="cp-stat-label">Đã lên lịch</div>
              <div className="cp-stat-value">{stats.scheduled}</div>
            </div>
            <div className="cp-stat cp-stat--expired">
              <div className="cp-stat-label">Đã hết hạn</div>
              <div className="cp-stat-value">{stats.expired}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="cp-toolbar">
        <button
          type="button"
          className="cp-mobile-toggle"
          onClick={() => setShowMobilePanel(!showMobilePanel)}
        >
          ☰ Bộ lọc & Tìm kiếm
          <span className="cp-result-badge">{filtered.length}</span>
        </button>

        <div className="cp-desktop-controls cp-search">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc mô tả khuyến mãi..."
            aria-label="Tìm khuyến mãi"
            className="cp-search-input"
          />
          <span className="cp-search-icon">🔍</span>
          {search && (
            <button type="button" onClick={() => setSearch('')} className="cp-clear-btn" aria-label="Xóa tìm kiếm" title="Xóa">✕</button>
          )}
          <div className="cp-hint">Gõ để tìm nhanh khuyến mãi phù hợp</div>
        </div>
        <div className="cp-desktop-controls cp-filters">
          {[
            { key: 'active', label: 'Đang hoạt động', count: stats.active },
            { key: 'scheduled', label: 'Đã lên lịch', count: stats.scheduled },
            { key: 'expired', label: 'Đã hết hạn', count: stats.expired },
            { key: 'all', label: 'Tất cả', count: stats.total },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`cp-filter-btn ${statusFilter === f.key ? 'cp-filter-btn--active' : ''}`}
            >
              <span>{f.label}</span>
              <span className="cp-filter-count">{f.count}</span>
            </button>
          ))}
        </div>
        <div className="cp-desktop-controls cp-result">
          <span className="cp-result-label">Kết quả:</span>
          <span className="cp-result-badge">{filtered.length}</span>
        </div>
        <div className={`cp-mobile-panel ${showMobilePanel ? 'open' : ''}`}>
          <div className="cp-search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc mô tả khuyến mãi..."
              aria-label="Tìm khuyến mãi"
              className="cp-search-input"
            />
            <span className="cp-search-icon">🔍</span>
            {search && (
              <button type="button" onClick={() => setSearch('')} className="cp-clear-btn" aria-label="Xóa tìm kiếm" title="Xóa">✕</button>
            )}
            <div className="cp-hint">Gõ để tìm nhanh khuyến mãi phù hợp</div>
          </div>
          <div className="cp-filters">
            {[
              { key: 'active', label: 'Đang hoạt động', count: stats.active },
              { key: 'scheduled', label: 'Đã lên lịch', count: stats.scheduled },
              { key: 'expired', label: 'Đã hết hạn', count: stats.expired },
              { key: 'all', label: 'Tất cả', count: stats.total },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => { setStatusFilter(f.key); setShowMobilePanel(false); }}
                className={`cp-filter-btn ${statusFilter === f.key ? 'cp-filter-btn--active' : ''}`}
              >
                <span>{f.label}</span>
                <span className="cp-filter-count">{f.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="cp-empty">
          <div className="cp-empty-icon">🪄</div>
          <div className="cp-empty-title">Không có khuyến mãi phù hợp</div>
          <div className="cp-empty-desc">Thử đổi bộ lọc hoặc từ khóa tìm kiếm</div>
        </div>
      ) : (
        <div className="cp-grid">
          {filtered.map(p => (
            <div key={p.id} className="cp-card">
              <div className="cp-card-head">
                <h3 className="cp-card-title">{p.name}</h3>
                <span className={`cp-badge ${p.status === 'active' ? 'cp-badge--active' : p.status === 'scheduled' ? 'cp-badge--scheduled' : 'cp-badge--expired'}`}>
                  {p.status === 'active' ? 'Đang hoạt động' : p.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hết hạn'}
                </span>
              </div>
              <p className="cp-card-desc">{p.description}</p>

              <div className="cp-type-row">
                <div className="cp-type">{getTypeText(p.type)}</div>
                <div className="cp-value">{renderValue(p)}</div>
              </div>

              <div className="cp-meta">
                <div className="cp-meta-row"><span className="cp-meta-label">Đơn tối thiểu</span><span className="cp-meta-value">{p.minOrderValue.toLocaleString()} VND</span></div>
                <div className="cp-meta-row"><span className="cp-meta-label">Thời gian</span><span className="cp-meta-value">{new Date(p.startDate).toLocaleDateString('vi-VN')} - {new Date(p.endDate).toLocaleDateString('vi-VN')}</span></div>
                <div className="cp-meta-row"><span className="cp-meta-label">Đối tượng</span><span className="cp-meta-value">{p.applicableUsers === 'all' ? 'Tất cả' : p.applicableUsers.toUpperCase()}</span></div>
              </div>

              <button className="cp-apply-btn">⚡ Áp dụng tại thanh toán</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerPromotionsPage;


