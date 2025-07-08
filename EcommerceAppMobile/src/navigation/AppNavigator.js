import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PlaceOrderScreen from '../screens/PlaceOrderScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import UserSettingsScreen from '../screens/UserSettingsScreen';

import { COLORS, SCREEN_NAMES } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Bar Icon Component
const TabIcon = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      case 'Cart':
        return '🛒';
      case 'Wishlist':
        return '❤️';
      case 'Profile':
        return '👤';
      default:
        return '🏠';
    }
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.iconText, { color: focused ? COLORS.primary[600] : COLORS.gray[400] }]}>
        {getIcon()}
      </Text>
    </View>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { wishlistItems = [] } = useSelector((state) => state.wishlist || {});
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.gray[400],
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[200],
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name={SCREEN_NAMES.HOME} 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.CART} 
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.error[500],
            color: COLORS.white,
            fontSize: 12,
            minWidth: 18,
            height: 18,
          },
        }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.WISHLIST} 
        component={WishlistScreen}
        options={{
          tabBarLabel: 'Wishlist',
          tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.error[500],
            color: COLORS.white,
            fontSize: 12,
            minWidth: 18,
            height: 18,
          },
        }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.PROFILE} 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack Navigator
const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={SCREEN_NAMES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={SCREEN_NAMES.EMAIL_VERIFICATION} component={EmailVerificationScreen} />
    </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  
  // Debug logging
  console.log('AppNavigator - isAuthenticated:', isAuthenticated);
  console.log('AppNavigator - userInfo:', userInfo);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen 
            name={SCREEN_NAMES.PRODUCT_DETAIL} 
            component={ProductDetailScreen}
            options={{
              headerShown: true,
              headerTitle: 'Product Details',
              headerStyle: {
                backgroundColor: COLORS.white,
              },
              headerTitleStyle: {
                color: COLORS.gray[900],
                fontSize: 18,
                fontWeight: 'bold',
              },
              headerTintColor: COLORS.primary[600],
            }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="PlaceOrder" 
            component={PlaceOrderScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="OrderHistory" 
            component={OrderHistoryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="UserSettings" 
            component={UserSettingsScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStackNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
});

export default AppNavigator;
