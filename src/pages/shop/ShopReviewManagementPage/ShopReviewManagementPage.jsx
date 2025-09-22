import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const ShopReviewManagementPage = () => {
  const { currentUser, products, reviews } = useAppContext();
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Lọc đánh giá cho sản phẩm của shop
  const shopProductIds = products
    .filter(product => product.shopId === currentUser.id)
    .map(product => product.id);

  const shopReviews = reviews.filter(review => 
    shopProductIds.includes(review.productId)
  );

  const filteredReviews = shopReviews.filter(review => {
    const ratingMatch = filterRating === 'all' || review.rating === parseInt(filterRating);
    const statusMatch = filterStatus === 'all' || review.status === filterStatus;
    return ratingMatch && statusMatch;
  });

  const handleReply = (reviewId) => {
    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    // Trong thực tế, đây sẽ là API call để lưu phản hồi
    alert(`Đã gửi phản hồi cho đánh giá #${reviewId}: "${replyText}"`);
    setReplyText('');
    setSelectedReview(null);
  };

  const handleReportReview = (reviewId) => {
    if (window.confirm('Bạn có chắc chắn muốn báo cáo đánh giá này?')) {
      // Trong thực tế, đây sẽ là API call để báo cáo
      alert(`Đã báo cáo đánh giá #${reviewId} cho admin xem xét`);
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Sản phẩm #${productId}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reported': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Đã từ chối';
      case 'reported': return 'Bị báo cáo';
      default: return 'Không xác định';
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const stats = {
    total: shopReviews.length,
    averageRating: shopReviews.length > 0 
      ? (shopReviews.reduce((sum, review) => sum + review.rating, 0) / shopReviews.length).toFixed(1)
      : 0,
    fiveStar: shopReviews.filter(r => r.rating === 5).length,
    fourStar: shopReviews.filter(r => r.rating === 4).length,
    threeStar: shopReviews.filter(r => r.rating === 3).length,
    twoStar: shopReviews.filter(r => r.rating === 2).length,
    oneStar: shopReviews.filter(r => r.rating === 1).length,
    reported: shopReviews.filter(r => r.status === 'reported').length
  };

  return (
    <div className="shop-review-management-container p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⭐ Quản lý Đánh giá</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📊 Tổng đánh giá</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">⭐ Điểm trung bình</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
          <p className="text-sm text-gray-600 mt-1">/ 5.0 sao</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">🚨 Bị báo cáo</h3>
          <p className="text-3xl font-bold text-red-600">{stats.reported}</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Phân bố đánh giá</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { stars: 5, count: stats.fiveStar, color: 'green' },
            { stars: 4, count: stats.fourStar, color: 'blue' },
            { stars: 3, count: stats.threeStar, color: 'yellow' },
            { stars: 2, count: stats.twoStar, color: 'orange' },
            { stars: 1, count: stats.oneStar, color: 'red' }
          ].map(({ stars, count, color }) => (
            <div key={stars} className="text-center">
              <div className="text-2xl mb-2">{renderStars(stars)}</div>
              <div className={`text-2xl font-bold text-${color}-600`}>{count}</div>
              <div className="text-sm text-gray-600">đánh giá</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Tất cả số sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="approved">Đã duyệt</option>
          <option value="pending">Chờ duyệt</option>
          <option value="rejected">Đã từ chối</option>
          <option value="reported">Bị báo cáo</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {getProductName(review.productId)}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(review.status)}`}>
                    {getStatusText(review.status)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{review.customerName}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{review.customerEmail}</span>
                  </div>
                  <div className="text-yellow-500">
                    {renderStars(review.rating)}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-2">{review.comment}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Ngày: {new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span>•</span>
                  <span>Hữu ích: {review.helpful} người</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedReview(review)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-xs"
                >
                  💬 Phản hồi
                </button>
                <button
                  onClick={() => handleReportReview(review.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-xs"
                >
                  🚨 Báo cáo
                </button>
              </div>
            </div>
            
            {/* Existing Reply */}
            {review.shopReply && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-blue-800">Phản hồi từ shop:</span>
                  <span className="text-sm text-blue-600">
                    {new Date(review.shopReply.repliedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-blue-700">{review.shopReply.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có đánh giá nào</h3>
          <p className="text-gray-600">Đánh giá từ khách hàng sẽ hiển thị ở đây</p>
        </div>
      )}

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Phản hồi đánh giá #{selectedReview.id}
            </h2>
            
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedReview.customerName}</span>
                  <span className="text-yellow-500">{renderStars(selectedReview.rating)}</span>
                </div>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung phản hồi:
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Nhập nội dung phản hồi cho khách hàng..."
              />
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setReplyText('');
                }}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid #d1d5db',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Hủy
              </button>
              <button
                onClick={() => handleReply(selectedReview.id)}
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  color: '#1e40af',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: '2px solid #93c5fd',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                  e.target.style.borderColor = '#60a5fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = '#93c5fd';
                }}
              >
                Gửi phản hồi
              </button>
            </div>
            
            <button
              onClick={() => {
                setSelectedReview(null);
                setReplyText('');
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

export default ShopReviewManagementPage;
