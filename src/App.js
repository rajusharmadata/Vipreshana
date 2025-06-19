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

// Auth security middleware to protect user tokens
const AuthSecurityHandler = ({ children }) => {
  useEffect(() => {
    // This runs on every route change to ensure token security
    const cleanHashAndTokens = () => {
      // Check if we have sensitive info in the URL that needs to be cleaned
      if (window.location.hash && window.location.hash.includes('access_token')) {
        // Keep track of the path without tokens
        const cleanPath = window.location.pathname;
        // Replace URL with a clean version (no hash or query params with tokens)
        window.history.replaceState(null, document.title, cleanPath);
        console.log('URL cleaned of sensitive tokens');
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

    // Clean up event listener
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return <>{children}</>;
};

// Auth callback handler component for Supabase OAuth redirects
const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // The actual auth state is handled by the AuthContext
    // This component just redirects after the callback is processed
    console.log('Auth callback received - processing OAuth redirect');
    console.log('Current path:', location.pathname);
    console.log('Has hash:', !!location.hash);

    // Clean the URL by replacing the current history state to remove tokens
    // This handles both /auth/callback and /auth/callback# formats
    window.history.replaceState(null, document.title, '/dashboard');

    // Force redirect to dashboard
    navigate('/dashboard', { replace: true });
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/dashboard" element={<LoginDashboard />} />
        <Route path="/login-dashboard" element={<LoginDashboard />} />
        <Route path="/logindashboard" element={<LoginDashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/location" element={<Location />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<User />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* Catch-all for auth callbacks with hash fragments */}
        <Route path="/auth/*" element={<AuthCallback />} />
        </Route>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        draggable
      />
        
      </Routes>
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
        </Router>
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
