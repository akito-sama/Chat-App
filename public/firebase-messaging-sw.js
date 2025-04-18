// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCGrL700T1p8OMX_UKR8ec1Rt9HEJgongQ",
  authDomain: "chat-app-2ffce.firebaseapp.com",
  projectId: "chat-app-2ffce",
  storageBucket: "chat-app-2ffce.firebasestorage.app",
  messagingSenderId: "286635690316",
  appId: "1:286635690316:web:1c3e79f6631614381d67e9",
  measurementId: "G-DYY983LDWR"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/chatter-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});