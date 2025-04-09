// src/pages/AdminDashboard.jsx

import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Admin Dashboard
      </h1>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Stat Cards */}
        <div className="bg-white shadow p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold">{stats.userCount}</h2>
          <p className="text-gray-600 mt-2">Users</p>
        </div>

        <div className="bg-white shadow p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold">{stats.productCount}</h2>
          <p className="text-gray-600 mt-2">Products</p>
        </div>

        <div className="bg-white shadow p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold">{stats.orderCount}</h2>
          <p className="text-gray-600 mt-2">Orders</p>
        </div>

        <div className="bg-white shadow p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold">
            ${stats.totalSales?.toFixed(2) ?? '0.00'}
          </h2>
          <p className="text-gray-600 mt-2">Total Sales</p>
        </div>
      </div>

      {/* Management Links */}
      <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3 text-center">
        <Link
          to="/admin/products"
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg transition text-xl font-semibold"
        >
          Manage Products
        </Link>

        <Link
          to="/admin/orders"
          className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg transition text-xl font-semibold"
        >
          Manage Orders
        </Link>

        <Link
          to="/admin/users"
          className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg transition text-xl font-semibold"
        >
          Manage Users
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
