// src/utils/axiosInstance.js
import axios from 'axios';

let store; // this will hold your Redux store

export const injectStore = (_store) => {
  store = _store;
};

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (store) {
    const token = store.getState().auth.userInfo?.token;
    console.log(store,"store..",token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
