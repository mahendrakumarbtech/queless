import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [], redirectToAdminLogin = false }) => {
  const { isAuthenticated, user, isAdminAuthenticated, adminUser, loading, adminLoading } = useAuth();
  const location = useLocation();

  const isAdminRoute = redirectToAdminLogin || location.pathname.startsWith('/admin');

  if (isAdminRoute ? adminLoading : loading) {
    return <div>Loading...</div>;
  }

  if (isAdminRoute) {
    if (!isAdminAuthenticated || !adminUser) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }
    const adminRole = typeof adminUser.role === 'string' ? adminUser.role : (adminUser.role?.name || '');
    if (allowedRoles.length > 0 && !allowedRoles.includes(adminRole)) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = typeof user.role === 'string' ? user.role : (user.role?.name || 'customer');
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
