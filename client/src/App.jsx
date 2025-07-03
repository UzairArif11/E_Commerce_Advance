import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import { toast } from "react-hot-toast";
import { addNotification } from "./redux/slices/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import axiosInstance from "./utils/axiosInstance";

// Lazy-loaded Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const VerifyPage = lazy(() => import("./pages/VerifyPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const PlaceOrderPage = lazy(() => import("./pages/PlaceOrderPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AdminAddProductPage = lazy(() => import("./pages/AdminAddProductPage"));
const AdminEditProductPage = lazy(() => import("./pages/AdminEditProductPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const AdminSettingsPage = lazy(() => import("./pages/AdminSettingsPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const AdminBroadcastPage = lazy(() => import("./pages/AdminBroadcastPage"));
const UserSettingsPage = lazy(() => import("./pages/UserSettingsPage"));
const AdminNotificationsPage = lazy(() => import("./pages/AdminNotificationsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));

function SocketHandler({ userInfo }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((error) => {
      console.warn("Notification sound not played:", error.message);
    });
  };

  const sendBrowserNotification = (title, body) => {
    if (
      userInfo?.wantsPushNotifications &&
      Notification.permission === "granted"
    ) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: "/vite.svg",
        });
      });
    }
  };

  useEffect(() => {
    if (!userInfo) return;

    const socket = io(import.meta.env.VITE_APP_SOCKET_URL, {
      auth: { token: userInfo.token },
    });

    socket.on("user_shipped", (data) => {
      playNotificationSound();
      sendBrowserNotification("New Announcement", data.message);
      toast.success(data.message);
      dispatch(addNotification({ message: data.message, read: false }));
    });

    socket.on("user_cancelled", (data) => {
      playNotificationSound();
      sendBrowserNotification("New Announcement", data.message);
      toast.success(data.message);
      dispatch(addNotification({ message: data.message, read: false }));
    });

    socket.on("user_delivered", (data) => {
      playNotificationSound();
      sendBrowserNotification("New Announcement", data.message);
      toast.success(data.message);
      dispatch(addNotification({ message: data.message, type: "delivered", read: false }));
    });

    socket.on("admin_orderPlaced", (data) => {
      playNotificationSound();
      sendBrowserNotification("New Announcement", data.message);
      toast.success(data.message);
      dispatch(addNotification({ type: "placed", ...data, read: false }));
    });

    socket.on("admin_orderShipped", (data) => {
      playNotificationSound();
      sendBrowserNotification("New Announcement", data.message);
      toast.success(data.message);
      dispatch(addNotification({ type: "shipped", ...data, read: false }));
    });

    socket.on("admin_orderCancelled", (data) => {
      playNotificationSound();
      sendBrowserNotification("New Announcement", data.message);
      toast.success(data.message);
      dispatch(addNotification({ type: "cancelled", ...data, read: false }));
    });

    socket.on("user_broadcast", (data) => {
      playNotificationSound();
      sendBrowserNotification("New Announcement", data.message);
      toast.success(`Announcement: ${data.message}`);
      dispatch(addNotification({ message: data.message, read: false }));
    });

    socket.on("user_strip", (data) => {
      playNotificationSound();
      toast.success("Payment Successful! 🎉 Order placed.");
      navigate("/orders");
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo]);

  return null;
}

function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if ("Notification" in window && Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        console.log("Notification permission status:", permission);
      }
    };
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const fetchNotificationsFromDB = async () => {
      try {
        const { data } = await axiosInstance.get("/notifications");
        data?.notifications.forEach((n) =>
          dispatch(addNotification({ _id: n._id, message: n.message, read: n.read }))
        );
      } catch (error) {
        console.error("Failed to load notifications:", error.message);
      }
    };

    if (userInfo) {
      fetchNotificationsFromDB();
    }
  }, [userInfo]);

  return (
    <ErrorBoundary>
      <Router>
        <SocketHandler userInfo={userInfo} />
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
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/settings" element={<PrivateRoute><UserSettingsPage /></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
              <Route path="/placeorder" element={<PrivateRoute><PlaceOrderPage /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
              <Route path="/admin/products/create" element={<AdminRoute><AdminAddProductPage /></AdminRoute>} />
              <Route path="/admin/broadcast" element={<AdminRoute><AdminBroadcastPage /></AdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminEditProductPage /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
              <Route path="/admin/setting" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
               <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfilePage />
                  </PrivateRoute>
                }
              />
              <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
              <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><AdminNotificationsPage /></AdminRoute>} />
              <Route path="*" element={<div className="flex justify-center items-center h-screen"><h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1></div>} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
