// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import { saveCartToLocalStorage } from '../utils/localStorageHelpers';

 
const cartLocalStorageMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  const cartActions = ['cart/addToCart', 'cart/removeFromCart', 'cart/increaseQuantity', 'cart/decreaseQuantity'];

  if (cartActions.includes(action.type)) {
    const state = storeAPI.getState();
    saveCartToLocalStorage(state.cart.cartItems);
  }

  return result;
};

// Then include it in `configureStore`
export const store =configureStore({
  reducer: { cart: cartReducer,
    checkout: checkoutReducer,
   },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartLocalStorageMiddleware),
});
