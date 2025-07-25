import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShippingAddress, setPaymentMethod } from '../redux/slices/checkoutSlice';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../utils/axiosInstance";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress, paymentMethod } = useSelector((state) => state.checkout);

  const [address, setAddress] = useState(shippingAddress || '');
  const [payment, setPayment] = useState(paymentMethod || '');
  const [errors, setErrors] = useState({});

  // Payment method availability
  const [paymentMethods, setPaymentMethods] = useState({
    codEnabled: false,
    jazzCashEnabled: false,
    easypaisaEnabled: false,
    cardEnabled: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get('/settings');
        setPaymentMethods({
          codEnabled: data.codEnabled,
          jazzCashEnabled: data.jazzCashEnabled,
          easypaisaEnabled: data.easypaisaEnabled,
          cardEnabled: data.cardEnabled,
        });
      } catch (error) {
        console.error('Failed to load payment settings:', error.message);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!address.trim()) {
      validationErrors.address = 'Shipping address is required.';
    }

    if (!payment) {
      validationErrors.payment = 'Please select a payment method.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(setShippingAddress(address));
    dispatch(setPaymentMethod(payment));
    navigate('/placeorder');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Checkout</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-md"
      >
        {/* Shipping Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Shipping Address</label>
          <input
            type="text"
            placeholder="Enter your shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-gray-700 font-medium mb-4">Payment Method</label>
          <div className="flex flex-col gap-4">
            {paymentMethods.cardEnabled && (
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Stripe"
                  checked={payment === 'Stripe'}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Card
              </label>
            )}

            {paymentMethods.jazzCashEnabled && (
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="JazzCash"
                  checked={payment === 'JazzCash'}
                  onChange={(e) => setPayment(e.target.value)}
                />
                JazzCash
              </label>
            )}

            {paymentMethods.easypaisaEnabled && (
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="EasyPaisa"
                  checked={payment === 'EasyPaisa'}
                  onChange={(e) => setPayment(e.target.value)}
                />
                EasyPaisa
              </label>
            )}

            {paymentMethods.codEnabled && (
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CashOnDelivery"
                  checked={payment === 'CashOnDelivery'}
                  onChange={(e) => setPayment(e.target.value)}
                />
                Cash On Delivery (+Rs 100 Extra)
              </label>
            )}

            {errors.payment && (
              <p className="text-red-500 text-sm mt-1">{errors.payment}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
