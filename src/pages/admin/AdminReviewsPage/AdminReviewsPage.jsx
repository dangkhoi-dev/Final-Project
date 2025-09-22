import React, { useState } from 'react';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productId: 1,
      productName: 'Áo thun nam',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@example.com',
      rating: 5,
      comment: 'Sản phẩm rất tốt, chất lượng cao, giao hàng nhanh. Tôi rất hài lòng với dịch vụ.',
      createdAt: '2025-09-19T10:00:00Z',
      status: 'approved',
      helpful: 12
    },
    {
      id: 2,
      productId: 2,
      productName: 'Giày thể thao Nike',
      customerName: 'Trần Thị B',
      customerEmail: 'tranthib@example.com',
      rating: 4,
      comment: 'Giày đẹp, vừa chân nhưng giá hơi cao so với chất lượng.',
      createdAt: '2025-09-18T14:30:00Z',
      status: 'pending',
      helpful: 8
    },
    {
      id: 3,
      productId: 3,
      productName: 'Túi xách da',
      customerName: 'Lê Văn C',
      customerEmail: 'levanc@example.com',
      rating: 1,
      comment: 'Sản phẩm kém chất lượng, da bị bong tróc sau 1 tuần sử dụng. Không đáng tiền.',
      createdAt: '2025-09-17T16:00:00Z',
      status: 'reported',
      helpful: 3,
      reportReason: 'Nội dung không phù hợp'
    },
    {
      id: 4,
      productId: 4,
      productName: 'Đồng hồ thông minh',
      customerName: 'Phạm Thị D',
      customerEmail: 'phamthid@example.com',
      rating: 5,
      comment: 'Đồng hồ rất đẹp, nhiều tính năng hay. Pin trâu, sử dụng được cả tuần.',
      createdAt: '2025-09-16T09:15:00Z',
      status: 'approved',
      helpful: 15
    }
  ]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
      if (selectedReview && selectedReview.id === reviewId) {
        setSelectedReview(null);
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    const statusMatch = filterStatus === 'all' || review.status === filterStatus;
    const ratingMatch = filterRating === 'all' || review.rating === parseInt(filterRating);
    return statusMatch && ratingMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reported': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Từ chối';
      case 'reported': return 'Báo cáo';
      default: return 'Không xác định';
    }
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    reported: reviews.filter(r => r.status === 'reported').length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  };

  return (
    <div className="admin-reviews-container p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⭐ Quản lý Đánh giá Sản phẩm</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Tổng đánh giá</h3>
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
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-sm font-medium text-orange-800">Báo cáo</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.reported}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Điểm TB</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.averageRating}/5</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tất cả</option>
            <option value="approved">Đã duyệt</option>
            <option value="pending">Chờ duyệt</option>
            <option value="rejected">Từ chối</option>
            <option value="reported">Báo cáo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tất cả</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách đánh giá</h2>
          {filteredReviews.map(review => (
            <div
              key={review.id}
              onClick={() => setSelectedReview(review)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedReview?.id === review.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{review.productName}</h3>
                  <p className="text-sm text-gray-600">{review.customerName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(review.status)}`}>
                  {getStatusText(review.status)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">Đánh giá:</span>
                <span className="text-yellow-500">{getRatingStars(review.rating)}</span>
                <span className="text-sm text-gray-500">({review.rating}/5)</span>
              </div>
              
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                {review.comment}
              </p>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                <span>{review.helpful} người hữu ích</span>
              </div>
            </div>
          ))}
        </div>

        {/* Review Detail */}
        {selectedReview && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Chi tiết đánh giá</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sản phẩm:</label>
                <p className="text-gray-900 font-semibold">{selectedReview.productName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Khách hàng:</label>
                <p className="text-gray-900">{selectedReview.customerName}</p>
                <p className="text-sm text-gray-600">{selectedReview.customerEmail}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Đánh giá:</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl text-yellow-500">{getRatingStars(selectedReview.rating)}</span>
                  <span className="text-gray-600">({selectedReview.rating}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nhận xét:</label>
                <p className="text-gray-900 bg-white p-3 rounded border">{selectedReview.comment}</p>
              </div>
              
              {selectedReview.reportReason && (
                <div>
                  <label className="block text-sm font-medium text-red-700">Lý do báo cáo:</label>
                  <p className="text-red-900 bg-red-50 p-3 rounded border">{selectedReview.reportReason}</p>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ngày tạo: {new Date(selectedReview.createdAt).toLocaleString('vi-VN')}</span>
                <span>{selectedReview.helpful} người hữu ích</span>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {selectedReview.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedReview.id, 'approved')}
                    style={{
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      color: '#166534',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '2px solid #86efac',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.2)';
                      e.target.style.borderColor = '#4ade80';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = '#86efac';
                    }}
                  >
                    ✅ Duyệt
                  </button>
                )}
                {selectedReview.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(selectedReview.id, 'rejected')}
                    style={{
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      color: '#dc2626',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '2px solid #fca5a5',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                      e.target.style.borderColor = '#f87171';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = '#fca5a5';
                    }}
                  >
                    ❌ Từ chối
                  </button>
                )}
                {selectedReview.status === 'reported' && (
                  <button
                    onClick={() => handleStatusChange(selectedReview.id, 'pending')}
                    style={{
                      background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
                      color: '#a16207',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '2px solid #fcd34d',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.2)';
                      e.target.style.borderColor = '#f59e0b';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.borderColor = '#fcd34d';
                    }}
                  >
                    ⏳ Để chờ duyệt
                  </button>
                )}
                <button
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  style={{
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    color: '#374151',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '2px solid #d1d5db',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.2)';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewsPage;
