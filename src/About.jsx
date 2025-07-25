import React, { useEffect, useState } from 'react';
import { useTheme } from './context/ThemeContext';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar'; // <-- Import Navbar
import PageMeta from './components/Pagemeta';
import FAQSection from './components/FAQs'; // Import FAQSection component

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showScrollTop, setShowScrollTop] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        setShowScrollTop(window.scrollY > 300);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: { opacity: 0, y: -40, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
    <PageMeta /> 
      <Navbar /> {/* Render the Navbar at the top */}
      <motion.div
        className={`min-h-screen flex flex-col items-center justify-center px-6 py-16 transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white'
            : 'bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900'
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl py-4 font-bold text-center mb-4 tracking-tight"
          variants={itemVariants}
        >
          Empowering Smarter Deliveries with Vipreshana 🚛✨
        </motion.h1>
        <motion.p
          className="text-center max-w-xl text-lg mb-12"
          variants={itemVariants}
        >
          From real-time tracking to complaint resolution, we're building a connected delivery ecosystem that just works.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {[
            {
              icon: '📍',
              title: 'Live Tracking',
              desc: "Track your delivery's exact location in real-time. No more wondering where your package is.",
            },
            {
              icon: '💬',
              title: 'Instant Alerts',
              desc: 'Stay updated with SMS notifications and status changes every step of the way.',
            },
            {
              icon: '📦',
              title: 'Smart Complaints',
              desc: 'Raise and resolve issues with automated status flows and admin tracking.',
            },
            {
              icon: '🤝',
              title: 'Trusted Drivers',
              desc: 'All drivers are verified and rated — ensuring reliable service and peace of mind.',
            },
            {
              icon: '📊',
              title: 'Role-Based Dashboards',
              desc: 'Separate control panels for users, drivers, and admins to manage things easily.',
            },
            {
              icon: '⚡',
              title: 'Fast & Transparent',
              desc: 'We keep you in control and your goods in motion — with speed and accountability.',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className={`p-6 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 ${
                isDark ? 'bg-white/10' : 'bg-white'
              }`}
              variants={itemVariants}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Section */}
        <motion.div className="mt-16 max-w-3xl text-center" variants={itemVariants}>
          <h2 className="text-2xl font-bold mb-4">Our Mission 🌍</h2>
          <p className="text-lg leading-relaxed">
            We're not just delivering goods — we're delivering trust, visibility, and speed. Vipreshana is on a mission to
            bring logistics into the modern era through smart tech, transparent systems, and user-first experiences.
          </p>
        </motion.div>

        {/* Call-to-action */}
        <motion.div className="mt-12" variants={itemVariants}>
          <button
            className={`px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-all duration-300 ${
              isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
            onClick={() => window.location.href = '/how-it-works'}
          >
            Explore How It Works
          </button>
        </motion.div>
      </motion.div>
      {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
                isDark
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-pink-500 hover:to-blue-500'
              }`}
              aria-label="Scroll to top"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </motion.button>
          )}
    </>
  );
};

export default About;