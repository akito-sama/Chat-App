// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore();

const messaging = getMessaging(app);
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});

getToken(messaging, { vapidKey: 'BJUHeHkhfDpSHY_DvhPs9TZ-L6GBoTMdIDXNtJhgwAUoxbfcplroaLgxaQ9u_71Jryy9f7-dKpHv50i84HSfrQE' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    console.log("Token is: ", currentToken);
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

export {auth, db, messaging};
