import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Loader from './components/Loader';
// Import your pages. Adjust the import paths as needed.
import Dashboard from './Dashboard';
import Login from './login';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import LoginDashboard from './LoginDashboard';
import User from './components/User';
import Driver from './components/Driver';
import Location from './Location';
import Bookings from './Bookings';
import AdminDashboard from './AdminDashboard';

const PageWrap = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timeout);
  }, [location]);

  if (loading) return <Loader />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrap><Dashboard /></PageWrap>} />
        <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
        <Route path="/register" element={<PageWrap><Registration /></PageWrap>} />
        <Route path="/forgot-password" element={<PageWrap><ForgotPassword /></PageWrap>} />
        <Route path="/reset-password" element={<PageWrap><ResetPassword /></PageWrap>} />
        <Route path="/logindashboard" element={<PageWrap><LoginDashboard /></PageWrap>} />
        <Route path="/user" element={<PageWrap><User /></PageWrap>} />
        <Route path="/driver" element={<PageWrap><Driver /></PageWrap>} />
        <Route path="/location" element={<PageWrap><Location /></PageWrap>} />
        <Route path="/bookings" element={<PageWrap><Bookings /></PageWrap>} />
        <Route path="/admin" element={<PageWrap><AdminDashboard /></PageWrap>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
