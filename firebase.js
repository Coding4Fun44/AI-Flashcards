// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
require("dotenv").config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDR8HUaMFcW90WfZKJifvtfiMOebcS4EKA",
  authDomain: "flashcards-c4e28.firebaseapp.com",
  projectId: "flashcards-c4e28",
  storageBucket: "flashcards-c4e28.appspot.com",
  messagingSenderId: "128589204992",
  appId: "1:128589204992:web:7067fb0ac8f0f45aa552e5",
};

// Initialize Firebase
if (process.env.FIREBASE_API_KEY) {
  firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
