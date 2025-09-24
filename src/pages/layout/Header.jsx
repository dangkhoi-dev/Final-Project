import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useNotificationBell } from '../../contexts/NotificationBellContext';
import './Header.css';

const Header = () => {
  const { cart, currentUser, handleLogout } = useAppContext();
  const { 
    notifications, 
    unreadCount, 
    isDropdownOpen: isNotificationOpen, 
    toggleDropdown: toggleNotification, 
    closeDropdown: closeNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeAllNotifications,
    getNotificationIcon,
    getPriorityColor,
    formatTimeAgo,
    setCurrentUserRole
  } = useNotificationBell();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Set current user role for notifications
  useEffect(() => {
    if (currentUser) {
      setCurrentUserRole(currentUser.role);
    } else {
      setCurrentUserRole(null);
    }
  }, [currentUser, setCurrentUserRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <nav style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '20px' }}>🛍️</span>
          </div>
          E-Shop
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <Link 
            to="/" 
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            Trang chủ
          </Link>
          
          <Link 
            to="/products" 
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            Sản phẩm
          </Link>
          <Link 
            to="/promotions" 
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 16px',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
          >
            Khuyến mãi
          </Link>
          
          {/* Notification Bell */}
          {currentUser && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleNotification}
                style={{
                  position: 'relative',
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '20px', color: 'white' }}>🔔</span>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white'
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  minWidth: '350px',
                  maxWidth: '400px',
                  maxHeight: '500px',
                  overflow: 'hidden',
                  zIndex: 1001,
                  border: '1px solid #e5e7eb'
                }}>
                       {/* Header */}
                       <div style={{
                         padding: '16px 20px',
                         background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                         color: 'white',
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center'
                       }}>
                         <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0' }}>
                           🔔 Thông báo
                         </h3>
                         <div style={{ display: 'flex', gap: '6px' }}>
                           {unreadCount > 0 && (
                             <button
                               onClick={markAllAsRead}
                               style={{
                                 background: 'rgba(34, 197, 94, 0.8)',
                                 border: 'none',
                                 color: 'white',
                                 padding: '6px 12px',
                                 borderRadius: '8px',
                                 fontSize: '11px',
                                 fontWeight: '500',
                                 cursor: 'pointer',
                                 transition: 'all 0.3s ease',
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '4px'
                               }}
                               onMouseOver={(e) => {
                                 e.target.style.background = 'rgba(34, 197, 94, 1)';
                                 e.target.style.transform = 'translateY(-1px)';
                               }}
                               onMouseOut={(e) => {
                                 e.target.style.background = 'rgba(34, 197, 94, 0.8)';
                                 e.target.style.transform = 'translateY(0)';
                               }}
                             >
                               <span>✅</span>
                               Đã đọc
                             </button>
                           )}
                           {notifications.length > 0 && (
                             <button
                               onClick={() => {
                                 if (window.confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
                                   removeAllNotifications();
                                 }
                               }}
                               style={{
                                 background: 'rgba(239, 68, 68, 0.8)',
                                 border: 'none',
                                 color: 'white',
                                 padding: '6px 12px',
                                 borderRadius: '8px',
                                 fontSize: '11px',
                                 fontWeight: '500',
                                 cursor: 'pointer',
                                 transition: 'all 0.3s ease',
                                 display: 'flex',
                                 alignItems: 'center',
                                 gap: '4px'
                               }}
                               onMouseOver={(e) => {
                                 e.target.style.background = 'rgba(239, 68, 68, 1)';
                                 e.target.style.transform = 'translateY(-1px)';
                               }}
                               onMouseOut={(e) => {
                                 e.target.style.background = 'rgba(239, 68, 68, 0.8)';
                                 e.target.style.transform = 'translateY(0)';
                               }}
                             >
                               <span>🗑️</span>
                               Xóa tất cả
                             </button>
                           )}
                         </div>
                       </div>

                  {/* Notifications List */}
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: '#6b7280'
                      }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📭</span>
                        Không có thông báo nào
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                             <div
                               key={notification.id}
                               style={{
                                 padding: '16px 20px',
                                 borderBottom: '1px solid #f1f5f9',
                                 transition: 'all 0.3s ease',
                                 background: notification.isRead ? 'white' : '#f8fafc',
                                 position: 'relative'
                               }}
                               onMouseOver={(e) => {
                                 e.currentTarget.style.background = notification.isRead ? '#f8fafc' : '#f1f5f9';
                               }}
                               onMouseOut={(e) => {
                                 e.currentTarget.style.background = notification.isRead ? 'white' : '#f8fafc';
                               }}
                             >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div 
                              onClick={() => markAsRead(notification.id)}
                              style={{
                                width: '40px',
                                height: '40px',
                                background: getPriorityColor(notification.priority),
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                flexShrink: 0,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.transform = 'scale(1.1)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                <h4 style={{
                                  fontSize: '14px',
                                  fontWeight: notification.isRead ? '500' : '600',
                                  margin: '0',
                                  color: '#374151'
                                }}>
                                  {notification.title}
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {!notification.isRead && (
                                    <div style={{
                                      width: '8px',
                                      height: '8px',
                                      background: '#ef4444',
                                      borderRadius: '50%',
                                      flexShrink: 0
                                    }} />
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
                                        removeNotification(notification.id);
                                      }
                                    }}
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.1)',
                                      border: 'none',
                                      color: '#ef4444',
                                      padding: '4px 6px',
                                      borderRadius: '6px',
                                      fontSize: '10px',
                                      cursor: 'pointer',
                                      transition: 'all 0.3s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '24px',
                                      height: '24px'
                                    }}
                                    onMouseOver={(e) => {
                                      e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                                      e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseOut={(e) => {
                                      e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                      e.target.style.transform = 'scale(1)';
                                    }}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>

                              <p style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                margin: '0 0 8px 0',
                                lineHeight: '1.4'
                              }}>
                                {notification.message}
                              </p>

                              <p style={{
                                fontSize: '11px',
                                color: '#9ca3af',
                                margin: '0'
                              }}>
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div style={{
                      padding: '12px 20px',
                      background: '#f8fafc',
                      borderTop: '1px solid #e5e7eb',
                      textAlign: 'center'
                    }}>
                      <Link
                        to="/admin/notifications"
                        style={{
                          color: '#8b5cf6',
                          fontSize: '14px',
                          fontWeight: '500',
                          textDecoration: 'none'
                        }}
                        onClick={closeNotification}
                      >
                        Xem tất cả thông báo
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cart Icon */}
          {(!currentUser || currentUser.role === 'customer') && (
            <Link 
              to="/cart" 
              style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <svg 
                style={{ width: '24px', height: '24px', color: 'white' }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ff4757',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Menu */}
          {currentUser ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  background: isDropdownOpen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isDropdownOpen) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isDropdownOpen) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  👤
                </div>
                {currentUser.email.split('@')[0]}
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  minWidth: '200px',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                <div style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <div style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    {currentUser.role === 'admin' ? 'Quản trị viên' : 
                     currentUser.role === 'shop' ? 'Chủ cửa hàng' : 'Khách hàng'}
                  </div>
                </div>
                
                {currentUser.role === 'customer' && (
                  <Link 
                    to="/account" 
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      color: '#374151',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.color = '#1e40af';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#374151';
                    }}
                  >
                    👤 Tài khoản
                  </Link>
                )}
                {currentUser.role === 'customer' && (
                  <>
                    <Link 
                      to="/my/payments" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      💳 Thanh toán của tôi
                    </Link>
                    <Link 
                      to="/support" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      🆘 Hỗ trợ
                    </Link>
                  </>
                )}
                
                {currentUser.role === 'admin' && (
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsDropdownOpen(false)}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      color: '#374151',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f8fafc';
                      e.target.style.color = '#1e40af';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#374151';
                    }}
                  >
                    ⚙️ Quản lý
                  </Link>
                )}
                
                {currentUser.role === 'shop' && (
                  <>
                    <Link 
                      to="/shop/dashboard" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      🏪 Dashboard Shop
                    </Link>
                    <Link 
                      to="/shop/products" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      📦 Quản lý Sản phẩm
                    </Link>
                    <Link 
                      to="/shop/orders" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      📋 Quản lý Đơn hàng
                    </Link>
                    <Link 
                      to="/shop/reports" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      📊 Báo cáo & Thống kê
                    </Link>
                    <Link 
                      to="/shop/customers" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      👥 Quản lý Khách hàng
                    </Link>
                    <Link 
                      to="/shop/analytics" 
                      onClick={() => setIsDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f8fafc';
                        e.target.style.color = '#1e40af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#374151';
                      }}
                    >
                      📈 Phân tích Sản phẩm
                    </Link>
                  </>
                )}
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#fef2f2';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  🚪 Đăng xuất
                </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >
          ☰
        </button>
      </nav>
    </header>
  );
};

export default Header;
