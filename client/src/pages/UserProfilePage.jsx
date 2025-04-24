// src/pages/UserProfilePage.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import { addNotification } from '../redux/slices/notificationSlice';

const UserProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchUserOrders = async () => {
    try {
      const { data } = await axiosInstance.get(`/orders/user/${userInfo?.user?._id}`);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching user orders:", error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.put(`/users/${userInfo?.user?._id}`, {
        name,
        email,
        password: password ? password : undefined,
      });

      alert("Profile updated successfully!");

      // 🔄 Update Redux  
      dispatch(
        loginSuccess({
          userInfo: data.user, // assuming your controller returns { user }
          token: userInfo.token, // keep existing token
        })
      );

      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile.");
    }
  };
 


  useEffect(() => {
    if (userInfo?.user?.name&&userInfo?.user?.email) {
      setName(userInfo?.user?.name || "");
      setEmail(userInfo?.user?.email || "");
    }
  }, [userInfo?.user]);
  useEffect(() => {
    if (userInfo?.user?._id) {
      fetchUserOrders();
    }
  }, [userInfo?.user?._id]);
  
  if (!userInfo?.user || (!name && !email)) {
    return <div className="text-center mt-20">Loading profile...</div>;
  }
  
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        My Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Form */}
        <form
          onSubmit={handleUpdateProfile}
          className="bg-white p-8 shadow rounded-lg space-y-6"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Update Profile
          </h2>

          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
  <label className="block text-gray-700 mb-2">Password (optional)</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="New password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:border-blue-500"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-2.5 text-sm text-blue-600 hover:underline focus:outline-none"
    >
      {showPassword ? "Hide" : "View"}
    </button>
  </div>
</div>


          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition text-lg"
          >
            Update Profile
          </button>
        </form>

        {/* Past Orders */}
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            My Orders
          </h2>

          {loadingOrders ? (
            <div className="text-center py-10">Loading Orders...</div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border-b pb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Order ID: {order._id.slice(0, 8)}...</span>
                    <span>Total: ${order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()} | Status:{" "}
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
