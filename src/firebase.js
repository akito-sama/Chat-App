// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

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

export {auth, db};
