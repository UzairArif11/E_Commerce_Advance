// Listen for Service Worker installation
self.addEventListener('install', function (event) {
  console.log('Service Worker Installed.');
});

// Listen for Service Worker activation
self.addEventListener('activate', function (event) {
  console.log('Service Worker Activated.');
});

// Listen for push events (push notifications)
self.addEventListener('push', function (event) {
  const data = event.data.json();
  const title = data.title || 'Notification';
  const options = {
    body: data.body,
    icon: '/vite.svg', // Replace with your own icon if needed
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
