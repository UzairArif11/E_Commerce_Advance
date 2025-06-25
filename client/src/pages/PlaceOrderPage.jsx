// src/pages/PlaceOrderPage.jsx

import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

  
const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY)

const PlaceOrderForm = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod } = useSelector((state) => state.checkout);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
     
    if (!stripe || !elements) return;
  
    setLoading(true);
  
    try {
      // 1. Create a payment intent from backend
      const {
        data: { paymentIntent },
      } = await axiosInstance.post('/payments/stripe', {
        amount: totalAmount * 100, // Stripe expects amount in cents
        currency: 'usd',
        cartItems
      });
  
      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      if (result.error) {
        console.error('Payment failed', result.error.message);
  
        toast.error(`Payment Failed: ${result.error.message}`);
        setLoading(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. After successful payment, save order to backend
          await axiosInstance.post('/orders', {
            products: cartItems.map((item) => ({
              product: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress,
            totalAmount,
          });
          toast.success('Payment Successful! 🎉 Order placed.');
 
          navigate('/orders');
        }
      }
    } catch (error) {
      console.error('Payment error:', error.message);
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handlePlaceOrder} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Order</h2>

      {/* Shipping Address */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Shipping Address:</h3>
        <p>{shippingAddress}</p>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-2">Payment Method:</h3>
        <p>{paymentMethod}</p>
      </div>

      {/* Cart Items */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-4">Cart Items:</h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="text-right text-xl font-bold text-blue-600">
        Total: ${totalAmount.toFixed(2)}
      </div>

      {/* Stripe Payment */}
      {paymentMethod === 'Stripe' && (
        <div className="p-4 bg-white rounded-lg shadow">
          <CardElement className="p-2 border border-gray-300 rounded" />
        </div>
      )}

      {/* Place Order Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition text-lg"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};

const PlaceOrderPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Elements stripe={stripePromise}>
        <PlaceOrderForm />
      </Elements>
    </div>
  );
};

export default PlaceOrderPage;
