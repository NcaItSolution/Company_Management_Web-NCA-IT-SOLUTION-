import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/');
      return;
    }

    // Check if user has the required role
    const userRole = authService.getUserRole();
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'student') {
        navigate('/student');
      } else {
        navigate('/');
      }
      return;
    }
  }, [navigate, requiredRole]);

  // If user is authenticated and has correct role, render children
  if (authService.isAuthenticated() && (!requiredRole || authService.getUserRole() === requiredRole)) {
    return children;
  }

  // Show loading or nothing while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying access...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
