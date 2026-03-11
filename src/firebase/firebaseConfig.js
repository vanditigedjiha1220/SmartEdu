// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// TODO: Add your own Firebase configuration here
const firebaseConfig = {

  apiKey: "AIzaSyBq3yZQITKmJHs9nFmZ1VA2Y5kmITPTyRs",

  authDomain: "smartedu-c6f28.firebaseapp.com",

  projectId: "smartedu-c6f28",

  storageBucket: "smartedu-c6f28.firebasestorage.app",

  messagingSenderId: "821063002509",

  appId: "1:821063002509:web:8db90d584232b89af7b5c4",

  measurementId: "G-CE6R28LQCB"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { app, auth, db, storage, functions };
