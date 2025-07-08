# 🛒 E-Commerce Mobile App - React Native

A complete, fully functional e-commerce mobile application built with React Native, Expo, Redux Toolkit, and NativeWind (Tailwind CSS for React Native).

## 📱 Features

- ✅ **Product Catalog** - Browse products with search and filtering
- ✅ **Shopping Cart** - Add/remove items, quantity management
- ✅ **Wishlist** - Save favorite products
- ✅ **User Authentication** - Login/Register with secure storage
- ✅ **User Profile** - Manage account settings
- ✅ **Order Management** - View order history and track orders
- ✅ **Redux State Management** - Global state with Redux Toolkit
- ✅ **Responsive Design** - Tailwind CSS styling with NativeWind
- ✅ **Navigation** - React Navigation with tab and stack navigators
- ✅ **Toast Notifications** - User feedback for actions

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (>= 18.17) - [Download here](https://nodejs.org/)
2. **Expo CLI** - Install globally: `npm install -g @expo/cli`
3. **Expo Go App** - Download on your phone from App Store/Play Store

### Installation

```bash
# Clone the repository
git clone <repo-url>

# Navigate to project directory
cd EcommerceAppMobile

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

1. **On Physical Device:**
   - Open Expo Go app on your phone
   - Scan the QR code displayed in terminal

2. **On Emulator/Simulator:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (macOS only)

3. **On Web:**
   - Press `w` to open in web browser

## 📁 Project Structure

```
EcommerceAppMobile/
├── App.js                    # Main app entry point
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── metro.config.js           # Metro bundler config
├── src/
│   ├── components/           # Reusable components
│   │   ├── ProductCard.js    # Product display component
│   │   ├── CartItem.js       # Shopping cart item
│   │   ├── CustomButton.js   # Custom button component
│   │   ├── Header.js         # App header
│   │   └── LoadingSpinner.js # Loading indicator
│   ├── screens/              # App screens
│   │   ├── HomeScreen.js     # Product catalog
│   │   ├── ProductScreen.js  # Product details
│   │   ├── CartScreen.js     # Shopping cart
│   │   ├── WishlistScreen.js # Saved products
│   │   ├── LoginScreen.js    # User authentication
│   │   ├── RegisterScreen.js # User registration
│   │   ├── ProfileScreen.js  # User profile
│   │   └── OrdersScreen.js   # Order history
│   ├── navigation/           # Navigation setup
│   │   └── AppNavigator.js   # Main navigator
│   ├── store/                # Redux store
│   │   ├── store.js          # Store configuration
│   │   └── slices/           # Redux slices
│   │       ├── authSlice.js  # Authentication state
│   │       ├── cartSlice.js  # Shopping cart state
│   │       ├── wishlistSlice.js # Wishlist state
│   │       └── productsSlice.js # Products state
│   ├── utils/                # Utility functions
│   │   ├── api.js            # API client
│   │   ├── storage.js        # AsyncStorage helpers
│   │   └── constants.js      # App constants
│   └── hooks/                # Custom hooks
│       └── useApi.js         # API hook
└── assets/                   # Images and static files
```

## 🎨 React Native vs React Web - Key Differences

### Components
| React Web | React Native | Purpose |
|-----------|--------------|----------|
| `<div>` | `<View>` | Container element |
| `<span>`, `<p>`, `<h1>` | `<Text>` | Text display |
| `<img>` | `<Image>` | Image display |
| `<input>` | `<TextInput>` | Text input |
| `<button>` | `<TouchableOpacity>` | Clickable element |
| `<ul>`, `<ol>` | `<FlatList>`, `<SectionList>` | Lists |
| CSS files | `StyleSheet` or NativeWind | Styling |

### Styling Examples

**React Web (CSS):**
```jsx
<div className="bg-blue-500 p-4 rounded-lg">
  <h1 className="text-white text-xl">Hello World</h1>
</div>
```

**React Native (NativeWind):**
```jsx
<View className="bg-blue-500 p-4 rounded-lg">
  <Text className="text-white text-xl">Hello World</Text>
</View>
```

### Navigation

**React Web (React Router):**
```jsx
import { BrowserRouter, Route, Link } from 'react-router-dom';

<Link to="/profile">Profile</Link>
```

**React Native (React Navigation):**
```jsx
import { NavigationContainer } from '@react-navigation/native';

navigation.navigate('Profile');
```

## 🔧 Configuration Files

### NativeWind Configuration

**tailwind.config.js:**
```javascript
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**metro.config.js:**
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

## 🛠️ Building the App

### Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Configure Build
```bash
eas build:configure
```

### Build for Different Platforms

**Android (APK for testing):**
```bash
eas build --platform android --profile preview
```

**Android (AAB for Play Store):**
```bash
eas build --platform android --profile production
```

**iOS (IPA for App Store):**
```bash
eas build --platform ios --profile production
```

### Build Profiles (eas.json)
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 📱 Publishing to App Stores

### Google Play Store

1. **Create Developer Account** ($25 one-time fee)
   - Go to [Google Play Console](https://play.google.com/console)
   - Complete developer profile

2. **Prepare App Listing**
   - App title, description, screenshots
   - App icon, feature graphic
   - Privacy policy URL
   - Content rating questionnaire

3. **Upload AAB File**
   ```bash
   eas submit --platform android
   ```

4. **Review and Publish**
   - Review app content policy
   - Submit for review (1-3 days)

### Apple App Store

1. **Apple Developer Account** ($99/year)
   - Enroll at [developer.apple.com](https://developer.apple.com)

2. **App Store Connect**
   - Create new app listing
   - Configure app information, pricing

3. **Upload IPA**
   ```bash
   eas submit --platform ios
   ```

4. **App Review**
   - Submit for review (1-7 days)
   - Respond to any review feedback

## 🌐 API Integration

### API Client Setup

**src/utils/api.js:**
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-api-domain.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### API Functions

**src/utils/api.js (continued):**
```javascript
// Product APIs
export const getProducts = () => apiClient.get('/products');
export const getProduct = (id) => apiClient.get(`/products/${id}`);
export const searchProducts = (query) => apiClient.get(`/products/search?q=${query}`);

// Auth APIs
export const loginUser = (credentials) => apiClient.post('/auth/login', credentials);
export const registerUser = (userData) => apiClient.post('/auth/register', userData);
export const getUserProfile = () => apiClient.get('/auth/profile');

// Cart APIs
export const getCart = () => apiClient.get('/cart');
export const addToCart = (productId, quantity) => 
  apiClient.post('/cart/add', { productId, quantity });
export const updateCartItem = (itemId, quantity) => 
  apiClient.put(`/cart/items/${itemId}`, { quantity });
export const removeFromCart = (itemId) => 
  apiClient.delete(`/cart/items/${itemId}`);

// Order APIs
export const createOrder = (orderData) => apiClient.post('/orders', orderData);
export const getOrders = () => apiClient.get('/orders');
export const getOrder = (id) => apiClient.get(`/orders/${id}`);
```

## 🔄 State Management with Redux Toolkit

### Store Configuration

**src/store/store.js:**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cartSlice';
import wishlistSlice from './slices/wishlistSlice';
import productsSlice from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    products: productsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## 📱 Storage

### AsyncStorage Usage

**src/utils/storage.js:**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting data:', e);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing data:', e);
  }
};
```

## 🔔 Push Notifications

### Setup Expo Notifications

```bash
npm install expo-notifications expo-device expo-constants
```

**src/utils/notifications.js:**
```javascript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }
  return token;
}
```

## 🧪 Testing

### Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

### Test Example

**__tests__/ProductCard.test.js:**
```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../src/components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
};

