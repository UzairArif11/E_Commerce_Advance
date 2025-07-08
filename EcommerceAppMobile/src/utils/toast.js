import { Alert, ToastAndroid, Platform } from 'react-native';

/**
 * Show a toast message cross-platform
 * @param {string} message - The message to display
 * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (Android only)
 */
export const showToast = (message, type = 'info', duration = ToastAndroid.SHORT) => {
  if (Platform.OS === 'android') {
    // Use Android's native toast
    ToastAndroid.show(message, duration);
  } else {
    // Use iOS Alert for simple notifications
    const title = getToastTitle(type);
    Alert.alert(title, message);
  }
};

/**
 * Show success toast
 * @param {string} message 
 */
export const showSuccessToast = (message) => {
  showToast(message, 'success');
};

/**
 * Show error toast
 * @param {string} message 
 */
export const showErrorToast = (message) => {
  showToast(message, 'error');
};

/**
 * Show warning toast
 * @param {string} message 
 */
export const showWarningToast = (message) => {
  showToast(message, 'warning');
};

/**
 * Show info toast
 * @param {string} message 
 */
export const showInfoToast = (message) => {
  showToast(message, 'info');
};

/**
 * Get appropriate title for toast type
 * @param {string} type 
 * @returns {string}
 */
const getToastTitle = (type) => {
  switch (type) {
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'info':
    default:
      return 'Info';
  }
};

export default {
  show: showToast,
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
};
