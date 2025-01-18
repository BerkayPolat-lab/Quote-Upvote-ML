// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmBTO36KgjvwznCn46U__-0u7pLkQOdHA",
  authDomain: "quotes-3afcb.firebaseapp.com",
  projectId: "quotes-3afcb",
  storageBucket: "quotes-3afcb.firebasestorage.app",
  messagingSenderId: "234530257835",
  appId: "1:234530257835:web:021145357827782804b0ee",
  measurementId: "G-NGWZY0M0GP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user; // Returns the user object
    } catch (error) {
      throw error; // Propagate error to the caller
    }
  };