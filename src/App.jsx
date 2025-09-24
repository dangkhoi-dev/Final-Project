import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/custom.css';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationBellProvider } from './contexts/NotificationBellContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './pages/layout/Header';
import HomePage from './pages/HomePage/HomePage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/CartPage/CartPage';
import LoginPage from './pages/auth/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import AccountPage from './pages/AccountPage/AccountPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage/AdminDashboardPage';
import AdminStoreManagementPage from './pages/admin/AdminStoreManagementPage/AdminStoreManagementPage';
import AdminProductManagementPage from './pages/admin/AdminProductManagementPage/AdminProductManagementPage';
import AdminOrderManagementPage from './pages/admin/AdminOrderManagementPage/AdminOrderManagementPage';
import AdminCustomerManagementPage from './pages/admin/AdminCustomerManagementPage/AdminCustomerManagementPage';
import AdminPaymentManagementPage from './pages/admin/AdminPaymentManagementPage/AdminPaymentManagementPage';
import AdminReportsPage from './pages/admin/AdminReportsPage/AdminReportsPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage/AdminNotificationsPage';
import AdminSupportPage from './pages/admin/AdminSupportPage/AdminSupportPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage/AdminReviewsPage';
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage/AdminPromotionsPage';
import AdminPermissionsPage from './pages/admin/AdminPermissionsPage/AdminPermissionsPage';
import AdminFinancePage from './pages/admin/AdminFinancePage/AdminFinancePage';
import ShopDashboardPage from './pages/shop/ShopDashboardPage/ShopDashboardPage';
import ShopProductManagementPage from './pages/shop/ShopProductManagementPage/ShopProductManagementPage';
import ShopAddProductPage from './pages/shop/ShopAddProductPage/ShopAddProductPage';
import ShopOrderManagementPage from './pages/shop/ShopOrderManagementPage/ShopOrderManagementPage';
import ShopPaymentManagementPage from './pages/shop/ShopPaymentManagementPage/ShopPaymentManagementPage';
import ShopReviewManagementPage from './pages/shop/ShopReviewManagementPage/ShopReviewManagementPage';
import ShopReportsPage from './pages/shop/ShopReportsPage/ShopReportsPage';
import ShopCustomerManagementPage from './pages/shop/ShopCustomerManagementPage/ShopCustomerManagementPage';
import ShopProductAnalyticsPage from './pages/shop/ShopProductAnalyticsPage/ShopProductAnalyticsPage';
import ShopSupportPage from './pages/shop/ShopSupportPage/ShopSupportPage';
import NotificationDemo from './components/NotificationDemo';
import CustomerPromotionsPage from './pages/customer/CustomerPromotionsPage/CustomerPromotionsPage';
import CustomerPaymentsPage from './pages/customer/CustomerPaymentsPage/CustomerPaymentsPage';
import CustomerSupportPage from './pages/customer/CustomerSupportPage/CustomerSupportPage';

const AppContent = () => {
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/account" element={
            <ProtectedRoute requiredRole="customer">
              <AccountPage />
            </ProtectedRoute>
          } />
          <Route path="/promotions" element={<CustomerPromotionsPage />} />
          <Route path="/my/payments" element={
            <ProtectedRoute requiredRole="customer">
              <CustomerPaymentsPage />
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute requiredRole="customer">
              <CustomerSupportPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute requiredRole="admin">
              <AdminStoreManagementPage />
            </ProtectedRoute>
          } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminProductManagementPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminOrderManagementPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/customers" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminCustomerManagementPage />
                    </ProtectedRoute>
                  } />
                <Route path="/admin/payments" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPaymentManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/notifications" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminNotificationsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/support" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminSupportPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reviews" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminReviewsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/promotions" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPromotionsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/permissions" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPermissionsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/finance" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminFinancePage />
                  </ProtectedRoute>
                } />
          
                {/* Shop Routes */}
                <Route path="/shop" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/dashboard" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/products" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopProductManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/add-product" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopAddProductPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/orders" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopOrderManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/payments" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopPaymentManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/reviews" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopReviewManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/reports" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/support" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopSupportPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/customers" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopCustomerManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/shop/analytics" element={
                  <ProtectedRoute requiredRole="shop">
                    <ShopProductAnalyticsPage />
                  </ProtectedRoute>
                } />
        </Routes>
        </main>
      <footer className="footer">
        <div className="container text-center text-gray-600">
            <p>&copy; 2025 E-Shop. All rights reserved.</p>
          </div>
        </footer>
      <NotificationDemo />
      </div>
    );
};

export default function App() {
  return (
  <Router>
    <NotificationProvider>
      <NotificationBellProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </NotificationBellProvider>
    </NotificationProvider>
  </Router>
  );
}