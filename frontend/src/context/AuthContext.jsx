import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await api.post('/auth/me/');
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('access_token');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const refreshUser = async () => {
        try {
            const response = await api.post('/auth/me/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to refresh user', error);
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login/', { email, password });
        const { access_token, user: userData } = response.data;
        localStorage.setItem('access_token', access_token);
        setUser(userData);
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout/');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('access_token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
