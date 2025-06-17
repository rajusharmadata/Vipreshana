import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Loader from './components/Loader';

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
=======
import Contact from './Contact';
import About from './About';
import HowItWorks from './Howitworks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/user" element={<User />} />
          <Route path="/driver" element={<Driver />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/location" element={<Location />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/logindashboard" element={<LoginDashboard />} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/how-it-works" element={<HowItWorks/>} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          draggable
        />
      </Router>
    </ThemeProvider>

  );
}

export default App;
