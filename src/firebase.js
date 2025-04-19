// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGrL700T1p8OMX_UKR8ec1Rt9HEJgongQ",
  authDomain: "chat-app-2ffce.firebaseapp.com",
  projectId: "chat-app-2ffce",
  storageBucket: "chat-app-2ffce.firebasestorage.app",
  messagingSenderId: "286635690316",
  appId: "1:286635690316:web:1c3e79f6631614381d67e9",
  measurementId: "G-DYY983LDWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Function to request notification permission and get FCM token
export const getFCMToken = async () => {
  return new Promise((resolve, reject) => {
    // Listen for authentication state change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Request notification permission
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            // Get the FCM token
            getToken(messaging, { vapidKey: 'BJUHeHkhfDpSHY_DvhPs9TZ-L6GBoTMdIDXNtJhgwAUoxbfcplroaLgxaQ9u_71Jryy9f7-dKpHv50i84HSfrQE' })
              .then((currentToken) => {
                if (currentToken) {
                  console.log('FCM Token:', currentToken);
                  // Optionally, save the token to Firestore under the user's document
                  setDoc(doc(db, 'users', user.uid), { fcmToken: currentToken }, { merge: true })
                    .then(() => {
                      console.log('FCM Token saved to Firestore');
                      resolve(currentToken);
                    })
                    .catch(reject);
                } else {
                  reject('No FCM token available');
                }
              })
              .catch(reject);
          } else {
            reject('Permission not granted');
          }
        });
      } else {
        reject('User not authenticated');
      }
    });
  });
};

// Export Firebase services
export { auth, db, messaging };
