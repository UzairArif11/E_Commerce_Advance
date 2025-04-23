// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
import Layout from "./components/Layout";
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PlaceOrderPage = lazy(() => import('./pages/PlaceOrderPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminAddProductPage = lazy(() => import('./pages/AdminAddProductPage'));
const AdminEditProductPage = lazy(() => import('./pages/AdminEditProductPage'));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense fallback={
            <div className="flex justify-center items-center h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
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

        </Routes>
        </Suspense>
      </Layout>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
