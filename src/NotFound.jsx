import React from 'react';
import { useTheme } from './context/ThemeContext';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import PageMeta from './components/Pagemeta';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  return (
    <>
      <PageMeta title="404 - Page Not Found" />
      <Navbar />
      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center transition-all duration-300 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900'
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`text-7xl md:text-9xl font-bold mb-6 ${
            isDark ? 'text-blue-400' : 'text-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'
          }`}
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl mb-6"
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className={`px-8 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-blue-500'
          }`}
        >
          Go to Home
        </motion.button>
      </div>
    </>
  );
};

export default NotFound;
