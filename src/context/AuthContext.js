import React, { createContext, useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/fireBaseConfig"; // Ensure this uses `initializeAuth`

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likedQuotes, setLikedQuotes] = useState([]);

    useEffect(() => {
        // ✅ Listen for auth state changes (ensures persistence)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            return userCredential.user; // ✅ Return user to check in LoginScreen.js
        } catch (error) {
            console.error("Login error:", error);
            throw error; // ✅ Ensure error is thrown so it can be caught in LoginScreen.js
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, likedQuotes, setLikedQuotes }}>
            {children}
        </AuthContext.Provider>
    );
};
