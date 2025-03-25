
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

export const RequireAuth: React.FC<{ children: React.ReactNode; requireAuth?: boolean }> = ({ 
  children, 
  requireAuth = true
}) => {
  const { user, isLoading, isLocalOnly } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  // Allow access if:
  // 1. User has chosen local-only mode, OR
  // 2. User is logged in
  if (requireAuth && !isLocalOnly && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
