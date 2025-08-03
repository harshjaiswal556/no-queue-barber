// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNImOmaWN-Cky2UYsjcWg5KtH6TX_UKQs",
  authDomain: "nacroestate.firebaseapp.com",
  projectId: "nacroestate",
  storageBucket: "nacroestate.appspot.com",
  messagingSenderId: "356193035700",
  appId: "1:356193035700:web:3b62e37827d399feac7ee1",
  measurementId: "G-9BGCHDEKQ3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
