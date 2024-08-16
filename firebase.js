// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR8HUaMFcW90WfZKJifvtfiMOebcS4EKA",
  authDomain: "flashcards-c4e28.firebaseapp.com",
  projectId: "flashcards-c4e28",
  storageBucket: "flashcards-c4e28.appspot.com",
  messagingSenderId: "128589204992",
  appId: "1:128589204992:web:7067fb0ac8f0f45aa552e5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };
