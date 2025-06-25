
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.userInfo = action.payload;
    },
    logout(state) {
      state.userInfo = null;
    },
    updateSettings(state,action) {
      // Assuming action.payload contains the updated settings
      state.userInfo = {...state.userInfo, ...action.payload};
    },
  },
});

export const { loginSuccess, logout ,updateSettings} = authSlice.actions;
export default authSlice.reducer;
