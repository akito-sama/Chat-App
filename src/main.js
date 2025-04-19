import { createApp } from 'vue';
import App from './App.vue';
import { getFCMToken } from './firebase';
import router from './router';

createApp(App).use(router).mount('#app');

// Get the FCM token after the app is mounted
getFCMToken()
  .then((token) => {
    console.log('FCM Token retrieved successfully:', token);
    // You can now use the token for sending notifications
  })
  .catch((error) => {
    console.error('Error getting FCM token:', error);
  });
