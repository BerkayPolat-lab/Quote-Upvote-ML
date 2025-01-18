import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const loggedInUser = await authService.login(email, password);
        setUser(loggedInUser);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
