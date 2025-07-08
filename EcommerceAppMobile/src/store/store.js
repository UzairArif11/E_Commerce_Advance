import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import productsSlice from './slices/productsSlice';
import checkoutSlice from './slices/checkoutSlice';
import notificationSlice from './slices/notificationSlice';
import orderSlice from './slices/orderSlice';
import wishlistSlice from './slices/wishlistSlice';

// Persist configurations
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['userInfo', 'isAuthenticated']
};

const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
  whitelist: ['cartItems']
};


const checkoutPersistConfig = {
  key: 'checkout',
  storage: AsyncStorage,
  whitelist: ['shippingAddress', 'paymentMethod']
};

const wishlistPersistConfig = {
  key: 'wishlist',
  storage: AsyncStorage,
  whitelist: ['wishlistItems']
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutSlice);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: persistedCartReducer,
    products: productsSlice,
    checkout: persistedCheckoutReducer,
    notifications: notificationSlice,
    orders: orderSlice,
    wishlist: persistedWishlistReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
