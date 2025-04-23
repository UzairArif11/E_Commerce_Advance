
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import authReducer from './slices/authSlice';
import wishlistReducer from './slices/wishlistSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['userInfo']
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['cartItems']
};
const wishlistPersistConfig = {
  key: 'wishlist',
  storage,
  whitelist: ['wishlistItems']
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    checkout: checkoutReducer,
    auth: persistedAuthReducer,
    wishlist: persistedWishlistReducer,
   },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export const persistor = persistStore(store);
