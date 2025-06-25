import { supabase } from '../lib/supabase';

// Check if we're in production environment
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('127.0.0.1');

/**
 * Verifies authentication state by checking both localStorage and Supabase session
 * @returns {Promise<boolean>} True if authenticated, false otherwise
 */
export const verifyAuthState = async () => {
  try {
    console.log(`Verifying authentication state... (${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'})`);
    
    // Check localStorage first (faster)
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const userData = JSON.parse(localUser);
        if (userData && userData.id) {
          console.log('Found valid user in localStorage:', userData.email || userData.phone);
          return true;
        }
      } catch (e) {
        console.error('Error parsing user data from localStorage:', e);
      }
    }
    
    // If no valid localStorage user, check Supabase session
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting Supabase session:', error);
      return false;
    }
    
    if (data?.session?.user) {
      console.log('Found valid Supabase session:', data.session.user.email);
      
      // Create a safe user object to store in localStorage
      const safeUserData = {
        id: data.session.user.id,
        email: data.session.user.email,
        name: data.session.user.user_metadata?.full_name || 
              data.session.user.user_metadata?.name || 
              data.session.user.email,
        role: 'user', // Default role
      };
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(safeUserData));
      
      // Dispatch events to notify components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('login'));
      window.dispatchEvent(new CustomEvent('authChange', { 
        detail: { isAuthenticated: true, user: safeUserData } 
      }));
      
      return true;
    }
    
    // No valid auth found
    console.log('No valid authentication found');
    return false;
  } catch (error) {
    console.error('Error verifying auth state:', error);
    return false;
  }
};

/**
 * Refreshes the authentication token if needed
 */
export const refreshAuthToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
    
    if (data?.session) {
      console.log('Token refreshed successfully');
      console.log('Session expires at:', new Date(data.session.expires_at * 1000).toLocaleString());
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error in refreshAuthToken:', error);
    return false;
  }
};

/**
 * Checks if the current URL is the production deployment
 * @returns {boolean} True if running on production URL
 */
export const isProductionDeployment = () => {
  return window.location.hostname.includes('vipreshana-2.vercel.app');
};

/**
 * Updates the redirect URL for authentication callbacks based on environment
 */
export const getAuthRedirectUrl = () => {
  if (isProductionDeployment()) {
    return 'https://vipreshana-2.vercel.app/auth/callback';
  }
  return window.location.origin + '/auth/callback';
};

/**
 * Tests protected route behavior by temporarily removing authentication
 * @param {string} route - The route to test
 */
export const testProtectedRoute = (route = '/dashboard') => {
  console.log(`Testing protected route: ${route}`);
  
  // Store current path
  const currentPath = window.location.pathname;
  
  // Clear user data to simulate unauthenticated state
  const hadUser = !!localStorage.getItem('user');
  if (hadUser) {
    const userData = localStorage.getItem('user');
    localStorage.removeItem('user');
    console.log('Temporarily removed user data');
    
    // Try accessing protected route
    console.log(`Attempting to access ${route} without authentication...`);
    window.location.href = route;
    
    // Restore user data after 5 seconds
    setTimeout(() => {
      localStorage.setItem('user', userData);
      console.log('Restored user data');
      console.log('You should have been redirected to login');
      
      // Go back to original location
      setTimeout(() => {
        window.location.href = currentPath;
      }, 2000);
    }, 5000);
  } else {
    console.log('No user data found. Please login first to test this functionality.');
  }
};

/**
 * Tests login redirect functionality
 * @param {string} returnPath - The path to return to after login
 */
export const testLoginRedirect = (returnPath = '/dashboard') => {
  console.log(`Testing login redirect to: ${returnPath}`);
  
  // Store the return path
  sessionStorage.setItem('redirectAfterLogin', returnPath);
  console.log('Stored redirect path in sessionStorage');
  
  // Navigate to login
  console.log('Navigating to login page...');
  window.location.href = '/login';
}; 