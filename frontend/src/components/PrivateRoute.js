import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [], redirectToAdminLogin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (redirectToAdminLogin || location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }
    return <Navigate to="/login" replace />;
  }

  // Get role as string (handle both string and object)
  const userRole = typeof user.role === 'string' 
    ? user.role 
    : (user.role?.name || 'customer');
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
