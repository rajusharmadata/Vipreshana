import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Mail, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import PageMeta from '../components/Pagemeta';

const UserProfile = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });


  // Load user data
  useEffect(() => {
    const loadUserData = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          setUser(parsedData);
          setFormData({
            name: parsedData.name,
            email: parsedData.email,
            phone: parsedData.phone,
          });
        } catch (err) {
          console.error('Error parsing user data:', err);
          toast.error('Failed to load user data');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    loadUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user data
    const updatedUser = {
      ...user,
      ...formData
    };
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // Here you would make an API call to change the password
    setTimeout(() => {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast.success('Password changed successfully!');
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setEditMode(false);
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <PageMeta title={`${user.name}'s Profile`} />
      <Navbar />
      <div className={`min-h-screen pt-24 pb-12 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <ToastContainer position="top-right" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Profile Card */}
            <div className="w-full md:w-1/3">
              <div className={`rounded-2xl shadow-xl border-2 p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex flex-col items-center">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-4
                    ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-center">{user.name}</h2>
                  <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.role}</p>
                  
                  <div className="mt-6 w-full space-y-3">
                    <div className={`flex items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Mail className="w-5 h-5 mr-3" />
                      <span>{user.email}</span>
                    </div>
                    <div className={`flex items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Phone className="w-5 h-5 mr-3" />
                      <span>{user.phone}</span>
                    </div>
                  </div>
                  
                 
                </div>
              </div>
            </div>

            {/* Right Side - Profile Form */}
            <div className="w-full md:w-2/3">
              <div className={`rounded-2xl shadow-xl border-2 p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Information</h2>
                 
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none
                          ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full pl-10 p-2.5 rounded-lg border text-sm
                            ${isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'}`}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none
                          ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full pl-10 p-2.5 rounded-lg border text-sm
                            ${isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'}`}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none
                          ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Phone className="w-5 h-5" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full pl-10 p-2.5 rounded-lg border text-sm
                            ${isDark 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400 focus:border-yellow-400' 
                              : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'}`}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;