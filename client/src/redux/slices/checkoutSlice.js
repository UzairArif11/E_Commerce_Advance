// src/redux/slices/checkoutSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shippingAddress: '',
  paymentMethod: 'Stripe', // Default to Stripe
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
  },
});

export const { setShippingAddress, setPaymentMethod } = checkoutSlice.actions;
export default checkoutSlice.reducer;
