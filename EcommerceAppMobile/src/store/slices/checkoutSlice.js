import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  shippingAddress: '',
  paymentMethod: '',
  orderSummary: null,
  isLoading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
    },
    setCheckoutLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCheckoutError: (state, action) => {
      state.error = action.payload;
    },
    clearCheckout: (state) => {
      state.shippingAddress = '';
      state.paymentMethod = '';
      state.orderSummary = null;
      state.error = null;
    },
  },
});

export const {
  setShippingAddress,
  setPaymentMethod,
  setOrderSummary,
  setCheckoutLoading,
  setCheckoutError,
  clearCheckout,
} = checkoutSlice.actions;

// Selectors
export const selectShippingAddress = (state) => state.checkout.shippingAddress;
export const selectPaymentMethod = (state) => state.checkout.paymentMethod;
export const selectOrderSummary = (state) => state.checkout.orderSummary;
export const selectCheckoutLoading = (state) => state.checkout.isLoading;
export const selectCheckoutError = (state) => state.checkout.error;

export default checkoutSlice.reducer;
