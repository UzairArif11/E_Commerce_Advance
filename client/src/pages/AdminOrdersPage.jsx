// src/pages/AdminOrdersPage.jsx

import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/orders'); // Admin endpoint
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status });
      alert('Order status updated!');
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error.message);
      alert('Failed to update status.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Manage Orders
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="py-3 px-6">{order._id.slice(0, 8)}...</td>
                <td className="py-3 px-6">{order.user?.name || 'Unknown'}</td>
                <td className="py-3 px-6">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="py-3 px-6 capitalize">{order.status}</td>

                <td className="py-3 px-6 capitalize">
  <select
    value={order.status}
    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
    className="border border-gray-300 rounded px-2 py-1"
  >
    {['pending', 'shipped', 'delivered', 'cancelled'].map((status) => (
      <option key={status} value={status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </option>
    ))}
  </select>
</td>

                {/* <td className="py-3 px-6 space-x-2">
                  {order.status !== 'shipped' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(order._id, 'shipped')
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Mark Shipped
                    </button>
                  )}
                  {order.status !== 'delivered' && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(order._id, 'delivered')
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
