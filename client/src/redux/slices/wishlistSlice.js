// src/redux/slices/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems:  [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action) {
      const item = action.payload;
      const existItem = state.wishlistItems.find((x) => x.productId === item.productId);
      if (!existItem) {
        state.wishlistItems.push(item);
      }
    },
    removeFromWishlist(state, action) {
      const productId = action.payload;
      state.wishlistItems = state.wishlistItems.filter((x) => x.productId !== productId);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
