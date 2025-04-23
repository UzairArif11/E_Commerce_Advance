// src/pages/OrdersPage.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Stepper, Step, StepLabel } from '@mui/material';
import { toast } from 'react-hot-toast';

const OrdersPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const steps = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const getActiveStep = (status) => {
    if (status === 'pending') return 0;
    if (status === 'shipped') return 1;
    if (status === 'delivered') return 2;
    if (status === 'cancelled') return 3;
    return 0;
  };
  
  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axiosInstance.put(`/orders/${orderId}/cancel`);
        toast.success('Order cancelled successfully!');
        window.location.reload(); // Refresh to show updated status
      } catch (error) {
        console.error('Cancel error:', error.message);
        toast.error('Failed to cancel order.');
      }
    }
  };
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
  <h2 className="text-xl font-bold text-gray-700 mb-4">
    Order ID: {order._id.slice(0, 8)}...
  </h2>

  <div className="space-y-2 mb-6">
    {order.products.map((item, index) => (
      <div key={index} className="flex justify-between text-gray-600">
        <span>
          {item.product.name} x {item.quantity}
        </span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))}
  </div>

  <div className="text-right font-bold text-gray-800 mb-6">
    Total: ${order.totalAmount.toFixed(2)}
  </div>

  {/* Order Tracking Stepper */}
  <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
    {steps.map((label) => (
      <Step key={label}>
        <StepLabel>{label}</StepLabel>
      </Step>
    ))}
  </Stepper>
 
  <div className="text-sm text-gray-500 mt-4">
    Placed on: {new Date(order.createdAt).toLocaleDateString()}
  </div>
  {order.status === 'pending' && (
        <div className="flex justify-end mt-6">
          <button  onClick={() => cancelOrder(order._id)} className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition" >
             Cancel Order 
             </button> 
             </div>
             )}

</div>

          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
