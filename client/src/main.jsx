// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store'; // Assuming store.js now exports persistor
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'react-hot-toast';
import { injectStore } from './utils/axiosInstance'; // <-- injectStore
import 'antd/dist/reset.css'; // AntD v5+ uses reset.css

injectStore(store); // Inject the Redux store into Axios
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
      <App />
    </PersistGate>
  </Provider>
);