import React, { useState } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useNotification } from '../../../contexts/NotificationContext';

const AdminSupportPage = () => {
  const { users, shops } = useAppContext();
  const { showSuccess, showError } = useNotification();
  
  const [selectedTab, setSelectedTab] = useState('tickets');
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 1,
      title: 'Không thể đăng nhập vào hệ thống',
      description: 'Tôi đã thử đăng nhập nhiều lần nhưng hệ thống báo lỗi "Email hoặc mật khẩu không đúng"',
      user: 'Nguyễn Văn A',
      userEmail: 'nguyenvana@example.com',
      userRole: 'customer',
      status: 'open',
      priority: 'high',
      category: 'login',
      createdAt: '2025-01-21T09:00:00Z',
      updatedAt: '2025-01-21T09:00:00Z',
      responses: []
    },
    {
      id: 2,
      title: 'Không thể tải lên hình ảnh sản phẩm',
      description: 'Khi tôi cố gắng tải lên hình ảnh sản phẩm mới, hệ thống báo lỗi và không thể upload được',
      user: 'Trần Thị B',
      userEmail: 'tranthib@example.com',
      userRole: 'shop',
      status: 'in_progress',
      priority: 'normal',
      category: 'upload',
      createdAt: '2025-01-20T14:30:00Z',
      updatedAt: '2025-01-21T10:15:00Z',
      responses: [
        {
          id: 1,
          message: 'Chúng tôi đang kiểm tra vấn đề này. Vui lòng thử lại sau 30 phút.',
          admin: 'Admin System',
          createdAt: '2025-01-21T10:15:00Z'
        }
      ]
    },
    {
      id: 3,
      title: 'Yêu cầu reset mật khẩu',
      description: 'Tôi quên mật khẩu và cần được hỗ trợ reset',
      user: 'Lê Văn C',
      userEmail: 'levanc@example.com',
      userRole: 'customer',
      status: 'resolved',
      priority: 'low',
      category: 'password',
      createdAt: '2025-01-19T16:45:00Z',
      updatedAt: '2025-01-20T08:30:00Z',
      responses: [
        {
          id: 1,
          message: 'Chúng tôi đã gửi link reset mật khẩu đến email của bạn.',
          admin: 'Admin System',
          createdAt: '2025-01-19T17:00:00Z'
        },
        {
          id: 2,
          message: 'Cảm ơn bạn đã xác nhận. Ticket này đã được đóng.',
          admin: 'Admin System',
          createdAt: '2025-01-20T08:30:00Z'
        }
      ]
    }
  ]);

  const [newResponse, setNewResponse] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return '#ef4444';
      case 'in_progress': return '#f59e0b';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Mở';
      case 'in_progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return 'Không xác định';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'normal': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'normal': return 'Bình thường';
      case 'low': return 'Thấp';
      default: return 'Không xác định';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'login': return '🔐';
      case 'upload': return '📤';
      case 'password': return '🔑';
      case 'payment': return '💳';
      case 'order': return '📦';
      case 'product': return '🛍️';
      default: return '❓';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'login': return 'Đăng nhập';
      case 'upload': return 'Tải lên';
      case 'password': return 'Mật khẩu';
      case 'payment': return 'Thanh toán';
      case 'order': return 'Đơn hàng';
      case 'product': return 'Sản phẩm';
      default: return 'Khác';
    }
  };

  const handleStatusChange = (ticketId, newStatus) => {
    setSupportTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    ));
    showSuccess(`Đã cập nhật trạng thái ticket #${ticketId}`);
  };

  const handleAddResponse = (ticketId) => {
    if (!newResponse.trim()) {
      showError('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    const response = {
      id: Date.now(),
      message: newResponse,
      admin: 'Admin System',
      createdAt: new Date().toISOString()
    };

    setSupportTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            responses: [...ticket.responses, response],
            updatedAt: new Date().toISOString()
          }
        : ticket
    ));

    setNewResponse('');
    showSuccess('Đã gửi phản hồi thành công!');
  };

  const stats = {
    totalTickets: supportTickets.length,
    openTickets: supportTickets.filter(t => t.status === 'open').length,
    inProgressTickets: supportTickets.filter(t => t.status === 'in_progress').length,
    resolvedTickets: supportTickets.filter(t => t.status === 'resolved').length
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>
            🛠️ Hỗ trợ kỹ thuật
          </h1>
          <p style={{ fontSize: '16px', opacity: '0.9', margin: '0' }}>
            Quản lý và cung cấp hỗ trợ kỹ thuật cho cửa hàng và khách hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>🎫 Tổng ticket</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{stats.totalTickets}</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>⏳ Đang mở</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{stats.openTickets}</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>🔄 Đang xử lý</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{stats.inProgressTickets}</p>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>✅ Đã giải quyết</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', margin: '0' }}>{stats.resolvedTickets}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {[
            { value: 'tickets', label: '🎫 Danh sách ticket', icon: '📋' },
            { value: 'knowledge', label: '📚 Cơ sở tri thức', icon: '💡' },
            { value: 'faq', label: '❓ Câu hỏi thường gặp', icon: '🤔' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: selectedTab === tab.value 
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' 
                  : 'white',
                color: selectedTab === tab.value ? 'white' : '#374151',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedTab === tab.value 
                  ? '0 4px 15px rgba(139, 92, 246, 0.3)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {selectedTab === 'tickets' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
              🎫 Danh sách ticket hỗ trợ
            </h2>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    background: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{getCategoryIcon(ticket.category)}</span>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#374151' }}>
                          #{ticket.id} - {ticket.title}
                        </h3>
                      </div>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                        {ticket.description}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9ca3af' }}>
                        <span>👤 {ticket.user} ({ticket.userRole})</span>
                        <span>📧 {ticket.userEmail}</span>
                        <span>🕒 {new Date(ticket.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          background: getStatusColor(ticket.status)
                        }}
                      >
                        {getStatusText(ticket.status)}
                      </span>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          background: getPriorityColor(ticket.priority)
                        }}
                      >
                        {getPriorityText(ticket.priority)}
                      </span>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#374151',
                          background: '#e5e7eb'
                        }}
                      >
                        {getCategoryText(ticket.category)}
                      </span>
                    </div>
                  </div>

                  {ticket.responses.length > 0 && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 8px 0' }}>
                        💬 {ticket.responses.length} phản hồi
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'knowledge' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
              📚 Cơ sở tri thức
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {[
                {
                  title: 'Hướng dẫn đăng ký tài khoản',
                  description: 'Cách tạo tài khoản mới trên hệ thống',
                  category: 'account',
                  icon: '👤'
                },
                {
                  title: 'Hướng dẫn đăng nhập',
                  description: 'Các bước đăng nhập và khắc phục sự cố',
                  category: 'login',
                  icon: '🔐'
                },
                {
                  title: 'Hướng dẫn tải lên sản phẩm',
                  description: 'Cách thêm sản phẩm mới cho cửa hàng',
                  category: 'product',
                  icon: '📤'
                },
                {
                  title: 'Hướng dẫn thanh toán',
                  description: 'Các phương thức thanh toán được hỗ trợ',
                  category: 'payment',
                  icon: '💳'
                }
              ].map((article, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    background: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#fafafa';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{article.icon}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#374151' }}>
                      {article.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0', lineHeight: '1.5' }}>
                    {article.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'faq' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#374151' }}>
              ❓ Câu hỏi thường gặp
            </h2>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {[
                {
                  question: 'Làm thế nào để đăng ký tài khoản cửa hàng?',
                  answer: 'Bạn có thể đăng ký tài khoản cửa hàng bằng cách truy cập trang đăng ký và chọn loại tài khoản "Cửa hàng". Điền đầy đủ thông tin và chờ admin duyệt.'
                },
                {
                  question: 'Tại sao tôi không thể đăng nhập?',
                  answer: 'Vui lòng kiểm tra lại email và mật khẩu. Nếu vẫn không được, bạn có thể sử dụng chức năng quên mật khẩu hoặc liên hệ hỗ trợ.'
                },
                {
                  question: 'Làm thế nào để tải lên hình ảnh sản phẩm?',
                  answer: 'Hình ảnh sản phẩm phải có định dạng JPG, PNG hoặc GIF và kích thước không quá 5MB. Sử dụng chức năng "Tải lên" trong trang quản lý sản phẩm.'
                },
                {
                  question: 'Khi nào sản phẩm của tôi sẽ được duyệt?',
                  answer: 'Sản phẩm sẽ được admin duyệt trong vòng 24-48 giờ làm việc. Bạn sẽ nhận được thông báo khi sản phẩm được duyệt hoặc từ chối.'
                },
                {
                  question: 'Làm thế nào để liên hệ hỗ trợ?',
                  answer: 'Bạn có thể tạo ticket hỗ trợ trong trang tài khoản hoặc gửi email trực tiếp đến admin@eshop.com'
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    background: '#fafafa'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#374151' }}>
                    ❓ {faq.question}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0', lineHeight: '1.6' }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0', color: '#374151' }}>
                  🎫 Ticket #{selectedTicket.id}
                </h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: '#374151' }}>
                  {selectedTicket.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                  {selectedTicket.description}
                </p>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      background: getStatusColor(selectedTicket.status)
                    }}
                  >
                    {getStatusText(selectedTicket.status)}
                  </span>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      background: getPriorityColor(selectedTicket.priority)
                    }}
                  >
                    {getPriorityText(selectedTicket.priority)}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#374151' }}>
                  Phản hồi
                </h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
                  {selectedTicket.responses.map((response) => (
                    <div
                      key={response.id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '8px',
                        background: '#f9fafb'
                      }}
                    >
                      <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                        {response.message}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>
                        {response.admin} - {new Date(response.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Nhập phản hồi..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button
                    onClick={() => handleAddResponse(selectedTicket.id)}
                    style={{
                      padding: '10px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    💬 Gửi phản hồi
                  </button>
                  
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                    style={{
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="open">Mở</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="resolved">Đã giải quyết</option>
                    <option value="closed">Đã đóng</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportPage;
