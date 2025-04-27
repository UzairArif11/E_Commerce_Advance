// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React, { Suspense, lazy, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
import Layout from "./components/Layout";
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PlaceOrderPage = lazy(() => import("./pages/PlaceOrderPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AdminAddProductPage = lazy(() => import("./pages/AdminAddProductPage"));
const AdminEditProductPage = lazy(() => import("./pages/AdminEditProductPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const AdminNotificationsPage = lazy(() =>
  import("./pages/AdminNotificationsPage")
);
const NotificationsPage = lazy(() =>
  import("./pages/NotificationsPage")
);
import { toast } from 'react-hot-toast';
import { addNotification } from './redux/slices/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import axiosInstance from './utils/axiosInstance';



function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch((error) => {
      console.warn('Notification sound not played:', error.message);
    });
  };
  useEffect(() => {
    const fetchNotificationsFromDB = async () => {
      try {
        const { data } = await axiosInstance.get('/notifications');
        data.forEach((n) => {
          dispatch(addNotification({_id:n._id, message: n.message, read: n.read }));
        });
      } catch (error) {
        console.error('Failed to load notifications:', error.message);
      }
    };
  
    if (userInfo) {
      fetchNotificationsFromDB();
    }
  }, [userInfo]);
  useEffect(() => {
    if (!userInfo) return;
   // App.js or wherever you're connecting
const socket = io('http://localhost:5000', {
  auth: {
    token: userInfo?.token,
  },
});

    // Listen to real-time events
   
    socket.on(`user_shipped`, (data) => {
      playNotificationSound();
      toast.success(data.message);
      dispatch(addNotification({ message: data.message, read: false }));
    });
  
   
    socket.on(`user_cancelled`, (data) => {
      playNotificationSound();
      toast.success(data.message);
      dispatch(addNotification({ message: data.message, read: false }));
    });
  
   
    socket.on(`user_delivered`, (data) => {
      playNotificationSound();
      toast.success(data.message);
      dispatch(addNotification({ message: data.message, read: false }));
    });
  
   
    socket.on('admin_orderPlaced', (data) => {
      // setNotifications((prev) => [{ type: 'placed', ...data }, ...prev]);
      dispatch(addNotification({type: 'placed', ...data, read: false }));
       toast.success(data.message);
    });

   
    socket.on('admin_orderShipped', (data) => {
      playNotificationSound();
      // setNotifications((prev) => [{ type: 'shipped', ...data }, ...prev]);
       toast.success(data.message);
       dispatch(addNotification({  type: 'shipped', ...data, read: false }));
    });

   
    socket.on('admin_orderCancelled', (data) => {
      playNotificationSound();
      // setNotifications((prev) => [{ type: 'cancelled', ...data }, ...prev]);
       toast.success(data.message);
       dispatch(addNotification({ type: 'cancelled', ...data , read: false }));
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo]);
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/placeorder"
                element={
                  <PrivateRoute>
                    <PlaceOrderPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <OrdersPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProductsPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/products/create"
                element={
                  <AdminRoute>
                    <AdminAddProductPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/products/edit/:id"
                element={
                  <AdminRoute>
                    <AdminEditProductPage />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    {" "}
                    <AdminOrdersPage />{" "}
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    {" "}
                    <AdminUsersPage />{" "}
                  </AdminRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <div className="flex justify-center items-center h-screen">
                    <h1 className="text-4xl font-bold text-gray-800">
                      404 - Page Not Found
                    </h1>
                  </div>
                }
              />

              <Route
                path="/wishlist"
                element={
                  <PrivateRoute>
                    <WishlistPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <AdminRoute>
                    {" "}
                    <AdminNotificationsPage />{" "}
                  </AdminRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    {" "}
                    <NotificationsPage />{" "}
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
