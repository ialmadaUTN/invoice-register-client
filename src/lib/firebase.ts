import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkCeJxKsjf6NPdLSjvgR-TiZ1Qyy_iH5k",
  authDomain: "facturas-bot-849eb.firebaseapp.com",
  projectId: "facturas-bot-849eb",
  storageBucket: "facturas-bot-849eb.firebasestorage.app",
  messagingSenderId: "670494294858",
  appId: "1:670494294858:web:a67a56ca8b7bea3d61f7b3",
  measurementId: "G-1RMCBH37KB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
