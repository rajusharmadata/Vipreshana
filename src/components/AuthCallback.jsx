import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { verifyAuthState } from '../utils/authUtils';
import './Loader.css';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Handling authentication callback...');
        
        // Check if we have a hash fragment in the URL (common for OAuth redirects)
        if (window.location.hash || window.location.search) {
          setStatus('Processing OAuth response...');
          
          // Let Supabase handle the callback
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error processing auth callback:', error);
            setStatus('Authentication failed. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
          
          if (data?.session) {
            // Successfully authenticated
            setStatus('Authentication successful! Redirecting...');
            
            // Get user details
            const user = data.session.user;
            
            // Create a safe user object to store in localStorage
            const safeUserData = {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.email,
              role: 'user', // Default role
            };
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(safeUserData));
            
            // Dispatch events to notify components
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('login'));
            window.dispatchEvent(new CustomEvent('authChange', { 
              detail: { isAuthenticated: true, user: safeUserData } 
            }));
            
            // Get the intended URL from sessionStorage or default to dashboard
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
            sessionStorage.removeItem('redirectAfterLogin'); // Clean up
            
            // Redirect to the dashboard or intended URL
            setTimeout(() => navigate(redirectTo), 1000);
          } else {
            // No session but no error either - strange case
            setStatus('No session found. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
          }
        } else {
          // No hash or search params - might be a direct visit to this URL
          setStatus('No authentication data found. Redirecting...');
          
          // Check if we're already authenticated
          const isAuthenticated = await verifyAuthState();
          
          if (isAuthenticated) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus('An error occurred. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-callback-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div className="loader"></div>
      <h2 style={{ marginTop: '20px' }}>{status}</h2>
    </div>
  );
};

export default AuthCallback; 