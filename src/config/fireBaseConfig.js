// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { 
    getAuth, 
    initializeAuth, 
    getReactNativePersistence, 
    createUserWithEmailAndPassword 
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
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

const db = getFirestore(app);

export { db };

// ✅ Enable persistent authentication using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Export auth instance
export { auth };

// Function to register a user
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user; // Returns the user object
    } catch (error) {
        throw error; // Propagate error to the caller
    }
};
