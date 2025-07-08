import { io } from 'socket.io-client';
import Toast from 'react-native-toast-message';
import { store } from '../store/store';
import { addNotification } from '../store/slices/notificationSlice';
import { SOCKET_URL } from '../config/environment';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(userToken) {
    if (this.socket && this.isConnected) {
      return;
    }

    try {
      // Use the same base URL as API but for socket connection
      const socketURL = SOCKET_URL; // From environment config
      
      this.socket = io(socketURL, {
        auth: { token: userToken },
        transports: ['websocket'],
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
      });

      // Listen for real-time notifications
      this.setupNotificationListeners();

    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
    }
  }

  setupNotificationListeners() {
    if (!this.socket) return;

    // Order status updates for users
    this.socket.on('user_shipped', (data) => {
      this.handleNotification(data, 'Order Shipped', '🚚');
    });

    this.socket.on('user_delivered', (data) => {
      this.handleNotification(data, 'Order Delivered', '✅');
    });

    this.socket.on('user_cancelled', (data) => {
      this.handleNotification(data, 'Order Cancelled', '❌');
    });

    // Broadcast notifications
    this.socket.on('user_broadcast', (data) => {
      this.handleNotification(data, 'Announcement', '📢');
    });

    // Payment confirmation
    this.socket.on('user_stripe', (data) => {
      Toast.show({
        type: 'success',
        text1: '🎉 Payment Successful!',
        text2: 'Order placed successfully',
        visibilityTime: 4000,
      });
      
      store.dispatch(addNotification({
        message: 'Payment successful! Your order has been placed.',
        type: 'payment',
        read: false,
      }));
    });

    // Admin notifications (if user is admin)
    this.socket.on('admin_orderPlaced', (data) => {
      this.handleNotification(data, 'New Order', '🛒');
    });

    this.socket.on('admin_orderShipped', (data) => {
      this.handleNotification(data, 'Order Update', '🚚');
    });

    this.socket.on('admin_orderCancelled', (data) => {
      this.handleNotification(data, 'Order Cancelled', '❌');
    });
  }

  handleNotification(data, title, emoji) {
    // Show toast notification
    Toast.show({
      type: 'info',
      text1: `${emoji} ${title}`,
      text2: data.message,
      visibilityTime: 4000,
      topOffset: 60,
    });

    // Add to Redux store
    store.dispatch(addNotification({
      message: data.message,
      type: data.type || 'general',
      read: false,
      createdAt: new Date().toISOString(),
    }));

    // Play notification sound (optional)
    this.playNotificationSound();
  }

  playNotificationSound() {
    // In a real app, you could use react-native-sound
    // or expo-av to play notification sounds
    console.log('🔊 Playing notification sound');
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected');
    }
  }

  // Emit events to server
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Export singleton instance
export default new SocketService();