describe('ProductCard', () => {
  it('renders product name correctly', () => {
    const { getByText } = render(<ProductCard product={mockProduct} />);
    expect(getByText('Test Product')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <ProductCard product={mockProduct} onPress={onPressMock} />
    );
    
    fireEvent.press(getByTestId('product-card'));
    expect(onPressMock).toHaveBeenCalledWith(mockProduct);
  });
});
```

## 🚀 Performance Optimization

### Image Optimization

```jsx
import { Image } from 'expo-image';

// Use Expo Image for better performance
<Image 
  source={{ uri: product.image }}
  placeholder="blurhash"
  transition={1000}
  style={{ width: 200, height: 200 }}
/>
```

### List Optimization

```jsx
import { FlatList } from 'react-native';

<FlatList
  data={products}
  renderItem={({ item }) => <ProductCard product={item} />}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: 200,
    offset: 200 * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

## 🐛 Debugging

### React Native Debugger

1. Install React Native Debugger
2. Start the app with `npx expo start`
3. Press `j` to open debugger
4. Enable "Debug Remote JS"

### Flipper (for development)

```bash
# Install Flipper desktop app
# Add flipper plugins to your app
npm install react-native-flipper
```

## 📊 Analytics

### Firebase Analytics

```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

```javascript
import analytics from '@react-native-firebase/analytics';

// Track screen views
analytics().logScreenView({
  screen_name: 'HomeScreen',
  screen_class: 'HomeScreen',
});

// Track events
analytics().logEvent('product_view', {
  product_id: product.id,
  product_name: product.name,
  category: product.category,
});
```

## 🔒 Security Best Practices

1. **Secure Storage for Sensitive Data**
   ```bash
   npm install expo-secure-store
   ```

2. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables
   - Implement API key rotation

3. **Certificate Pinning**
   ```javascript
   // Use expo-ssl-pinning for production apps
   import { NetworkingModule } from 'expo-ssl-pinning';
   ```

4. **Code Obfuscation**
   ```bash
   # Use metro-minify-terser for production builds
   npm install metro-minify-terser
   ```

## 🔄 Continuous Integration/Deployment

### GitHub Actions Example

**.github/workflows/build.yml:**
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build Android
        run: eas build --platform android --non-interactive
```

## 📚 Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

## 🆘 Common Issues & Solutions

### Metro Bundler Issues
```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro cache completely
npx expo start --reset-cache
```

### Android Build Issues
```bash
# Clean Gradle cache
cd android && ./gradlew clean
```

### iOS Build Issues
```bash
# Clean iOS build
cd ios && xcodebuild clean
```

### Dependencies Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Coding! 🚀**
