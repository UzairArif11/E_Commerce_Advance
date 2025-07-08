# Ecommerce Mobile Application

This document provides an overview of setting up, running, and deploying the Ecommerce Mobile Application built using React Native and Expo.

## Project Setup

1. **Environment Setup**
   - Make sure you have Node.js (>= 18.17) installed. You can download it from [nodejs.org](https://nodejs.org/en/).
   - Install Expo CLI: `npm install -g expo`

2. **Clone and Install Dependencies**
   - Clone the repository: `git clone <repo-url>`
   - Navigate to the project directory: `cd EcommerceAppMobile`
   - Install dependencies: `npm install`

## Running the App

- Run `npx expo start` to start the development server.
- Use the Expo Go app on your mobile device to scan the QR code provided in the terminal.
- You can also press `a` to run the app on an Android emulator or `i` for an iOS simulator (macOS only).

## Project Structure

```
EcommerceAppMobile
├── App.js
├── assets
├── components
│   └── ProductCard.js
├── navigation
│   └── AppNavigator.js
├── screens
│   ├── HomeScreen.js
│   ├── ProductScreen.js
│   └── CartScreen.js
├── store
│   └── store.js
└── tailwind.css
```

## React Native vs React

- **View vs div**: Use `<View>` instead of `<div>` for layout.
- **Text**: Use `<Text>` component to display text instead of regular HTML tags.
- **Styling**: Use stylesheets or libraries like NativeWind for Tailwind CSS in React Native.

## Building the App

1. **Android**:
   - Run `eas build --platform android` to create an APK or AAB file.

2. **iOS**:
   - Run `eas build --platform ios` on macOS to create an IPA file.

## Deploying to Stores

1. **Google Play Store**:
   - Create a developer account.
   - Upload your AAB file through the Google Play Console.
   - Complete store listing details and submit for review.

2. **Apple App Store**:
   - Create a developer account.
   - Use App Store Connect to upload your IPA file.
   - Ensure all metadata and compliance guidelines are met.

## Creating API Clients

To create API clients, you can use the `axios` library or similar:

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

## Tips and Best Practices

- Use `useEffect` and `useState` hooks for managing component lifecycle and state.
- Utilize reactive programming patterns with Redux Toolkit to manage global state.
- Follow best practices for error handling and code structure for maintainability.

Feel free to modify this document as needed to accommodate any additional information specific to your setup or development workflow.
