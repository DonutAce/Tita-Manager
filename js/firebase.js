// js/firebase.js

// Import Firebase (v10.14.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut   // <-- added
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ✅ Import Firebase Storage
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

// 🔹 Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDvt6rS1kUABxrZm164x7s_ljCFFGuhuas",
  authDomain: "tita-e88bc.firebaseapp.com",
  projectId: "tita-e88bc",
  storageBucket: "tita-e88bc.appspot.com",
  messagingSenderId: "792705193358",
  appId: "1:792705193358:web:1507e539335afb829700df",
  measurementId: "G-CM0F09PQ84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export everything
export {
  app,
  auth,
  db,
  storage,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,  // <-- export signOut
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject
};
