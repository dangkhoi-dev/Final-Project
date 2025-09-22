import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotification } from '../../../contexts/NotificationContext';

const AdminCustomerManagementPage = () => {
  const { users, setUsers, orders } = useAppContext();
  const { showSuccess, showError } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer'
  });

  // Lọc chỉ khách hàng (customer)
  const customers = useMemo(() => {
    return users.filter(user => user.role === 'customer');
  }, [users]);

  // Thống kê
  const stats = useMemo(() => {
    return {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(customer => {
        const customerOrders = orders.filter(order => order.userId === customer.id);
        return customerOrders.length > 0;
      }).length,
      totalOrders: orders.filter(order => 
        customers.some(customer => customer.id === order.userId)
      ).length,
      totalRevenue: orders
        .filter(order => 
          customers.some(customer => customer.id === order.userId) && 
          order.status === 'Đã giao'
        )
        .reduce((sum, order) => sum + order.total, 0)
    };
  }, [customers, orders]);

  // Lấy thống kê cho một khách hàng
  const getCustomerStats = (customerId) => {
    const customerOrders = orders.filter(order => order.userId === customerId);
    const completedOrders = customerOrders.filter(order => order.status === 'Đã giao');
    const totalSpent = completedOrders.reduce((sum, order) => sum + order.total, 0);
    
    return {
      totalOrders: customerOrders.length,
      completedOrders: completedOrders.length,
      totalSpent
    };
  };

  // Xóa khách hàng
  const handleDelete = (userId) => {
    if (window.confirm('Bạn có chắc muốn xóa khách hàng này? Tất cả đơn hàng của khách hàng cũng sẽ bị xóa.')) {
      setUsers(users.filter(u => u.id !== userId));
      showSuccess('Khách hàng đã được xóa!');
    }
  };

  // Chỉnh sửa khách hàng
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      role: user.role
    });
    setIsModalOpen(true);
  };

  // Thêm khách hàng mới
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      role: 'customer'
    });
    setIsModalOpen(true);
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      // Cập nhật khách hàng
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              email: formData.email, 
              password: formData.password || user.password,
              role: formData.role
            }
          : user
      );
      setUsers(updatedUsers);
      showSuccess('Khách hàng đã được cập nhật!');
    } else {
      // Thêm khách hàng mới
      if (users.find(user => user.email === formData.email)) {
        showError('Email đã tồn tại!');
        return;
      }
      
      const newUserId = Math.max(...users.map(u => u.id), 0) + 1;
      const newUser = {
        id: newUserId,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      setUsers([...users, newUser]);
      showSuccess('Khách hàng mới đã được thêm!');
    }

    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'customer' });
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'customer' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: 0
        }}>
          👥 Quản lý Khách hàng
        </h1>
        <button
          onClick={handleAdd}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }}
        >
          ➕ Thêm khách hàng
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '32px' 
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Tổng khách hàng</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalCustomers}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Khách hàng hoạt động</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.activeCustomers}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Tổng đơn hàng</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{stats.totalOrders}</p>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.9 }}>Doanh thu</h3>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Vai trò</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Đơn hàng</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Đã hoàn thành</th>
              <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Tổng chi tiêu</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => {
              const customerStats = getCustomerStats(customer.id);
              return (
                <tr key={customer.id} style={{ 
                  borderBottom: index < customers.length - 1 ? '1px solid #e5e7eb' : 'none',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px', color: '#6b7280' }}>{customer.id}</td>
                  <td style={{ padding: '16px', fontWeight: '500', color: '#1f2937' }}>{customer.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      background: '#3b82f6'
                    }}>
                      👤 Khách hàng
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#374151' }}>
                    {customerStats.totalOrders} đơn
                  </td>
                  <td style={{ padding: '16px', color: '#374151' }}>
                    {customerStats.completedOrders} đơn
                  </td>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#059669' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customerStats.totalSpent)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(customer)}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        style={{
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {customers.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px', 
            color: '#6b7280',
            fontSize: '16px'
          }}>
            Không có khách hàng nào
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              margin: '0 0 24px', 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              {editingUser ? '✏️ Sửa khách hàng' : '➕ Thêm khách hàng mới'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151' 
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151' 
                }}>
                  Mật khẩu {editingUser ? '' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={editingUser ? 'Để trống nếu không muốn thay đổi' : ''}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600', 
                  color: '#374151' 
                }}>
                  Vai trò
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="customer">Khách hàng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#4b5563'}
                  onMouseOut={(e) => e.target.style.background = '#6b7280'}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {editingUser ? '💾 Cập nhật' : '➕ Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomerManagementPage;
