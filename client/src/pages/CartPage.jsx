// src/pages/CartPage.jsx

import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from '../redux/slices/cartSlice';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-6">Your Cart is Empty</h2>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Your Cart
      </h1>

      <div className="flex flex-col gap-6">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between bg-white shadow p-4 rounded-lg"
          >
            {/* Product Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(decreaseQuantity(item.productId))}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
              >
                -
              </button>
              <span className="text-lg font-medium">{item.quantity}</span>
              <button
                onClick={() => dispatch(increaseQuantity(item.productId))}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => dispatch(removeFromCart(item.productId))}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-10 text-right">
        <h2 className="text-2xl font-bold text-gray-800">
          Total: ${totalAmount.toFixed(2)}
        </h2>
        <Link
          to="/checkout"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
