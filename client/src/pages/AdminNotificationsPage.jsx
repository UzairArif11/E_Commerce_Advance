// src/pages/AdminNotificationsPage.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { CircularProgress } from '@mui/material';

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/orders');

      const mapped = data.map((order) => ({
        id: order._id,
        user: order.user?.name || 'Guest',
        status: order.status,
        date: new Date(order.createdAt).toLocaleString(),
      }));

      setNotifications(mapped.reverse());
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        <CircularProgress />
        <p className="mt-4">Loading Notifications...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Admin Notifications
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white shadow-md rounded-lg p-6 border"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">
                {notification.user}
              </h2>
              <span
                className={`text-sm px-3 py-1 rounded-full font-medium ${
                  statusColors[notification.status] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {notification.status.charAt(0).toUpperCase() +
                  notification.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-500">Order ID: {notification.id.slice(0, 8)}...</p>
            <p className="text-sm text-gray-500 mt-1">Placed on: {notification.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
