import React, { createContext, useContext, useState, useEffect } from 'react';
import { myAuth } from '../Firebase';
import { onAuthStateChanged } from 'firebase/auth';

// AuthContext.js
// Provides authentication context for the app.
// Sets up user state and handles authentication changes using Firebase.
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(myAuth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
