// src/pages/OrdersPage.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
 
        const { data } = await axiosInstance.get(`/orders/user/${userInfo?.user?._id}`);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-xl font-semibold">Loading Orders...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No orders found.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Order ID: {order._id}</h2>
              <div className="space-y-2">
                {order.products.map((item, index) => (
                  <div key={index} className="flex justify-between text-gray-600">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="text-right font-bold text-gray-800 mt-4">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Status: {order.status} | Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
