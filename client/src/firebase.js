// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCz0sXB4MG76x3KiI0aAkRNKpXgazfV8Z4",
  authDomain: "restaurantlido.firebaseapp.com",
  projectId: "restaurantlido",
  storageBucket: "restaurantlido.firebasestorage.app",
  messagingSenderId: "990930763828",
  appId: "1:990930763828:web:6d0d1a1f920b7b5b03ca61",
  measurementId: "G-50Y8XJ9D6W"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
