// Dữ liệu mẫu cho sản phẩm với trạng thái kiểm duyệt
export const initialProducts = [
  { id: 1, shopId: 1, name: 'Áo thun nam', price: 350000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Thời trang nam', description: 'Áo thun cotton 100%, thoáng mát và thấm hút mồ hôi tốt.', status: 'approved', submittedAt: '2025-01-15T10:00:00.000Z', reviewedAt: '2025-01-15T14:30:00.000Z' },
  { id: 2, shopId: 1, name: 'Quần jeans nữ', price: 750000, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Thời trang nữ', description: 'Quần jeans ống đứng, tôn dáng, chất liệu co giãn thoải mái.', status: 'approved', submittedAt: '2025-01-15T10:15:00.000Z', reviewedAt: '2025-01-15T14:45:00.000Z' },
  { id: 3, shopId: 2, name: 'Giày thể thao', price: 1200000, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Giày dép', description: 'Giày thể thao năng động, phù hợp cho chạy bộ và các hoạt động ngoài trời.', status: 'approved', submittedAt: '2025-01-16T09:00:00.000Z', reviewedAt: '2025-01-16T11:20:00.000Z' },
  { id: 4, shopId: 2, name: 'Đồng hồ thông minh', price: 4500000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Phụ kiện', description: 'Đồng hồ thông minh theo dõi sức khỏe, nhận thông báo từ điện thoại.', status: 'approved', submittedAt: '2025-01-16T09:30:00.000Z', reviewedAt: '2025-01-16T11:45:00.000Z' },
  { id: 5, shopId: 1, name: 'Balo laptop', price: 950000, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Phụ kiện', description: 'Balo chống nước, có ngăn đựng laptop 15.6 inch.', status: 'approved', submittedAt: '2025-01-17T08:00:00.000Z', reviewedAt: '2025-01-17T10:15:00.000Z' },
  { id: 6, shopId: 1, name: 'Váy hoa', price: 850000, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Thời trang nữ', description: 'Váy hoa nhí, chất liệu voan mềm mại, thích hợp đi dạo phố.', status: 'pending', submittedAt: '2025-01-18T15:30:00.000Z' },
  { id: 7, shopId: 2, name: 'Áo sơ mi nam', price: 550000, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Thời trang nam', description: 'Áo sơ mi dài tay, form regular fit, lịch lãm và sang trọng.', status: 'pending', submittedAt: '2025-01-18T16:00:00.000Z' },
  { id: 8, shopId: 2, name: 'Túi xách da', price: 1500000, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', category: 'Phụ kiện', description: 'Túi xách da thật, thiết kế tinh tế, phù hợp cho công sở và dự tiệc.', status: 'rejected', submittedAt: '2025-01-17T14:00:00.000Z', reviewedAt: '2025-01-17T16:30:00.000Z', rejectionReason: 'Hình ảnh sản phẩm không rõ ràng' },
];

// Dữ liệu mẫu cho người dùng với các vai trò khác nhau
export const initialUsers = [
    { id: 1, email: 'customer@example.com', password: '123', role: 'customer' },
    { id: 2, email: 'admin@example.com', password: '123', role: 'admin' },
    { id: 3, email: 'shop1@example.com', password: '123', role: 'shop', shopId: 1 },
    { id: 4, email: 'shop2@example.com', password: '123', role: 'shop', shopId: 2 }
];

// Dữ liệu mẫu cho các cửa hàng
export const initialShops = [
    { id: 1, name: 'Cool Fashion', owner: 'Nguyễn Văn A', email: 'shop1@example.com' },
    { id: 2, name: 'Gadget World', owner: 'Trần Thị B', email: 'shop2@example.com' }
];

// Dữ liệu mẫu cho các đơn hàng
export const initialOrders = [
    {
        id: 1678886400000, // Sử dụng timestamp làm ID
        userId: 1,
        items: [
            { id: 1, name: 'Áo thun nam', price: 350000, quantity: 2 },
            { id: 3, name: 'Giày thể thao', price: 1200000, quantity: 1 }
        ],
        total: 1900000,
        date: '2025-03-15T12:00:00.000Z',
        status: 'Đã giao',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0901234567'
    },
    {
        id: 1678972800000,
        userId: 1,
        items: [
            { id: 5, name: 'Balo laptop', price: 950000, quantity: 1 }
        ],
        total: 950000,
        date: '2025-03-16T12:00:00.000Z',
        status: 'Đang xử lý',
        paymentStatus: 'pending',
        paymentMethod: 'bank_transfer',
        shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
        phone: '0907654321'
    },
    {
        id: 1679059200000,
        userId: 1,
        items: [
            { id: 2, name: 'Quần jeans nữ', price: 750000, quantity: 1 },
            { id: 4, name: 'Đồng hồ thông minh', price: 4500000, quantity: 1 }
        ],
        total: 5250000,
        date: '2025-03-17T14:30:00.000Z',
        status: 'Đã hủy',
        paymentStatus: 'refunded',
        paymentMethod: 'credit_card',
        shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
        phone: '0909876543',
        cancelReason: 'Khách hàng yêu cầu hủy đơn'
    }
];

// Dữ liệu mẫu cho các giao dịch thanh toán
export const initialPayments = [
    {
        id: 'PAY_001',
        orderId: 1678886400000,
        userId: 1,
        amount: 1900000,
        method: 'credit_card',
        status: 'completed',
        transactionId: 'TXN_123456789',
        paymentDate: '2025-03-15T12:05:00.000Z',
        description: 'Thanh toán đơn hàng #1678886400000'
    },
    {
        id: 'PAY_002',
        orderId: 1678972800000,
        userId: 1,
        amount: 950000,
        method: 'bank_transfer',
        status: 'pending',
        transactionId: 'TXN_987654321',
        paymentDate: null,
        description: 'Chuyển khoản đơn hàng #1678972800000'
    },
    {
        id: 'PAY_003',
        orderId: 1679059200000,
        userId: 1,
        amount: 5250000,
        method: 'credit_card',
        status: 'refunded',
        transactionId: 'TXN_456789123',
        paymentDate: '2025-03-17T14:35:00.000Z',
        refundDate: '2025-03-17T16:00:00.000Z',
        refundAmount: 5250000,
        description: 'Hoàn tiền đơn hàng #1679059200000'
    }
];

// Dữ liệu mẫu cho đánh giá sản phẩm
export const initialReviews = [
    {
        id: 1,
        productId: 1,
        customerId: 1,
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@example.com',
        rating: 5,
        comment: 'Sản phẩm rất tốt, chất lượng cao, giao hàng nhanh. Tôi rất hài lòng với dịch vụ.',
        createdAt: '2025-09-19T10:00:00Z',
        status: 'approved',
        helpful: 12
    },
    {
        id: 2,
        productId: 2,
        customerId: 2,
        customerName: 'Trần Thị B',
        customerEmail: 'tranthib@example.com',
        rating: 4,
        comment: 'Giày đẹp, vừa chân nhưng giá hơi cao so với chất lượng.',
        createdAt: '2025-09-18T14:30:00Z',
        status: 'pending',
        helpful: 8
    }
];

// Dữ liệu mẫu cho khuyến mãi
export const initialPromotions = [
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
    }
];

// Dữ liệu mẫu cho nhân viên
export const initialStaff = [
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
    }
];

// Dữ liệu mẫu cho giao dịch tài chính
export const initialFinancialTransactions = [
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
    }
];

