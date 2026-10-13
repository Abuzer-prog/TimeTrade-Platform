import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageSpinner } from './Spinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageSpinner message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    // Preserve attempted destination in route state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
