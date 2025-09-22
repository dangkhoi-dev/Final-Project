import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, isAdmin, isShop, isCustomer } = useAppContext();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'shop' && !isShop()) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'customer' && !isCustomer()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
