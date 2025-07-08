// App Configuration
export const APP_CONFIG = {
  name: 'EcommerceApp',
  version: '1.0.0',
  apiUrl: 'http://192.168.1.139:5000/api', // Change this to your backend URL
  currency: 'USD',
  currencySymbol: '$',
};

// Colors (matching Tailwind config)
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  black: '#000000',
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  AUTH_TOKEN: 'authToken',
  CART_ITEMS: 'cartItems',
  WISHLIST_ITEMS: 'wishlistItems',
  SETTINGS: 'settings',
};

// Screen Names
export const SCREEN_NAMES = {
  HOME: 'Home',
  PRODUCTS: 'Products',
  PRODUCT_DETAIL: 'ProductDetail',
  CART: 'Cart',
  WISHLIST: 'Wishlist',
  PROFILE: 'Profile',
  LOGIN: 'Login',
  REGISTER: 'Register',
  EMAIL_VERIFICATION: 'EmailVerification',
  ORDERS: 'Orders',
  ORDER_DETAIL: 'OrderDetail',
  CHECKOUT: 'Checkout',
  SEARCH: 'Search',
  CATEGORIES: 'Categories',
  SETTINGS: 'Settings',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    BY_CATEGORY: (category) => `/products/category/${category}`,
    FEATURED: '/products/featured',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: (id) => `/cart/items/${id}`,
    REMOVE: (id) => `/cart/items/${id}`,
    CLEAR: '/cart',
  },
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: (id) => `/wishlist/remove/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: (id) => `/orders/${id}`,
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
  },
  CATEGORIES: '/categories',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_EXISTS: 'User already exists with this email.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  PRODUCT_NOT_FOUND: 'Product not found.',
  CART_ERROR: 'Error updating cart.',
  WISHLIST_ERROR: 'Error updating wishlist.',
  ORDER_ERROR: 'Error processing order.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PRODUCT_ADDED_TO_CART: 'Product added to cart!',
  PRODUCT_REMOVED_FROM_CART: 'Product removed from cart!',
  PRODUCT_ADDED_TO_WISHLIST: 'Product added to wishlist!',
  PRODUCT_REMOVED_FROM_WISHLIST: 'Product removed from wishlist!',
  ORDER_PLACED: 'Order placed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
};

// App Settings
export const APP_SETTINGS = {
  ITEMS_PER_PAGE: 10,
  MAX_CART_QUANTITY: 99,
  CURRENCY_FORMAT: {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  },
  DATE_FORMAT: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
};

// Image Placeholders
export const PLACEHOLDERS = {
  PRODUCT_IMAGE: 'https://via.placeholder.com/400x400?text=No+Image',
  USER_AVATAR: 'https://via.placeholder.com/100x100?text=User',
  CATEGORY_IMAGE: 'https://via.placeholder.com/200x200?text=Category',
};
