// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDg9XwOzQCNZNgCYTRNEvr0B8oEfnRgPU",
  authDomain: "tasklist-bd91f.firebaseapp.com",
  projectId: "tasklist-bd91f",
  storageBucket: "tasklist-bd91f.firebasestorage.app",
  messagingSenderId: "906576220539",
  appId: "1:906576220539:web:59cd8a76e0223e40242dde",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
