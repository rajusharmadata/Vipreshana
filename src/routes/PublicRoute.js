import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [localUser, setLocalUser] = useState(null);

  // Check for user in localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setLocalUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error reading user data from localStorage:', error);
    }
  }, []);

  // If user is authenticated or found in localStorage, redirect to dashboard
  if (isAuthenticated || localUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, show the public route
  return children;
};

export default PublicRoute;