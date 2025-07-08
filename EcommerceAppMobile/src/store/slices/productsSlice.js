import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, searchProducts as apiSearchProducts, getCategories, getFeaturedProducts, mockProducts } from '../../utils/api';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProducts();
      return response.data;
    } catch (error) {
      console.log('API failed, using mock data:', error.message);
      // Use mock data as fallback
      return mockProducts;
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeaturedProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await apiSearchProducts(query);
      return response.data;
    } catch (error) {
      console.log('Search API failed, using mock data filter:', error.message);
      // Use filtered mock data as fallback
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      return filtered;
    }
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  categories: [],
  searchResults: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  sortBy: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setProductsError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.sortBy = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setProductsLoading,
  setProducts,
  setFeaturedProducts,
  setCategories,
  setProductsError,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  clearFilters,
} = productsSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectFeaturedProducts = (state) => state.products.featuredProducts;
export const selectCategories = (state) => state.products.categories;
export const selectFilteredProducts = (state) => {
  let filtered = state.products.products;

  // Filter by search query
  if (state.products.searchQuery) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(state.products.searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(state.products.searchQuery.toLowerCase())
    );
  }

  // Filter by category
  if (state.products.selectedCategory) {
    filtered = filtered.filter(product => product.category === state.products.selectedCategory);
  }

  // Sort products
  if (state.products.sortBy) {
    switch (state.products.sortBy) {
      case 'price-low-high':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
  }

  return filtered;
};

export default productsSlice.reducer;
