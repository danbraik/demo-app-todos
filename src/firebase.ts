// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXHTujFgBdRPspvIUS1El02VS7Fs6MrMc",
  authDomain: "fir-app-todos.firebaseapp.com",
  projectId: "fir-app-todos",
  storageBucket: "fir-app-todos.firebasestorage.app",
  messagingSenderId: "298931758699",
  appId: "1:298931758699:web:2e016e2d6289bd22a0b32e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
