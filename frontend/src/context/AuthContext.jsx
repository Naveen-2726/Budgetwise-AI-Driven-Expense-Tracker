import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [otpPending, setOtpPending] = useState(false);
    const [otpEmail, setOtpEmail] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        // Expecting OTP flow, so no token yet
        setOtpPending(true);
        setOtpEmail(email);
        return response.data;
    };

    const verifyOtp = async (email, otp) => {
        try {
            const response = await api.post('/auth/verify-otp', { email, otp });
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(userData);
            setOtpPending(false);
            setOtpEmail(null);
            toast.success('Successfully logged in!');
            return true;
        } catch (error) {
            toast.error('Invalid OTP');
            throw error;
        }
    };

    const register = async (firstName, lastName, email, password) => {
        await api.post('/auth/register', { firstName, lastName, email, password });
        setOtpPending(true);
        setOtpEmail(email);
        toast.success('Registration successful! Check your email.');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setOtpPending(false);
        setOtpEmail(null);
        toast.success('Logged out');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, token, login, verifyOtp, register, logout, loading, otpPending, otpEmail, setOtpPending }}>
            {children}
        </AuthContext.Provider>
    );
};
