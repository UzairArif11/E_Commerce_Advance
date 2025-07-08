import axios from 'axios';
import { API_BASE_URL } from '../config/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove from storage
      await AsyncStorage.removeItem('authToken');
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
};

// Products API functions
export const productsAPI = {
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },
  
  searchProducts: async (query, filters = {}) => {
    const response = await api.get('/products/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },
  
  getProductsByCategory: async (category) => {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  },
  
  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },
};

// Cart API functions
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/users/cart');
    return response.data;
  },
  
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/users/cart/add', { productId, quantity });
    return response.data;
  },
  
  updateCartItem: async (productId, quantity) => {
    const response = await api.put('/users/cart/update', { productId, quantity });
    return response.data;
  },
  
  removeFromCart: async (productId) => {
    const response = await api.delete(`/users/cart/remove/${productId}`);
    return response.data;
  },
  
  clearCart: async () => {
    const response = await api.delete('/users/cart/clear');
    return response.data;
  },
};

// Wishlist API functions
export const wishlistAPI = {
  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  },
  
  addToWishlist: async (productId) => {
    const response = await api.post('/users/wishlist/add', { productId });
    return response.data;
  },
  
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/users/wishlist/remove/${productId}`);
    return response.data;
  },
  
  clearWishlist: async () => {
    const response = await api.delete('/users/wishlist/clear');
    return response.data;
  },
};

// Orders API functions
export const ordersAPI = {
  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
  
  cancelOrder: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};

// Payment API functions
export const paymentAPI = {
  createPaymentIntent: async (amount, currency = 'usd') => {
    const response = await api.post('/payments/create-intent', { amount, currency });
    return response.data;
  },
  
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    const response = await api.post('/payments/confirm', {
      paymentIntentId,
      paymentMethodId
    });
    return response.data;
  },
  
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },
  
  addPaymentMethod: async (paymentMethodData) => {
    const response = await api.post('/payments/methods', paymentMethodData);
    return response.data;
  },
  
  removePaymentMethod: async (paymentMethodId) => {
    const response = await api.delete(`/payments/methods/${paymentMethodId}`);
    return response.data;
  },
};

// Categories API functions
export const categoriesAPI = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  getCategory: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },
};

// Reviews API functions
export const reviewsAPI = {
  getProductReviews: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },
  
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },
  
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },
  
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};

// Address API functions
export const addressAPI = {
  getAddresses: async () => {
    const response = await api.get('/users/addresses');
    return response.data;
  },
  
  addAddress: async (addressData) => {
    const response = await api.post('/users/addresses', addressData);
    return response.data;
  },
  
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/users/addresses/${addressId}`, addressData);
    return response.data;
  },
  
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response.data;
  },
  
  setDefaultAddress: async (addressId) => {
    const response = await api.put(`/users/addresses/${addressId}/default`);
    return response.data;
  },
};

// Notifications API functions
export const notificationsAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },
  
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};

// Export the main api instance for custom requests
export default api;
