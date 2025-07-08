// Environment configuration for the mobile app
// This centralizes all API endpoints and configuration

const isDevelopment = __DEV__;

const config = {
  development: {
    API_BASE_URL: 'http://192.168.1.139:5000/api',
    SOCKET_URL: 'http://192.168.1.139:5000',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_key_here', // Replace with your Stripe key
  },
  production: {
    API_BASE_URL: 'https://your-production-api.com/api',
    SOCKET_URL: 'https://your-production-api.com',
    STRIPE_PUBLISHABLE_KEY: 'pk_live_your_stripe_key_here', // Replace with your live Stripe key
  }
};

const currentConfig = isDevelopment ? config.development : config.production;

export const {
  API_BASE_URL,
  SOCKET_URL,
  STRIPE_PUBLISHABLE_KEY
} = currentConfig;

export default currentConfig;
