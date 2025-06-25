import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AuthLoader from '../components/AuthLoader';
import { verifyAuthState, refreshAuthToken } from '../utils/authUtils';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, refreshAuth } = useAuth();
  const [localUser, setLocalUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();

  // Verify authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check context auth state (fastest)
        if (isAuthenticated) {
          console.log('User authenticated via context');
          setIsChecking(false);
          return;
        }

        // Then check localStorage (fast)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            if (userData && userData.id) {
              console.log('User authenticated via localStorage');
              setLocalUser(userData);
              
              // Try to refresh auth context with this user
              if (refreshAuth && retryCount === 0) {
                console.log('Refreshing auth context with localStorage user');
                await refreshAuth();
              }
              
              setIsChecking(false);
              return;
            }
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
          }
        }

        // If this is the first try, attempt to refresh auth
        if (retryCount === 0 && refreshAuth) {
          console.log('Attempting to refresh authentication...');
          const refreshed = await refreshAuth();
          
          if (refreshed) {
            console.log('Authentication refreshed successfully');
            setIsChecking(false);
            return;
          }
          
          // Increment retry count and continue to next verification method
          setRetryCount(1);
          return;
        }

        // Finally, verify with server/Supabase (slower but most reliable)
        const isAuthed = await verifyAuthState();
        
        if (isAuthed) {
          console.log('User authenticated via Supabase verification');
          
          // Try to refresh token if authenticated
          await refreshAuthToken();
          
          // Check localStorage again after verification
          const refreshedUser = localStorage.getItem('user');
          if (refreshedUser) {
            setLocalUser(JSON.parse(refreshedUser));
          }
          
          // Store the current path for return after auth
          sessionStorage.setItem('lastAuthenticatedPath', location.pathname);
        } else {
          // Store the current path for redirect after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          console.log('Not authenticated, stored redirect path:', location.pathname);
        }
        
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, refreshAuth, retryCount, location.pathname]);

  // Show notification if not authenticated
  useEffect(() => {
    if (!isChecking && !isAuthenticated && !localUser) {
      toast.error('Please login to access this page', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [isChecking, isAuthenticated, localUser]);

  // If still checking, show loading component with appropriate message
  if (isChecking) {
    return <AuthLoader message={retryCount === 0 ? "Verifying authentication..." : "Performing additional verification..."} />;
  }

  // If authenticated or found in localStorage, show the protected route
  if (isAuthenticated || localUser) {
    return children;
  }

  // Otherwise, redirect to login with return URL
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default ProtectedRoute; 