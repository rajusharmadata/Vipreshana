import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/Loader';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from './components/Footer';
import Dashboard from './Dashboard';
import About from './About';
import HowItWorks from './Howitworks';
import Bookings from './Bookings';
import LoginDashboard from './LoginDashboard';
import Contact from './Contact';
import Registration from './Registration';
import Login from './login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Location from './Location';
import AdminDashboard from './AdminDashboard';
import User from './components/User';
import Driver from './components/Driver';
import Layout from './Layout';
import Profile from './profile'; 
// import PublicRoute from './routes/PublicRoute';
// Using the custom-made ProtectedRoute instead of PublicRoute
import ProtectedRoute from './routes/ProtectedRoute';
import NotFound from './NotFound';
import { supabase } from './lib/supabase';
import AuthCallbackComponent from './components/AuthCallback';

// Auth security middleware to protect user tokens
const AuthSecurityHandler = ({ children }) => {
  useEffect(() => {
    // This runs on every route change to ensure token security
    const cleanHashAndTokens = () => {
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
        // For auth callbacks, always redirect to logindashboard without exposing tokens
        window.history.replaceState(null, document.title, '/logindashboard');
        console.log('Auth callback URL cleaned and redirected to logindashboard');
        return;
      }
      
      // For any other page with tokens, just remove the query/hash part
      if (hasSensitiveData || window.location.hash || window.location.search) {
        window.history.replaceState(null, document.title, window.location.pathname);
        console.log('URL cleaned of sensitive data');
      }
    };

    // Clean on initial load
    cleanHashAndTokens();

    // Set up listener for location changes
    const handleLocationChange = () => {
      cleanHashAndTokens();
    };

    // Add event listener for URL changes
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
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
        cleanHashAndTokens();
      }
    }, 500);

    // Clean up event listeners
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      clearInterval(intervalId);
    };
  }, []);

  return <>{children}</>;
};

// Legacy auth callback component - now replaced by AuthCallbackComponent
// This is kept for reference and backward compatibility
// If you need to modify auth callback behavior, please update the AuthCallbackComponent instead

// Modified PublicRoute to redirect authenticated users to dashboard
const ProtectedPublicRoute = ({ children }) => {
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
  
  // If user is authenticated in context or localStorage, redirect to logindashboard
  if (isAuthenticated || localUser) {
    return <Navigate to="/logindashboard" replace />;
  }
  
  // Otherwise, show the requested public route
  return children;
};

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><LoginDashboard /></ProtectedRoute>} />
        <Route path="/login-dashboard" element={<ProtectedRoute><LoginDashboard /></ProtectedRoute>} />
        <Route path="/logindashboard" element={<ProtectedRoute><LoginDashboard /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<ProtectedPublicRoute><Registration /></ProtectedPublicRoute>} />
        <Route path="/login" element={<ProtectedPublicRoute><Login /></ProtectedPublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/location" element={<Location />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute><Driver /></ProtectedRoute>} />
        <Route path="/auth/callback" element={<AuthCallbackComponent />} />
        {/* Catch-all for auth callbacks with hash fragments */}
        <Route path="/auth/*" element={<AuthCallbackComponent />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        draggable
      />
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set document title explicitly
    document.title = 'Vipreshana';
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AuthSecurityHandler>
            {loading ? <Loader /> : <AppRoutes />}
          </AuthSecurityHandler>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
