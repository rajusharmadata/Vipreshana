import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import User from './components/User';
import Driver from './components/Driver';
import Login from './login';
import Registration from './Registration';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword';
import Location from './Location';
import LoginDashboard from './LoginDashboard';
import Bookings from './Bookings';
import ResetPassword from './ResetPassword';
import AdminDashboard from './AdminDashboard';
<<<<<<< add-page-transition-animation
import Loader from './components/LoaderTemp';



const AnimatedRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 600); 
    return () => clearTimeout(timeout);
  }, [location]);

  if (loading) return <Loader />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/user" element={<PageWrap><User /></PageWrap>} />
        <Route path="/driver" element={<PageWrap><Driver /></PageWrap>} />
        <Route path="/" element={<PageWrap><Dashboard /></PageWrap>} />  
        <Route path="/reset-password" element={<PageWrap><ResetPassword /></PageWrap>} />
        <Route path="/location" element={<PageWrap><Location /></PageWrap>} />  
        <Route path="/bookings" element={<PageWrap><Bookings /></PageWrap>} />  
        <Route path="/admin" element={<PageWrap><AdminDashboard /></PageWrap>} />
        <Route path="/register" element={<PageWrap><Registration /></PageWrap>} />  
        <Route path="/login" element={<PageWrap><Login /></PageWrap>} /> 
        <Route path="/forgot-password" element={<PageWrap><ForgotPassword /></PageWrap>} />
        <Route path="/logindashboard" element={<PageWrap><LoginDashboard /></PageWrap>} /> 
      </Routes>
    </AnimatePresence>
  );
};

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

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
=======
import Contact from './Contact';
import About from './About';
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
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnHover
          draggable
        />
      </Router>
    </ThemeProvider>
>>>>>>> main
  );
}

export default App;
