import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const CustomerSupportPage = () => {
  const { currentUser, supportRequests, submitSupportRequest } = useAppContext();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('order');

  const myRequests = supportRequests.filter(r => r.userId === currentUser?.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    submitSupportRequest({ subject, message, category });
    setSubject('');
    setMessage('');
    setCategory('order');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">🆘 Hỗ trợ khách hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Gửi yêu cầu hỗ trợ</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Chủ đề</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-3 border rounded-md" placeholder="Ví dụ: Vấn đề thanh toán" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border rounded-md">
                <option value="order">Đơn hàng</option>
                <option value="payment">Thanh toán</option>
                <option value="account">Tài khoản</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nội dung</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full p-3 border rounded-md" placeholder="Mô tả chi tiết vấn đề của bạn..." />
            </div>
            <div className="text-right">
              <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-lg">Gửi</button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Yêu cầu đã gửi</h2>
          {myRequests.length === 0 ? (
            <div className="text-gray-600">Bạn chưa gửi yêu cầu nào.</div>
          ) : (
            <div className="space-y-3">
              {myRequests.map(r => (
                <div key={r.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>#{r.id}</span>
                    <span>{new Date(r.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="font-semibold text-gray-800 mt-1">{r.subject}</div>
                  <div className="text-gray-700 text-sm mt-1">{r.message}</div>
                  <div className="text-xs text-gray-500 mt-2">Trạng thái: {r.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportPage;


