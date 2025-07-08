import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.put('/notifications/read/all');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notifications/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/notifications/clear');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear notifications');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
  filter: 'all', // 'all', 'unread', 'read', 'broadcast'
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        ...action.payload,
        _id: action.payload._id || Date.now().toString(),
        createdAt: action.payload.createdAt || new Date().toISOString(),
        read: action.payload.read || false,
      };
      
      // Add to beginning of array (newest first)
      state.notifications.unshift(notification);
      
      if (!notification.read) {
        state.unreadCount += 1;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    resetPagination: (state) => {
      state.page = 1;
      state.hasMore = true;
      state.notifications = [];
    },
    setNotificationError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        const { notifications, hasMore, unreadCount } = action.payload;
        
        if (state.page === 1) {
          state.notifications = notifications;
        } else {
          state.notifications.push(...notifications);
        }
        
        state.hasMore = hasMore;
        state.unreadCount = unreadCount || 0;
        state.page += 1;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n._id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      })
      
      // Clear all notifications
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
        state.hasMore = true;
        state.page = 1;
      });
  },
});

export const {
  addNotification,
  setFilter,
  resetPagination,
  setNotificationError,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.isLoading;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectNotificationFilter = (state) => state.notifications.filter;
export const selectHasMoreNotifications = (state) => state.notifications.hasMore;

export const selectFilteredNotifications = (state) => {
  const { notifications, filter } = state.notifications;
  
  switch (filter) {
    case 'unread':
      return notifications.filter(n => !n.read);
    case 'read':
      return notifications.filter(n => n.read);
    case 'broadcast':
      return notifications.filter(n => n.type === 'broadcast');
    default:
      return notifications;
  }
};

export default notificationSlice.reducer;
