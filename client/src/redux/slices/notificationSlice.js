import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // Add new on top
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
  },
});

export const { addNotification, markAllAsRead, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
