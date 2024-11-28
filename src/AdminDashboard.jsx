import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaCar, FaBus, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';

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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/details'); // Adjusted API endpoint for fetching bookings
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
      className="p-4 min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://img.freepik.com/free-vector/graph-chart-with-moving-up-arrow-stock-market-financial-investment-diagram-blue-background_56104-1814.jpg?size=626&ext=jpg&ga=GA1.1.1861036275.1716800359&semt=ais_hybrid-rr-similar)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="backdrop-blur-sm bg-white bg-opacity-70 p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Users Table */}
        <div className="mt-6 bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Users</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2"></th>
                <th className="border border-gray-300 px-4 py-2">👤 Name</th>
                <th className="border border-gray-300 px-4 py-2">📞 Phone</th>
                <th className="border border-gray-300 px-4 py-2">🚗 Vehicle Type</th>
                <th className="border border-gray-300 px-4 py-2">✅ Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {user.status === 'Picked Goods' ? (
                      <FaCheckCircle className="text-green-600" />
                    ) : (
                      <FaClock className="text-orange-600" />
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.phone}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.vehicleType}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Booking Status Breakdown - Pie Chart */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">User Booking Status Breakdown</h2>
          <div className="w-1/2 mx-auto">
            <Pie data={statusData} />
          </div>
          <ul className="flex justify-center space-x-6 mt-4">
            <li className="flex items-center">
              <FaCheckCircle className="text-lg text-green-600 mr-2" />
              <span>Picked Goods: {statusData.datasets[0].data[0]}</span>
            </li>
            <li className="flex items-center">
              <FaClock className="text-lg text-orange-600 mr-2" />
              <span>En route to pickup: {statusData.datasets[0].data[1]}</span>
            </li>
          </ul>
        </div>

        {/* Vehicle Breakdown */}
        <div className="mt-8 bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Vehicle Breakdown</h2>
          <ul className="flex items-center space-x-4 justify-center">
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
          <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">Vehicle Type Breakdown</h2>
          <div className="w-1/2 mx-auto">
            <Pie data={vehicleStatusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
