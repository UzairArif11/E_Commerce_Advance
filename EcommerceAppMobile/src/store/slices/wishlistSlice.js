import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistAPI } from '../../services/api';

const initialState = {
  items: [],
  wishlistItems: [],
  loading: false,
  error: null
};

// Async thunks for API calls
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.addToWishlist(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const clearWishlistAsync = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.clearWishlist();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Keep local reducers for immediate UI updates
    addToWishlistLocal: (state, action) => {
      const item = action.payload;
      const existingItem = state.wishlistItems.find(
        (wishlistItem) => wishlistItem._id === item._id
      );
      
      if (!existingItem) {
        state.wishlistItems.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          category: item.category,
          brand: item.brand,
          rating: item.rating,
          countInStock: item.countInStock,
          addedAt: new Date().toISOString()
        });
      }
    },
    removeFromWishlistLocal: (state, action) => {
      const itemId = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== itemId
      );
    },
    clearWishlistLocal: (state) => {
      state.wishlistItems = [];
    },
    setWishlistError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.items || action.payload.wishlist || [];
        state.items = action.payload.items || action.payload.wishlist || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.items || action.payload.wishlist || [];
        state.items = action.payload.items || action.payload.wishlist || [];
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload.items || action.payload.wishlist || [];
        state.items = action.payload.items || action.payload.wishlist || [];
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear wishlist
      .addCase(clearWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = [];
      })
      .addCase(clearWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  addToWishlistLocal,
  removeFromWishlistLocal,
  clearWishlistLocal,
  setWishlistError
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.wishlistItems || state.wishlist.items || [];
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
