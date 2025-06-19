'use client';
import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Clock, Github, Linkedin, Twitter, Instagram, Facebook, ExternalLink } from 'lucide-react';

import Navbar from './components/Navbar';
import { useTheme } from './context/ThemeContext';

import LocationMap from './components/LocationMap';


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

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
         
          <div className={`shadow-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 ${
            isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 text-center ${
              isDark ? 'text-blue-400' : 'text-gray-900'
            }`}>Quick Message</h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <textarea
                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[80px] bg-transparent text-base"
                placeholder="Type your message..."
                rows={4}
              />
              <button 
                type="submit" 
                className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transform transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>

          </div>

          <div
  className={`shadow-2xl rounded-2xl p-6 md:p-8 transform transition-transform duration-300 hover:scale-105 ${
    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
  }`}
>
  <h2
    className={`text-2xl font-bold text-center mb-6 tracking-wide ${
      isDark ? 'text-blue-400' : 'text-gray-800'
    }`}
  >
     Contact Info
  </h2>

  <div className={`space-y-4 text-base ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
    {/* Address */}
    <div className="flex items-center gap-3 hover:translate-x-1 transition-all duration-200">
      <MapPin className="text-pink-800" size={30} />
      <span>Bhimavaram, West Godavari District, Andhra Pradesh</span>
    </div>


    {/* Email */}
    <div className="flex items-center gap-3 hover:translate-x-1 transition-all duration-200">
      <Mail className="text-indigo-800" size={22} />
      <a href="mailto:adapasailaja17@gmail.com" className=" hover:text-indigo-400">
        adapasailaja17@gmail.com
      </a>
    </div>

    {/* Phone */}
    <div className="flex items-center gap-3 hover:translate-x-1  transition-all duration-200">
      <Phone className="text-fuchsia-800" size={22} />
      <a href="tel:+911234567890" className="hover:text-fuchsia-400 ">
        +911234567890
      </a>
    </div>

    {/* Business Status */}
    <div
      className={`flex items-center gap-3 font-semibold  transition-all duration-200 ${
        isOpen ? 'text-green-500' : 'text-red-500'
      }`}
    >
      <Clock size={22}  />
      <span>{isOpen ? ' We are Open Now!' : ' Currently Closed'}</span>
    </div>

    {/* Working Hours */}
    <p className={`text-sm pl-7 ml-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
       Mon – Fri: 9:00 AM – 6:00 PM
    </p>
  </div>
</div>
<div
  className={`shadow-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 flex flex-col justify-center ${
    isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
  }`}
  style={{ minHeight: '250px' }} // Set height for vertical centering
>
  <h2
    className={`text-2xl font-bold mb-6 text-center ${
      isDark ? 'text-blue-400' : 'text-gray-900'
    }`}
  >
    Connect With Us
  </h2>

  <div className="flex flex-1 items-center justify-center">
  <div className="flex gap-5">
    {socialLinks.map((social) => (
      <a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        title={social.name}
        className={`flex items-center justify-center w-12 mb-5 h-12 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isDark
            ? 'bg-gray-700 text-white hover:bg-gray-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <social.icon size={35} />
      </a>
    ))}
  </div>
</div>
</div>
        </div>

        {/* Map Section */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className={`shadow-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 ${
            isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <h3 className={`text-2xl font-bold mb-4 text-center ${
              isDark ? 'text-blue-400' : 'text-gray-900'
            }`}>Office Location</h3>
            <div className={`h-80 w-full rounded-lg overflow-hidden border relative z-10 ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <LocationMap />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};


export default Contact;
