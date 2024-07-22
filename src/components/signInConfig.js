// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1ynfNn515eXh0LHTb0EZobDxn8x4lJ6s",
  authDomain: "spent-3cf3c.firebaseapp.com",
  projectId: "spent-3cf3c",
  storageBucket: "spent-3cf3c.appspot.com",
  messagingSenderId: "618259338936",
  appId: "1:618259338936:web:58750529216d26ae4c064d",
  measurementId: "G-4KFEVJD7HG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
