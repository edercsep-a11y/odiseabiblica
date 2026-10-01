import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsT2Qcn15qymX4-Ms58GaaiZS4EACmfWU",
  authDomain: "odisea-biblica.firebaseapp.com",
  projectId: "odisea-biblica",
  storageBucket: "odisea-biblica.firebasestorage.app",
  messagingSenderId: "658342536667",
  appId: "1:658342536667:web:aa3c0c4806d6db13a873fe"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
