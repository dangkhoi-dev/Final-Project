import React, { useState } from 'react';

const AdminFinancePage = () => {
  const [financialData, setFinancialData] = useState({
    revenue: {
      today: 2500000,
      thisWeek: 18000000,
      thisMonth: 75000000,
      thisYear: 850000000
    },
    expenses: {
      today: 800000,
      thisWeek: 5500000,
      thisMonth: 22000000,
      thisYear: 250000000
    },
    transactions: [
      {
        id: 1,
        type: 'revenue',
        amount: 1500000,
        description: 'Doanh thu từ đơn hàng #1678886400000',
        orderId: '1678886400000',
        shopId: 'shop1',
        shopName: 'Shop Thời trang ABC',
        date: '2025-09-19T10:30:00Z',
        status: 'completed',
        fee: 75000
      },
      {
        id: 2,
        type: 'expense',
        amount: 500000,
        description: 'Chi phí marketing Facebook Ads',
        category: 'marketing',
        date: '2025-09-19T09:15:00Z',
        status: 'completed'
      },
      {
        id: 3,
        type: 'revenue',
        amount: 2800000,
        description: 'Doanh thu từ đơn hàng #1678886500000',
        orderId: '1678886500000',
        shopId: 'shop2',
        shopName: 'Shop Giày dép XYZ',
        date: '2025-09-18T16:45:00Z',
        status: 'completed',
        fee: 140000
      },
      {
        id: 4,
        type: 'expense',
        amount: 1200000,
        description: 'Chi phí server và hosting',
        category: 'infrastructure',
        date: '2025-09-18T12:00:00Z',
        status: 'completed'
      },
      {
        id: 5,
        type: 'revenue',
        amount: 900000,
        description: 'Doanh thu từ đơn hàng #1678886600000',
        orderId: '1678886600000',
        shopId: 'shop3',
        shopName: 'Shop Phụ kiện DEF',
        date: '2025-09-17T14:20:00Z',
        status: 'completed',
        fee: 45000
      }
    ]
  });

  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [filterType, setFilterType] = useState('all');
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      date: new Date(newTransaction.date).toISOString(),
      status: 'completed'
    };
    
    setFinancialData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions]
    }));
    
    // Update revenue/expense totals
    if (transaction.type === 'revenue') {
      setFinancialData(prev => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          today: prev.revenue.today + transaction.amount
        }
      }));
    } else {
      setFinancialData(prev => ({
        ...prev,
        expenses: {
          ...prev.expenses,
          today: prev.expenses.today + transaction.amount
        }
      }));
    }
    
    setNewTransaction({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddTransaction(false);
  };

  const getPeriodData = () => {
    const period = selectedPeriod;
    return {
      revenue: financialData.revenue[period],
      expenses: financialData.expenses[period],
      profit: financialData.revenue[period] - financialData.expenses[period]
    };
  };

  const filteredTransactions = financialData.transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  const getTransactionIcon = (type) => {
    return type === 'revenue' ? '💰' : '💸';
  };

  const getTransactionColor = (type) => {
    return type === 'revenue' ? 'text-green-600' : 'text-red-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      marketing: '📢',
      infrastructure: '🖥️',
      staff: '👥',
      office: '🏢',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const stats = {
    totalRevenue: Object.values(financialData.revenue).reduce((sum, val) => sum + val, 0),
    totalExpenses: Object.values(financialData.expenses).reduce((sum, val) => sum + val, 0),
    totalProfit: Object.values(financialData.revenue).reduce((sum, val) => sum + val, 0) - 
                 Object.values(financialData.expenses).reduce((sum, val) => sum + val, 0),
    transactionCount: financialData.transactions.length
  };

  const periodData = getPeriodData();

  return (
    <div className="admin-finance-container p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">💰 Quản lý Tài chính</h1>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Thêm giao dịch
        </button>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="today">Hôm nay</option>
          <option value="thisWeek">Tuần này</option>
          <option value="thisMonth">Tháng này</option>
          <option value="thisYear">Năm nay</option>
        </select>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-800">Doanh thu</h3>
              <p className="text-2xl font-bold text-green-600">
                {periodData.revenue.toLocaleString('vi-VN')} VND
              </p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
        
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-800">Chi phí</h3>
              <p className="text-2xl font-bold text-red-600">
                {periodData.expenses.toLocaleString('vi-VN')} VND
              </p>
            </div>
            <span className="text-3xl">💸</span>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg border ${
          periodData.profit >= 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-medium ${
                periodData.profit >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                Lợi nhuận
              </h3>
              <p className={`text-2xl font-bold ${
                periodData.profit >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {periodData.profit.toLocaleString('vi-VN')} VND
              </p>
            </div>
            <span className="text-3xl">{periodData.profit >= 0 ? '📈' : '📉'}</span>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-800">Tổng giao dịch</h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.transactionCount}
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>
      </div>

      {/* Yearly Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Tổng kết năm 2025</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalRevenue.toLocaleString('vi-VN')} VND
            </div>
            <div className="text-sm text-gray-600">Tổng doanh thu</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats.totalExpenses.toLocaleString('vi-VN')} VND
            </div>
            <div className="text-sm text-gray-600">Tổng chi phí</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              stats.totalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {stats.totalProfit.toLocaleString('vi-VN')} VND
            </div>
            <div className="text-sm text-gray-600">Tổng lợi nhuận</div>
          </div>
        </div>
      </div>

      {/* Transaction Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Tất cả giao dịch</option>
          <option value="revenue">Doanh thu</option>
          <option value="expense">Chi phí</option>
        </select>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">📋 Lịch sử giao dịch</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {transaction.type === 'revenue' ? '💰' : '💸'}
                      </span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {transaction.type === 'revenue' ? 'Doanh thu' : 'Chi phí'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      {transaction.shopName && (
                        <div className="text-sm text-gray-500">
                          {transaction.shopName}
                        </div>
                      )}
                      {transaction.category && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-1">{getCategoryIcon(transaction.category)}</span>
                          {transaction.category}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'revenue' ? '+' : '-'}
                      {transaction.amount.toLocaleString('vi-VN')} VND
                    </div>
                    {transaction.fee && (
                      <div className="text-xs text-gray-500">
                        Phí: {transaction.fee.toLocaleString('vi-VN')} VND
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Hoàn thành
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm giao dịch mới</h2>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại giao dịch</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="revenue">Doanh thu</option>
                  <option value="expense">Chi phí</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              {newTransaction.type === 'expense' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="marketing">Marketing</option>
                    <option value="infrastructure">Hạ tầng</option>
                    <option value="staff">Nhân sự</option>
                    <option value="office">Văn phòng</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Thêm
                </button>
              </div>
            </form>
            
            <button
              onClick={() => setShowAddTransaction(false)}
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

export default AdminFinancePage;
