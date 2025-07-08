import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser as apiLogin } from '../../utils/api';
import axios from 'axios';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiLogin({ email, password });
      const { token, user } = response.data;
      
      // Store token and user info
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      const message = error.response?.data?.errors?.[0]?.msg || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.1.139:5000/api/auth/signup', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors?.[0]?.msg || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

export const verifyEmailThunk = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.1.139:5000/api/auth/verify-email', {
        email,
        otp
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors?.[0]?.msg || error.message || 'Verification failed';
      return rejectWithValue(message);
    }
  }
);

export const resendOtpThunk = createAsyncThunk(
  'auth/resendOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://192.168.1.139:5000/api/auth/resend-otp', {
        email
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.errors?.[0]?.msg || error.message || 'Failed to resend OTP';
      return rejectWithValue(message);
    }
  }
);

// Restore authentication state from AsyncStorage
export const restoreAuthState = createAsyncThunk(
  'auth/restoreAuthState',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userInfoString = await AsyncStorage.getItem('userInfo');
      
      if (token && userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        return { token, user: userInfo };
      }
      
      return null;
    } catch (error) {
      return rejectWithValue('Failed to restore auth state');
    }
  }
);

const initialState = {
  userInfo: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  registrationSuccess: false,
  verificationSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorage.removeItem('userInfo');
      AsyncStorage.removeItem('authToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    resetRegistration: (state) => {
      state.registrationSuccess = false;
      state.verificationSuccess = false;
      state.error = null;
    },
    updateSettings: (state, action) => {
      // Update user info with new settings
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      })
      // Verify Email
      .addCase(verifyEmailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verificationSuccess = true;
        state.error = null;
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.verificationSuccess = false;
      })
      // Restore Auth State
      .addCase(restoreAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.userInfo = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(restoreAuthState.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
      });
  },
});

export const {
  logout,
  clearError,
  setUserInfo,
  resetRegistration,
  updateSettings,
} = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserInfo = (state) => state.auth.userInfo;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
