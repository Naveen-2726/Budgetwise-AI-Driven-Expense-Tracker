import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decode token or fetch user profile if endpoint exists
            // For now, we decode simplistic JWT or just assume logged in
            // Ideally, call /api/auth/me if it exists
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        // Expecting OTP flow, so no token yet
        return response.data;
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await api.post('/auth/verify-otp', { email, otp });
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(userData);
            toast.success('Successfully logged in!');
            return true;
        } catch (error) {
            toast.error('Invalid OTP');
            throw error;
        }
    };

    const register = async (firstName, lastName, email, password) => {
        await api.post('/auth/register', { firstName, lastName, email, password });
        toast.success('Registration successful! Check your email.');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Logged out');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, verifyOtp, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
