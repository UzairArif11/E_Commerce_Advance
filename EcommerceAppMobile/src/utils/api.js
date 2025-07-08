import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from './toast';
import { API_BASE_URL } from '../config/environment';

// Base API configuration from environment
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      // Navigate to login screen - you can implement this with navigation ref
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const getUserProfile = () => apiClient.get('/auth/profile');
export const updateUserProfile = (userData) => apiClient.put('/auth/profile', userData);

// Product APIs
export const getProducts = () => apiClient.get('/products');
export const getProduct = (id) => apiClient.get(`/products/${id}`);
export const searchProducts = (query) => apiClient.get(`/products/search?q=${query}`);
export const getProductsByCategory = (category) => apiClient.get(`/products/category/${category}`);
export const getFeaturedProducts = () => apiClient.get('/products/featured');

// Category APIs
export const getCategories = () => apiClient.get('/categories');

// Cart APIs
export const getCart = () => apiClient.get('/cart');
export const addToCart = (productId, quantity) => 
  apiClient.post('/cart/add', { productId, quantity });
export const updateCartItem = (itemId, quantity) => 
  apiClient.put(`/cart/items/${itemId}`, { quantity });
export const removeFromCart = (itemId) => 
  apiClient.delete(`/cart/items/${itemId}`);
export const clearCart = () => apiClient.delete('/cart');

// Wishlist APIs
export const getWishlist = () => apiClient.get('/wishlist');
export const addToWishlist = (productId) => apiClient.post('/wishlist/add', { productId });
export const removeFromWishlist = (productId) => apiClient.delete(`/wishlist/remove/${productId}`);

// Order APIs
export const createOrder = (orderData) => apiClient.post('/orders', orderData);
export const getOrders = () => apiClient.get('/orders');
export const getOrder = (id) => apiClient.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => apiClient.put(`/orders/${id}/status`, { status });

// Mock data for development (remove when connecting to real backend)
export const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    reviewCount: 128,
    countInStock: 15,
    discount: 20
  },
  {
    _id: '2',
    name: 'Smart Watch',
    description: 'Advanced smartwatch with health tracking features',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Electronics',
    rating: 4.3,
    reviewCount: 89,
    countInStock: 8,
    discount: 15
  },
  {
    _id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily workouts',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Sports',
    rating: 4.7,
    reviewCount: 203,
    countInStock: 25,
    discount: 10
  },
  {
    _id: '4',
    name: 'Coffee Maker',
    description: 'Premium coffee maker for perfect morning brew',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
    category: 'Home',
    rating: 4.2,
    reviewCount: 156,
    countInStock: 12,
    discount: 5
  },
  {
    _id: '5',
    name: 'Laptop Backpack',
    description: 'Durable laptop backpack with multiple compartments',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    category: 'Accessories',
    rating: 4.4,
    reviewCount: 94,
    countInStock: 18,
    discount: 0
  },
  {
    _id: '6',
    name: 'Bluetooth Speaker',
    description: 'Portable bluetooth speaker with excellent sound quality',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 178,
    countInStock: 22,
    discount: 25
  }
];

export const mockCategories = [
  { _id: '1', name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop' },
  { _id: '2', name: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop' },
  { _id: '3', name: 'Home', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop' },
  { _id: '4', name: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop' },
];

export default apiClient;
