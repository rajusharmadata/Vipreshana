import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Loader from './components/Loader';

import Dashboard from './Dashboard';
import About from './About';
import Bookings from './Bookings';
import LoginDashboard from './LoginDashboard';
import Contact from './Contact';
import Registration from './Registration';
import Login from './login';
import HowItWorks from './Howitworks';
import { ThemeProvider } from './context/ThemeContext';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/login-dashboard" element={<LoginDashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a fake delay for loader (2 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <ThemeProvider>
      <Router>
        {loading ? <Loader /> : <AnimatedRoutes />}
      </Router>
    </ThemeProvider>
  );
}

export default App;
