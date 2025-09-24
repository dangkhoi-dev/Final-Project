import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotificationBell } from './NotificationBellContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import { initialProducts, initialUsers, initialShops, initialOrders, initialPayments, initialReviews } from '../data/mockData';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotification();
  const { addNotification } = useNotificationBell();
  
  // State - Reset localStorage để đảm bảo dữ liệu mới
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem('products');
    // Nếu không có dữ liệu hoặc dữ liệu cũ (không có status), reset về initialProducts
    if (!stored || !JSON.parse(stored)[0]?.status) {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(stored);
  });
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users')) || initialUsers);
  const [shops, setShops] = useState(() => JSON.parse(localStorage.getItem('shops')) || initialShops);
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem('orders');
    // Nếu không có dữ liệu hoặc dữ liệu cũ (không có paymentStatus), reset về initialOrders
    if (!stored || !JSON.parse(stored)[0]?.paymentStatus) {
      localStorage.setItem('orders', JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(stored);
  });
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem('payments')) || initialPayments);
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('reviews')) || initialReviews);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(sessionStorage.getItem('currentUser')) || null);
  const [promotions, setPromotions] = useState(() => JSON.parse(localStorage.getItem('promotions')) || [
    {
      id: 1,
      name: 'Giảm giá 20% thời trang nam',
      description: 'Áp dụng cho tất cả sản phẩm thời trang nam',
      type: 'percentage',
      value: 20,
      minOrderValue: 500000,
      maxDiscount: 200000,
      startDate: '2025-09-20T00:00:00Z',
      endDate: '2025-09-30T23:59:59Z',
      status: 'active',
      usageCount: 45,
      maxUsage: 100,
      applicableProducts: ['Thời trang nam'],
      applicableUsers: 'all'
    },
    {
      id: 2,
      name: 'Freeship cho đơn hàng từ 300k',
      description: 'Miễn phí vận chuyển cho đơn hàng từ 300.000 VND',
      type: 'freeship',
      value: 0,
      minOrderValue: 300000,
      maxDiscount: 50000,
      startDate: '2025-09-15T00:00:00Z',
      endDate: '2025-10-15T23:59:59Z',
      status: 'active',
      usageCount: 78,
      maxUsage: 200,
      applicableProducts: ['all'],
      applicableUsers: 'all'
    }
  ]);
  const [supportRequests, setSupportRequests] = useState(() => JSON.parse(localStorage.getItem('supportRequests')) || []);

  // Persist data to localStorage
  useEffect(() => localStorage.setItem('products', JSON.stringify(products)), [products]);
  useEffect(() => localStorage.setItem('users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('shops', JSON.stringify(shops)), [shops]);
  useEffect(() => localStorage.setItem('orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('payments', JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem('reviews', JSON.stringify(reviews)), [reviews]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => sessionStorage.setItem('currentUser', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('promotions', JSON.stringify(promotions)), [promotions]);
  useEffect(() => localStorage.setItem('supportRequests', JSON.stringify(supportRequests)), [supportRequests]);

  // Navigation function
  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };


  // Product functions
  const handleViewDetails = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product, quantity) => {
    // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    if (!currentUser) {
      showWarning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate('/login');
      return;
    }
    
    // Chỉ cho phép customer thêm vào giỏ hàng
    if (currentUser.role !== 'customer') {
      showWarning("Chỉ khách hàng mới có thể thêm sản phẩm vào giỏ hàng!");
      return;
    }
    
    // Chỉ cho phép thêm sản phẩm đã được duyệt
    if (product.status !== 'approved') {
      showWarning("Sản phẩm này chưa được duyệt và không thể thêm vào giỏ hàng!");
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    showSuccess(`${quantity} ${product.name} đã được thêm vào giỏ hàng!`);
  };

  const handleUpdateCart = (productId, quantity) => {
    if (quantity < 1) return;
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: quantity } : item));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Order functions
  const handleCheckout = () => {
    if (!currentUser) {
      showWarning("Vui lòng đăng nhập để thanh toán!");
      navigate('/login');
      return;
    }
    if (cart.length === 0) {
      showError("Giỏ hàng trống, không thể thanh toán!");
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const confirmMessage = `Bạn có chắc muốn đặt hàng với tổng tiền ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    const now = new Date().toISOString();
    const orderId = Date.now();

    // Tạo order với thông tin đầy đủ cho shop
    const newOrder = {
      id: orderId,
      userId: currentUser.id,
      items: cart,
      total: total,
      date: now,
      status: 'pending', // Chờ shop xác nhận
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      shippingAddress: 'Địa chỉ giao hàng mặc định', // Có thể thêm form nhập địa chỉ
      phone: '0901234567', // Có thể thêm form nhập số điện thoại
      
      // Thông tin cho shop tracking
      shopIds: [...new Set(cart.map(item => item.shopId))], // Danh sách shop IDs
      paymentDate: now, // Thời gian thanh toán
      confirmedDate: null, // Thời gian shop xác nhận
      shippedDate: null, // Thời gian shop giao hàng
      deliveredDate: null, // Thời gian giao hàng thành công
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Ước tính giao hàng sau 3 ngày
    };

    // Tạo payment records cho từng shop
    const newPayments = cart.reduce((payments, item) => {
      const existingPayment = payments.find(p => p.shopId === item.shopId);
      if (existingPayment) {
        existingPayment.amount += item.price * item.quantity;
        existingPayment.items.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });
      } else {
        payments.push({
          id: `PAY_${orderId}_${item.shopId}`,
          orderId: orderId,
          userId: currentUser.id,
          shopId: item.shopId,
          amount: item.price * item.quantity,
          method: 'credit_card',
          status: 'completed',
          transactionId: `TXN_${orderId}_${item.shopId}`,
          paymentDate: now,
          description: `Thanh toán đơn hàng #${orderId} - Shop ${item.shopId}`,
          items: [{
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }]
        });
      }
      return payments;
    }, []);

    // Cập nhật state
    setOrders([...orders, newOrder]);
    setPayments([...payments, ...newPayments]);
    setCart([]);

    // Gửi thông báo đến role shop về đơn mới
    addNotification({
      title: 'Đơn hàng mới',
      message: `Bạn có đơn hàng #${newOrder.id} cần xác nhận`,
      type: 'order',
      priority: 'high'
    }, ['shop']);

    showSuccess(`Đặt hàng thành công! Mã đơn hàng: #${newOrder.id}. Shop sẽ xác nhận và giao hàng trong 24h.`);
    navigate('/account');
  };

  // Auth functions
  const handleRegister = (email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      const msg = "Vui lòng nhập đầy đủ Email và Mật khẩu!";
      showError(msg);
      return { ok: false, message: msg };
    }

    if (users.find(user => (user.email || '').toLowerCase() === normalizedEmail)) {
      const msg = "Email đã tồn tại!";
      showError(msg);
      return { ok: false, message: msg };
    }
    const newUser = { id: Date.now(), email: normalizedEmail, password: normalizedPassword, role: 'customer' };
    setUsers([...users, newUser]);
    showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
    navigate('/login');
    return { ok: true };
  };

  const handleLogin = (email, password) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      const msg = "Vui lòng nhập email và mật khẩu.";
      showError(msg);
      return { ok: false, message: msg };
    }

    const userByEmail = users.find(u => (u.email || '').toLowerCase() === normalizedEmail);

    if (!userByEmail) {
      const msg = "Tài khoản không tồn tại. Vui lòng đăng ký hoặc kiểm tra lại email.";
      showError(msg);
      return { ok: false, message: msg };
    }

    if (userByEmail.password !== normalizedPassword) {
      const msg = "Mật khẩu không đúng. Vui lòng thử lại.";
      showError(msg);
      return { ok: false, message: msg };
    }

    setCurrentUser(userByEmail);

    // Clear giỏ hàng nếu đăng nhập với role khác customer
    if (userByEmail.role !== 'customer') {
      setCart([]);
    }

    showSuccess(`Chào mừng ${userByEmail.email}!`);
    if (userByEmail.role === 'admin') navigate('/admin/dashboard');
    else if (userByEmail.role === 'shop') navigate('/shop/dashboard');
    else navigate('/');
    return { ok: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]); // Clear giỏ hàng khi logout
    showSuccess("Đã đăng xuất thành công!");
    navigate('/');
  };

  // Customer profile update
  const updateProfile = (profileUpdates) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...profileUpdates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    showSuccess('Cập nhật thông tin tài khoản thành công!');
  };

  // Customer support
  const submitSupportRequest = (request) => {
    if (!currentUser) return;
    const newRequest = {
      id: Date.now(),
      userId: currentUser.id,
      email: currentUser.email,
      status: 'open',
      createdAt: new Date().toISOString(),
      ...request
    };
    setSupportRequests(prev => [newRequest, ...prev]);
    showSuccess('Yêu cầu hỗ trợ đã được gửi. Chúng tôi sẽ phản hồi sớm!');
  };

  // Protected route check
  const isAdmin = () => currentUser && currentUser.role === 'admin';
  const isShop = () => currentUser && currentUser.role === 'shop';
  const isCustomer = () => currentUser && currentUser.role === 'customer';

  // Filter products based on user role
  const getVisibleProducts = () => {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'shop')) {
      return products; // Admin và shop thấy tất cả sản phẩm
    }
    return products.filter(product => product.status === 'approved'); // Customer chỉ thấy sản phẩm đã duyệt
  };

  // Add product function for shop
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, product]);
  };

  const value = {
    // State
    products: getVisibleProducts(),
    allProducts: products, // Tất cả sản phẩm cho admin
    setProducts,
    users,
    setUsers,
    shops,
    setShops,
    orders,
    setOrders,
    payments,
    setPayments,
    reviews,
    setReviews,
    promotions,
    setPromotions,
    supportRequests,
    setSupportRequests,
    cart,
    setCart,
    currentUser,
    setCurrentUser,
    
    // Functions
    navigateTo,
    handleViewDetails,
    handleAddToCart,
    handleUpdateCart,
    handleRemoveFromCart,
    handleCheckout,
    handleRegister,
    handleLogin,
    handleLogout,
    addProduct, // New function for shop
    updateProfile,
    submitSupportRequest,
    
    // Auth checks
    isAdmin,
    isShop,
    isCustomer,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
