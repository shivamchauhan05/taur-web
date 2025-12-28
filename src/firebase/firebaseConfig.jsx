// Firebase Configuration
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your Firebase Config (YAHAN APNA CONFIG DALNA)
const firebaseConfig = {
  apiKey: "AIzaSyC4XGv1KqYzqYzqYzqYzqYzqYzqYzqYzqY",
  authDomain: "cartour-project.firebaseapp.com",
  projectId: "cartour-project",
  storageBucket: "cartour-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456ghi789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);          // For database
const storage = getStorage(app);        // For file storage
const auth = getAuth(app);              // For authentication

export { db, storage, auth };
export default app;