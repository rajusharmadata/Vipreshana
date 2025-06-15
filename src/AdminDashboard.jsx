import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaCar, FaBus, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useTheme } from './context/ThemeContext'; // Adjust the import path as necessary

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [statusData, setStatusData] = useState({
    labels: ['Picked Goods', 'En route to pickup'],
    datasets: [
      {
        label: 'Booking Status',
        data: [0, 0],
        backgroundColor: ['#4CAF50', '#FF9800'],
        hoverBackgroundColor: ['#388E3C', '#F57C00'],
      },
    ],
  });
  const [vehicleBreakdown, setVehicleBreakdown] = useState({
    van: 0,
    bus: 0,
    car: 0,
  });

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://vipreshana-3.onrender.com/api/details');
      const usersData = response.data;

      setUsers(usersData);

      const vehicleCount = { van: 0, bus: 0, car: 0 };
      let pickedGoodsCount = 0;
      let enRouteCount = 0;

      usersData.forEach(user => {
        if (user.vehicleType === 'Van') vehicleCount.van += 1;
        if (user.vehicleType === 'Bus') vehicleCount.bus += 1;
        if (user.vehicleType === 'Car') vehicleCount.car += 1;

        if (user.status === 'Picked Goods') pickedGoodsCount += 1;
        if (user.status === 'En route to pickup') enRouteCount += 1;
      });

      setVehicleBreakdown(vehicleCount);

      console.log("Picked Goods:", pickedGoodsCount);
      console.log("En route to pickup:", enRouteCount);

      setStatusData({
        labels: ['Picked Goods', 'En route to pickup'],
        datasets: [
          {
            label: 'Booking Status',
            data: [pickedGoodsCount, enRouteCount],
            backgroundColor: ['#4CAF50', '#FF9800'],
            hoverBackgroundColor: ['#388E3C', '#F57C00'],
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const vehicleStatusData = {
    labels: ['Van', 'Bus', 'Car'],
    datasets: [
      {
        label: 'Vehicle Type Breakdown',
        data: [vehicleBreakdown.van, vehicleBreakdown.bus, vehicleBreakdown.car],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
        hoverBackgroundColor: ['#388E3C', '#F57C00', '#1976D2'],
      },
    ],
  };

  return (
    <div
      className={`p-4 min-h-screen bg-cover bg-center transition-all duration-300 ${
        isDark ? 'brightness-75' : 'brightness-100'
      }`}
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-vector/graph-chart-with-moving-up-arrow-stock-market-financial-investment-diagram-blue-background_56104-1814.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full z-10 transition-all duration-300 ${
          isDark 
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
            : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
        }`}
        aria-label="Toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className={`backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-5xl mx-auto transition-all duration-300 ${
        isDark ? 'bg-gray-800 bg-opacity-90 text-white' : 'bg-white bg-opacity-70 text-gray-800'
      }`}>
        <h1 className={`text-3xl font-bold text-center mb-8 transition-colors duration-300 ${
          isDark ? 'text-blue-400' : 'text-gray-800'
        }`}>Admin Dashboard</h1>

        {/* Users Table */}
        <div className={`mt-6 p-4 rounded-lg shadow-md transition-all duration-300 ${
          isDark ? 'bg-gray-700 bg-opacity-90' : 'bg-white bg-opacity-90'
        }`}>
          <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>Users</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className={`transition-colors duration-300 ${
                isDark ? 'bg-gray-600' : 'bg-gray-100'
              }`}>
                <th className={`border px-4 py-2 transition-colors duration-300 ${
                  isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-700'
                }`}></th>
                <th className={`border px-4 py-2 transition-colors duration-300 ${
                  isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-700'
                }`}>👤 Name</th>
                <th className={`border px-4 py-2 transition-colors duration-300 ${
                  isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-700'
                }`}>📞 Phone</th>
                <th className={`border px-4 py-2 transition-colors duration-300 ${
                  isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-700'
                }`}>🚗 Vehicle Type</th>
                <th className={`border px-4 py-2 transition-colors duration-300 ${
                  isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-700'
                }`}>✅ Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className={`transition-colors duration-300 ${
                  isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
                }`}>
                  <td className={`border px-4 py-2 text-center transition-colors duration-300 ${
                    isDark ? 'border-gray-500' : 'border-gray-300'
                  }`}>
                    {user.status === 'Picked Goods' ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaClock className="text-orange-600" />
                    )}
                  </td>
                  <td className={`border px-4 py-2 transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-800'
                  }`}>{user.name}</td>
                  <td className={`border px-4 py-2 transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-800'
                  }`}>{user.phone}</td>
                  <td className={`border px-4 py-2 transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-800'
                  }`}>{user.vehicleType}</td>
                  <td className={`border px-4 py-2 transition-colors duration-300 ${
                    isDark ? 'border-gray-500 text-gray-200' : 'border-gray-300 text-gray-800'
                  }`}>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Booking Status Breakdown - Pie Chart */}
        <div className="mt-8">
          <h2 className={`text-xl font-semibold mb-4 text-center transition-colors duration-300 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>User Booking Status Breakdown</h2>
          <div className="w-1/2 mx-auto">
            <Pie data={statusData} />
          </div>
          <ul className="flex justify-center space-x-6 mt-4">
            <li className={`flex items-center transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <FaCheckCircle className="text-lg text-green-600 mr-2" />
              <span>Picked Goods: {statusData.datasets[0].data[0]}</span>
            </li>
            <li className={`flex items-center transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              <FaClock className="text-lg text-orange-600 mr-2" />
              <span>En route to pickup: {statusData.datasets[0].data[1]}</span>
            </li>
          </ul>
        </div>

        {/* Vehicle Breakdown */}
        <div className={`mt-8 p-4 rounded-lg shadow-md transition-all duration-300 ${
          isDark ? 'bg-gray-700 bg-opacity-90' : 'bg-white bg-opacity-90'
        }`}>
          <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>Vehicle Breakdown</h2>
          <ul className={`flex items-center space-x-4 justify-center transition-colors duration-300 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>
            <li className="flex items-center">
              <FaTruck className="text-lg mr-2" />
              <span>Van: {vehicleBreakdown.van}</span>
            </li>
            <li className="flex items-center">
              <FaBus className="text-lg mr-2" />
              <span>Bus: {vehicleBreakdown.bus}</span>
            </li>
            <li className="flex items-center">
              <FaCar className="text-lg mr-2" />
              <span>Car: {vehicleBreakdown.car}</span>
            </li>
          </ul>
        </div>

        {/* Vehicle Type Breakdown - Pie Chart */}
        <div className="mt-8">
          <h2 className={`text-xl font-semibold mb-4 text-center transition-colors duration-300 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>Vehicle Type Breakdown</h2>
          <div className="w-1/2 mx-auto">
            <Pie data={vehicleStatusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;