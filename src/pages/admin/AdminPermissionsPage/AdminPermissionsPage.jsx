import React, { useState } from 'react';

const AdminPermissionsPage = () => {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn Admin',
      email: 'admin@example.com',
      role: 'admin',
      department: 'Quản lý',
      permissions: [
        'user_management', 'product_management', 'order_management',
        'financial_management', 'system_settings', 'promotion_management',
        'review_management', 'support_management', 'report_management'
      ],
      status: 'active',
      lastLogin: '2025-09-19T10:00:00Z',
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Trần Thị Mod',
      email: 'moderator@example.com',
      role: 'moderator',
      department: 'Kiểm duyệt',
      permissions: [
        'product_management', 'order_management', 'review_management'
      ],
      status: 'active',
      lastLogin: '2025-09-18T14:30:00Z',
      createdAt: '2025-02-01T00:00:00Z'
    },
    {
      id: 3,
      name: 'Lê Văn Support',
      email: 'support@example.com',
      role: 'support',
      department: 'Hỗ trợ',
      permissions: [
        'order_management', 'support_management', 'customer_management'
      ],
      status: 'active',
      lastLogin: '2025-09-17T16:00:00Z',
      createdAt: '2025-03-01T00:00:00Z'
    },
    {
      id: 4,
      name: 'Phạm Thị Finance',
      email: 'finance@example.com',
      role: 'finance',
      department: 'Tài chính',
      permissions: [
        'financial_management', 'order_management', 'report_management'
      ],
      status: 'inactive',
      lastLogin: '2025-09-10T09:15:00Z',
      createdAt: '2025-04-01T00:00:00Z'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'moderator',
    department: '',
    permissions: [],
    status: 'active'
  });

  const permissionGroups = {
    'user_management': {
      name: 'Quản lý người dùng',
      description: 'Thêm, sửa, xóa tài khoản người dùng',
      permissions: ['user_management']
    },
    'product_management': {
      name: 'Quản lý sản phẩm',
      description: 'Duyệt, chỉnh sửa sản phẩm',
      permissions: ['product_management']
    },
    'order_management': {
      name: 'Quản lý đơn hàng',
      description: 'Xử lý và quản lý đơn hàng',
      permissions: ['order_management']
    },
    'financial_management': {
      name: 'Quản lý tài chính',
      description: 'Theo dõi doanh thu, chi phí',
      permissions: ['financial_management']
    },
    'system_settings': {
      name: 'Cài đặt hệ thống',
      description: 'Cấu hình hệ thống',
      permissions: ['system_settings']
    },
    'promotion_management': {
      name: 'Quản lý khuyến mãi',
      description: 'Tạo và quản lý chương trình khuyến mãi',
      permissions: ['promotion_management']
    },
    'review_management': {
      name: 'Quản lý đánh giá',
      description: 'Duyệt và quản lý đánh giá sản phẩm',
      permissions: ['review_management']
    },
    'support_management': {
      name: 'Hỗ trợ khách hàng',
      description: 'Xử lý yêu cầu hỗ trợ',
      permissions: ['support_management']
    },
    'customer_management': {
      name: 'Quản lý khách hàng',
      description: 'Xem và quản lý thông tin khách hàng',
      permissions: ['customer_management']
    },
    'report_management': {
      name: 'Báo cáo',
      description: 'Xem và tạo báo cáo',
      permissions: ['report_management']
    }
  };

  const roleTemplates = {
    admin: {
      name: 'Quản trị viên',
      description: 'Toàn quyền truy cập hệ thống',
      permissions: Object.keys(permissionGroups)
    },
    moderator: {
      name: 'Kiểm duyệt viên',
      description: 'Duyệt sản phẩm và đánh giá',
      permissions: ['product_management', 'order_management', 'review_management']
    },
    support: {
      name: 'Nhân viên hỗ trợ',
      description: 'Hỗ trợ khách hàng và xử lý đơn hàng',
      permissions: ['order_management', 'support_management', 'customer_management']
    },
    finance: {
      name: 'Nhân viên tài chính',
      description: 'Quản lý tài chính và báo cáo',
      permissions: ['financial_management', 'order_management', 'report_management']
    }
  };

  const handleCreateStaff = (e) => {
    e.preventDefault();
    const staffMember = {
      id: Date.now(),
      ...newStaff,
      lastLogin: null,
      createdAt: new Date().toISOString()
    };
    
    setStaff(prev => [staffMember, ...prev]);
    setNewStaff({
      name: '',
      email: '',
      role: 'moderator',
      department: '',
      permissions: [],
      status: 'active'
    });
    setShowCreateForm(false);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setNewStaff({
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      department: staffMember.department,
      permissions: staffMember.permissions,
      status: staffMember.status
    });
    setShowCreateForm(true);
  };

  const handleUpdateStaff = (e) => {
    e.preventDefault();
    const updatedStaff = {
      ...editingStaff,
      ...newStaff
    };
    
    setStaff(prev => prev.map(s => s.id === editingStaff.id ? updatedStaff : s));
    setShowCreateForm(false);
    setEditingStaff(null);
  };

  const handleDeleteStaff = (staffId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setStaff(prev => prev.filter(s => s.id !== staffId));
    }
  };

  const handleStatusChange = (staffId, newStatus) => {
    setStaff(prev => prev.map(s => 
      s.id === staffId ? { ...s, status: newStatus } : s
    ));
  };

  const handleRoleChange = (role) => {
    const template = roleTemplates[role];
    setNewStaff(prev => ({
      ...prev,
      role,
      permissions: template ? template.permissions : []
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'suspended': return 'Tạm khóa';
      default: return 'Không xác định';
    }
  };

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
    departments: [...new Set(staff.map(s => s.department))].length
  };

  return (
    <div className="admin-permissions-container p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🔐 Quản lý Phân quyền</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Thêm nhân viên
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">Tổng nhân viên</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800">Đang hoạt động</h3>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">Không hoạt động</h3>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800">Phòng ban</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
        </div>
      </div>

      {/* Staff List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Nhân viên</th>
              <th className="py-3 px-6 text-left">Vai trò</th>
              <th className="py-3 px-6 text-left">Phòng ban</th>
              <th className="py-3 px-6 text-center">Trạng thái</th>
              <th className="py-3 px-6 text-center">Quyền hạn</th>
              <th className="py-3 px-6 text-center">Đăng nhập cuối</th>
              <th className="py-3 px-6 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {staff.map(staffMember => (
              <tr key={staffMember.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">
                  <div>
                    <div className="font-semibold text-gray-800">{staffMember.name}</div>
                    <div className="text-gray-500 text-xs">{staffMember.email}</div>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  <span className="font-medium text-blue-600">
                    {roleTemplates[staffMember.role]?.name || staffMember.role}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{staffMember.department}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-full text-xs ${getStatusColor(staffMember.status)}`}>
                    {getStatusText(staffMember.status)}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <span className="text-blue-600 font-medium">
                    {staffMember.permissions.length} quyền
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  {staffMember.lastLogin 
                    ? new Date(staffMember.lastLogin).toLocaleDateString('vi-VN')
                    : 'Chưa đăng nhập'
                  }
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEditStaff(staffMember)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors text-xs"
                    >
                      ✏️
                    </button>
                    {staffMember.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(staffMember.id, 'inactive')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-colors text-xs"
                      >
                        ⏸️
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(staffMember.id, 'active')}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-xs"
                      >
                        ▶️
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteStaff(staffMember.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-xs"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
            </h2>
            
            <form onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhân viên</label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  >
                    {Object.entries(roleTemplates).map(([key, template]) => (
                      <option key={key} value={key}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  {roleTemplates[newStaff.role] && (
                    <p className="text-xs text-gray-500 mt-1">
                      {roleTemplates[newStaff.role].description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                  <input
                    type="text"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quyền hạn</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(permissionGroups).map(([key, group]) => (
                    <div key={key} className="border border-gray-200 rounded-lg p-3">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={newStaff.permissions.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewStaff(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, key]
                              }));
                            } else {
                              setNewStaff(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== key)
                              }));
                            }
                          }}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{group.name}</div>
                          <div className="text-xs text-gray-600">{group.description}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={newStaff.status}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingStaff(null);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingStaff ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
            
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingStaff(null);
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

export default AdminPermissionsPage;
