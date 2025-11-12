// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// If you want Auth later, also add:
// import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj7rTUxIubZSHkZKuvLwG98j8pKSsE76E",
  authDomain: "grammaticode.firebaseapp.com",
  projectId: "grammaticode",
  storageBucket: "grammaticode.firebasestorage.app",
  messagingSenderId: "272697038085",
  appId: "1:272697038085:web:e07cdfe23029840aeb536c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export so other files can use
export { app, db };
