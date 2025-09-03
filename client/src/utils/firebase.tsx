// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_SERVER_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_SERVER_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_SERVER_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SERVER_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SERVER_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_SERVER_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_SERVER_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
