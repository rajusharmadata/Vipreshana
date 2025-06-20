import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('useAuth hook called, isAuthenticated:', context.isAuthenticated);
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  
  // Enhanced function to clean URL of tokens for security
  const cleanUrlOfTokens = () => {
    // Always clean URL regardless of path to ensure no tokens are ever exposed
    const currentUrl = window.location.toString();
    
    // Check for any sensitive tokens in the URL
    const hasSensitiveData = 
      currentUrl.includes('access_token') || 
      currentUrl.includes('refresh_token') ||
      currentUrl.includes('id_token') ||
      currentUrl.includes('token=') ||
      currentUrl.includes('authorization=') ||
      currentUrl.includes('auth=');
    
    // Handle auth callback paths specially
    if (window.location.pathname.includes('/auth/')) {
      // For auth callbacks, always redirect to dashboard without exposing tokens
      window.history.replaceState(null, document.title, '/dashboard');
      console.log('Auth callback URL cleaned and redirected to dashboard');
      return;
    }
    
    // For any other page with tokens, just remove the query/hash part
    if (hasSensitiveData || window.location.hash || window.location.search) {
      window.history.replaceState(null, document.title, window.location.pathname);
      console.log('URL cleaned of sensitive data');
    }
  };
  
  useEffect(() => {
    console.log('AuthProvider mounted');
    // Clean URL immediately on component mount
    cleanUrlOfTokens();
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting auth session:', error);
          return;
        }
        
        if (data?.session) {
          console.log('Found existing session:', data.session.user.email);
          // Only store minimal user information in state
          const safeUserData = {
            id: data.session.user.id,
            email: data.session.user.email,
            user_metadata: data.session.user.user_metadata ? {
              name: data.session.user.user_metadata.name,
              avatar_url: data.session.user.user_metadata.avatar_url,
              full_name: data.session.user.user_metadata.full_name,
            } : {}
          };
          
          setSession(data.session);
          setUser(safeUserData);
          console.log('User authenticated:', safeUserData.email);
          
          // Clean URL again after session is established
          cleanUrlOfTokens();
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (err) {
        console.error('Error in getInitialSession:', err);
      } finally {
        setLoading(false);
        console.log('Initial auth loading complete');
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        // Clean URL immediately when auth state changes
        cleanUrlOfTokens();
        
        if (newSession?.user) {
          // Only store minimal user information in state
          const safeUserData = {
            id: newSession.user.id,
            email: newSession.user.email,
            user_metadata: newSession.user.user_metadata ? {
              name: newSession.user.user_metadata.name,
              avatar_url: newSession.user.user_metadata.avatar_url,
              full_name: newSession.user.user_metadata.full_name,
            } : {}
          };
          
          setSession(newSession);
          setUser(safeUserData);
          console.log('User state updated:', safeUserData.email);
        } else {
          console.log('User state cleared - no session');
          setSession(null);
          setUser(null);
        }
        
        setLoading(false);

        // Handle specific auth events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed:', newSession?.user?.email);
          // Extra security: clean URL again after sign-in with a delay to catch any late changes
          setTimeout(cleanUrlOfTokens, 100);
          setTimeout(cleanUrlOfTokens, 500);
          setTimeout(cleanUrlOfTokens, 1000);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    // Set up more aggressive URL monitoring for security
    const intervalId = setInterval(() => {
      const currentUrl = window.location.toString();
      if (
        currentUrl.includes('token') || 
        currentUrl.includes('auth') || 
        currentUrl.includes('access_') || 
        currentUrl.includes('refresh_') ||
        window.location.hash || 
        window.location.search
      ) {
        console.warn('Potentially sensitive data detected in URL during monitoring');
        cleanUrlOfTokens();
      }
    }, 500); // Check more frequently

    return () => {
      console.log('AuthProvider unmounting, cleaning up listener');
      authListener?.subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  // Log whenever user or session state changes
  useEffect(() => {
    console.log('Auth state updated - User:', user ? 'Authenticated' : 'Not authenticated');
    console.log('Auth state updated - Session:', session ? 'Active' : 'None');
    
    // Clean URL again when auth state changes
    cleanUrlOfTokens();
  }, [user, session]);

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Cleanup local storage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPhone');
      localStorage.removeItem('currentUser');
      console.log('Sign out complete');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Safe getter for user public ID (no sensitive info)
  const getUserPublicId = () => {
    return user?.id || null;
  };
  
  // Helper function to determine if user is logged in
  const isLoggedIn = () => {
    return !!user;
  };
  
  // Provide auth context to the app
  const value = {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
    getUserPublicId,
    isLoggedIn,
  };

  console.log('AuthContext providing value - isAuthenticated:', value.isAuthenticated);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;