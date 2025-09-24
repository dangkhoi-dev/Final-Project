import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const CustomerPaymentsPage = () => {
  const { currentUser, payments, orders } = useAppContext();
  const [statusFilter, setStatusFilter] = useState('all');

  const myPayments = useMemo(() => payments.filter(p => p.userId === currentUser?.id), [payments, currentUser]);
  const filtered = useMemo(() => myPayments.filter(p => statusFilter === 'all' || p.status === statusFilter), [myPayments, statusFilter]);

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'failed': return 'Thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case 'credit_card': return 'Thẻ tín dụng';
      case 'bank_transfer': return 'Chuyển khoản';
      case 'cash_on_delivery': return 'Thanh toán khi nhận hàng';
      case 'e_wallet': return 'Ví điện tử';
      default: return method;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">💳 Giao dịch thanh toán của tôi</h1>

      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-md"
        >
          <option value="all">Tất cả</option>
          <option value="completed">Hoàn thành</option>
          <option value="pending">Chờ xử lý</option>
          <option value="failed">Thất bại</option>
          <option value="refunded">Đã hoàn tiền</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg border">Chưa có giao dịch nào</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-3 text-left">Mã GD</th>
                <th className="p-3 text-left">Đơn hàng</th>
                <th className="p-3 text-left">Phương thức</th>
                <th className="p-3 text-left">Số tiền</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-center">Ngày</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {filtered.map(p => {
                const order = orders.find(o => o.id === p.orderId);
                return (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.transactionId}</td>
                    <td className="p-3">#{p.orderId} {order ? `- ${order.items.length} SP` : ''}</td>
                    <td className="p-3">{getMethodText(p.method)}</td>
                    <td className="p-3 font-semibold text-green-600">{p.amount.toLocaleString()} VND</td>
                    <td className="p-3 text-center">{getStatusText(p.status)}</td>
                    <td className="p-3 text-center">{new Date(p.paymentDate).toLocaleString('vi-VN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerPaymentsPage;


