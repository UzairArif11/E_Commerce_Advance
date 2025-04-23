
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.productId === item.productId);

      if (existItem) {
        existItem.quantity += item.quantity;
      } else {
        state.cartItems.push(item);
      }
    },

    removeFromCart(state, action) {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x.productId !== productId);
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const item = state.cartItems.find((x) => x.productId === productId);

      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const item = state.cartItems.find((x) => x.productId === productId);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
