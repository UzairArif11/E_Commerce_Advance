// src/utils/axiosInstance.js
import axios from 'axios';

let store; // this will hold your Redux store

export const injectStore = (_store) => {
  store = _store;
};

// Create instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST Interceptor: Add token from Redux
axiosInstance.interceptors.request.use((config) => {
  if (store) {
    const token = store.getState().auth.userInfo?.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// RESPONSE Interceptor: Handle 401 or accessRight == 4
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
  

    if (status === 401  ) {
// If the user is not authenticated, logout and redirect to login
alert("You are not authenticated. Please log in again.");
    
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
