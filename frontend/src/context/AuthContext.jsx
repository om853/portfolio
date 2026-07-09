import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const response = await api.post('/auth/me/');
                setUser(response.data);
                addToast('Welcome back!', 'success', 0);
            } catch (error) {
                localStorage.removeItem('access_token');
                addToast('Session expired. Please log in again.', 'warning', 5000);
            }
        }
        setLoading(false);
    };
        checkAuth();
    }, [addToast]);

    const refreshUser = async () => {
        try {
            const response = await api.post('/auth/me/', {});
            setUser(response.data);
        } catch (error) {
            console.error('Failed to refresh user', error);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login/', { email, password });
            const { access_token, user: userData } = response.data;
            localStorage.setItem('access_token', access_token);
            setUser(userData);
            addToast('Logged in successfully', 'success', 3000);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
            addToast(errorMessage, 'error', 5000);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout/', {});
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('access_token');
            setUser(null);
            addToast('Logged out successfully', 'info', 3000);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
