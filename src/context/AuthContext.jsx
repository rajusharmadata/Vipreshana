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
    // Check if we have hash or query strings with sensitive data
    const hasTokenInHash = window.location.hash && (
      window.location.hash.includes('access_token') || 
      window.location.hash.includes('refresh_token') ||
      window.location.hash.includes('id_token')
    );
    
    const hasTokenInSearch = window.location.search && (
      window.location.search.includes('access_token') ||
      window.location.search.includes('refresh_token') ||
      window.location.search.includes('id_token')
    );
    
    if (hasTokenInHash || hasTokenInSearch) {
      // For auth callback URLs, replace with dashboard directly
      if (window.location.pathname.includes('/auth/callback')) {
        window.history.replaceState(null, document.title, '/dashboard');
        console.log('Auth callback URL replaced with dashboard');
      } else {
        // For other URLs, just clean the params/hash
        window.history.replaceState(null, document.title, window.location.pathname);
        console.log('URL cleaned of sensitive tokens');
      }
      
      // Additional check for any remaining tokens
      if (window.location.toString().includes('token')) {
        console.warn('Token still detected in URL after cleaning attempt');
        window.history.replaceState(null, document.title, '/dashboard');
      }
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
        
        // Clean URL when auth state changes
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
          // Extra security: clean URL again after sign-in
          setTimeout(cleanUrlOfTokens, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    // Set up additional URL monitoring for security
    const intervalId = setInterval(() => {
      if (window.location.toString().includes('token')) {
        console.warn('Token detected in URL during monitoring');
        cleanUrlOfTokens();
      }
    }, 1000);

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