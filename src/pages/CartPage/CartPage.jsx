import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useNotification } from '../../contexts/NotificationContext';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, handleUpdateCart, handleRemoveFromCart, handleCheckout, currentUser } = useAppContext();
  const { showWarning } = useNotification();
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckoutClick = () => {
    if (!currentUser) {
      showWarning("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate('/login');
      return;
    }
    handleCheckout();
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '32px',
        borderRadius: '20px',
        marginBottom: '32px',
        border: '2px solid #cbd5e1',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          🛒 Giỏ hàng của bạn
        </h1>
        <p style={{
          color: '#64748b',
          fontSize: '16px'
        }}>
          Quản lý và thanh toán các sản phẩm đã chọn
        </p>
      </div>
      
      {cart.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>🛒</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Giỏ hàng của bạn đang trống
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Hãy khám phá và thêm những sản phẩm yêu thích vào giỏ hàng
          </p>
          <button 
            onClick={() => navigate('/products')} 
            style={{
              background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
              color: '#581c87',
              padding: '16px 32px',
              borderRadius: '16px',
              border: '2px solid #c084fc',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '0 auto'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.3)';
              e.target.style.borderColor = '#a855f7';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.2)';
              e.target.style.borderColor = '#c084fc';
            }}
          >
            🛍️ Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ flex: '2' }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              {cart.map((item, index) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '24px',
                  borderBottom: index < cart.length - 1 ? '2px solid #f1f5f9' : 'none',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginRight: '20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <div style={{ flex: '1' }}>
                    <h2 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1e293b',
                      marginBottom: '8px'
                    }}>
                      {item.name}
                    </h2>
                    <p style={{
                      fontSize: '16px',
                      color: '#64748b',
                      marginBottom: '4px'
                    }}>
                      Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#94a3b8',
                      textTransform: 'capitalize'
                    }}>
                      📂 {item.category}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <label style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        Số lượng:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateCart(item.id, parseInt(e.target.value))}
                        style={{
                          width: '80px',
                          padding: '8px 12px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          textAlign: 'center',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#374151',
                          backgroundColor: '#f8fafc',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#c084fc';
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 0 0 3px rgba(192, 132, 252, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e2e8f0';
                          e.target.style.backgroundColor = '#f8fafc';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div style={{
                      minWidth: '140px',
                      textAlign: 'right'
                    }}>
                      <p style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#059669',
                        margin: 0
                      }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.id)} 
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: '2px solid #fecaca',
                        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                        color: '#dc2626',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#fca5a5';
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#fecaca';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: '1' }}>
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e2e8f0',
              position: 'sticky',
              top: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                💳 Tổng cộng
              </h2>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <span style={{
                  fontSize: '16px',
                  color: '#64748b'
                }}>
                  Tạm tính ({cart.length} sản phẩm)
                </span>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '2px solid #f1f5f9'
              }}>
                <span style={{
                  fontSize: '16px',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🚚 Phí vận chuyển
                </span>
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#059669'
                }}>
                  Miễn phí
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 0',
                marginBottom: '24px'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1e293b'
                }}>
                  Thành tiền
                </span>
                <span style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#059669'
                }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </span>
              </div>
              {!currentUser ? (
                <div>
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '2px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{ fontSize: '20px' }}>⚠️</div>
                      <p style={{
                        color: '#92400e',
                        fontWeight: '600',
                        fontSize: '14px',
                        margin: 0
                      }}>
                        Bạn cần đăng nhập để thanh toán
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                      onClick={() => navigate('/login')} 
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        color: '#1e40af',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px solid #93c5fd',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
                        e.target.style.borderColor = '#60a5fa';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                        e.target.style.borderColor = '#93c5fd';
                      }}
                    >
                      🔐 Đăng nhập để thanh toán
                    </button>
                    <button 
                      onClick={() => navigate('/register')} 
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        color: '#374151',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px solid #d1d5db',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(107, 114, 128, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(107, 114, 128, 0.3)';
                        e.target.style.borderColor = '#9ca3af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(107, 114, 128, 0.2)';
                        e.target.style.borderColor = '#d1d5db';
                      }}
                    >
                      ✨ Tạo tài khoản mới
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleCheckoutClick} 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    color: '#166534',
                    padding: '18px',
                    borderRadius: '12px',
                    border: '2px solid #86efac',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.3)';
                    e.target.style.borderColor = '#4ade80';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.2)';
                    e.target.style.borderColor = '#86efac';
                  }}
                >
                  💳 Tiến hành thanh toán
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
