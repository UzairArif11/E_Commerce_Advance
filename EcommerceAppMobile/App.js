import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { LogBox, View, ActivityIndicator } from 'react-native';
import { fetchNotifications } from './src/store/slices/notificationSlice';
import { restoreAuthState } from './src/store/slices/authSlice';
import socketService from './src/utils/socketService';

// Disable warnings for development
LogBox.ignoreLogs(['Warning: ...']);

// Inner component that has access to dispatch
function AppContent() {
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);

// Setup authentication restoration and socket connection when user is authenticated
useEffect(() => {
  dispatch(restoreAuthState());
  if (isAuthenticated && userInfo?.token) {
    // Connect to socket for real-time notifications
    socketService.connect(userInfo.token);

    // Load existing notifications
    dispatch(fetchNotifications({ page: 1, limit: 10 }));

    return () => {
      // Cleanup socket connection when component unmounts
      socketService.disconnect();
    };
  } else {
    // Disconnect socket when user logs out
    socketService.disconnect();
  }
}, [isAuthenticated, userInfo, dispatch]);

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        } 
        persistor={persistor}
      >
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
