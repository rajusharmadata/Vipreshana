'use client';
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Clock, Github, Linkedin, Twitter, Instagram, Facebook, ExternalLink } from 'lucide-react';

import Navbar from './components/Navbar';
import { useTheme } from './context/ThemeContext';
import Map from './components/Map';

const Contact = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const updateTime = () => {
      setCurrentHour(new Date().getHours());
    };

    // Update time every minute
    const interval = setInterval(updateTime, 60000);
    
    // Initial update
    updateTime();

    return () => clearInterval(interval);
  }, []);

  const isOpen = currentHour >= 9 && currentHour < 18;

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      url: 'https://github.com/sailaja-adapa/',
      color: 'hover:text-blue-600 dark:hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/sailaja-adapa-770167291/',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
   
  ];

 

  return (
    <>
      <Navbar />
      <div className={`min-h-screen pt-24 px-4 py-12 font-inter transition-all duration-700 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 text-gray-900'
      }`}>
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold mb-4 text-center ${
            isDark ? 'text-blue-400' : 'text-gray-900'
          }`}>
            Get In Touch
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Have questions about our services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className={`shadow-2xl rounded-3xl p-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-3xl font-bold mb-6 ${
              isDark ? 'text-blue-400' : 'text-gray-900'
            }`}>Send us a message</h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              ...
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info + Map */}
          <div className={`shadow-2xl rounded-3xl p-8 flex flex-col justify-between ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${
                isDark ? 'text-blue-400' : 'text-gray-900'
              }`}>Contact Info</h2>
              <div className={`space-y-4 ${
                isDark ? 'text-gray-300' : 'text-gray-800'
              }`}>
                <p className="flex items-center gap-2">
                  <MapPin className="text-pink-600" /> 
                  123 Logistics Street, Delhi, New Delhi 110003
                  </p>
                <p className="flex items-center gap-2">
                  <Mail className="text-indigo-600" /> 
                  info@vipreshana.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="text-fuchsia-600" /> 
                  +91 98765 43210
                </p>
                <p className={`flex items-center gap-2 font-semibold ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                  <Clock /> 
                  {isOpen ? 'We are Open Now!' : 'Currently Closed'}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Mon - Fri: 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-blue-400' : 'text-gray-900'
              }`}>Our Location</h3>
              <div className={`h-64 w-full rounded-lg overflow-hidden border relative z-10 ${
                isDark ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <Map />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className={`mt-20 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            {/* Company Info */}
            <div className="mb-8">
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-blue-400' : 'text-gray-900'
              }`}>
                Vipreshana
              </h3>
              <p className={`text-sm leading-relaxed mb-6 max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Empowering smarter deliveries with cutting-edge logistics technology. 
                Your trusted partner for seamless transportation solutions.
              </p>
              
              {/* Social Media Links */}
              <div className="flex justify-center space-x-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${social.color}`}
                    title={social.name}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>

              {/* GitHub Link */}
              <a
                href="https://github.com/sailaja-adapa/Vipreshana"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Github size={18} />
                View on GitHub
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Copyright */}
            <div className={`pt-6 border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                © 2024 Vipreshana. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};


export default Contact;
