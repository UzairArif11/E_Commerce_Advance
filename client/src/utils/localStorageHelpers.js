// src/utils/localStorageHelpers.js

const CART_KEY = 'cartItems';

/**
 * Save cart items to localStorage.
 * @param {Array} cartItems - Items to be saved.
 */
export const saveCartToLocalStorage = (cartItems) => {
  try {
    const serializedData = JSON.stringify(cartItems);
    localStorage.setItem(CART_KEY, serializedData);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

/**
 * Load cart items from localStorage.
 * @returns {Array} Parsed cart items or empty array.
 */
export const loadCartFromLocalStorage = () => {
  try {
    const serializedData = localStorage.getItem(CART_KEY);
    return serializedData ? JSON.parse(serializedData) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};
