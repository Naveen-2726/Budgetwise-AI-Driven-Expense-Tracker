import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Mail, Lock, Sun, Moon } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('OTP sent to your email');
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Back to Home Link */}
            <Link
                to="/"
                className="absolute top-8 left-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Home</span>
            </Link>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-8 right-8 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5" />
                )}
            </button>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-md w-full"
            >
                {/* Glassmorphism Card */}
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Sign in to continue to BudgetWise
                        </p>
                    </div>

                    {/* Login Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <Input
                                    label="Password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <span className="ml-2 text-gray-600 dark:text-gray-400">Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                            isLoading={loading}
                        >
                            Sign In
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    New to BudgetWise?
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Create an Account
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
            </motion.div>
        </div>
    );
}
