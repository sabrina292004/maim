import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

// AdminRoute: wrapper that redirects non-admins to home
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth() || {};

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
