import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/Loader';
import { AuthProvider } from './context/AuthContext';
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
import PublicRoute from './routes/PublicRoute';import NotFound from './NotFound';

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

// Auth callback handler component for Supabase OAuth redirects
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Immediately clean URL to prevent token exposure
    const cleanAndRedirect = () => {
      console.log('Auth callback received - processing OAuth redirect');
      
      // Immediately replace the current URL to remove any tokens
      window.history.replaceState(null, document.title, '/dashboard');
      
      // Force redirect to dashboard after a short delay to ensure tokens are processed
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    };
    
    // Execute immediately
    cleanAndRedirect();
    
    // Also set up a backup redirect in case the first one fails
    const redirectTimeout = setTimeout(() => {
      if (window.location.pathname.includes('/auth/')) {
        console.log('Backup redirect triggered');
        window.history.replaceState(null, document.title, '/dashboard');
        navigate('/dashboard', { replace: true });
      }
    }, 1500);
    
    return () => clearTimeout(redirectTimeout);
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Completing Login...</h2>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
};
function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
        <Route path="/" element={<PublicRoute><Dashboard/></PublicRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/dashboard" element={<LoginDashboard />} />
        <Route path="/login-dashboard" element={<LoginDashboard />} />
        <Route path="/logindashboard" element={<LoginDashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<PublicRoute><Registration /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/location" element={<Location />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<User />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Catch-all for auth callbacks with hash fragments */}
        <Route path="/auth/*" element={<AuthCallback />} />
        <Route path="/profile" element={<Profile />} />
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
