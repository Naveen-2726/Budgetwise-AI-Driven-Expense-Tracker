import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Mail, Sun, Moon, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
            toast.success('Password reset link sent!');
        } catch (error) {
            // Still show success to prevent email enumeration
            setSent(true);
            toast.success('If this email is registered, you will receive a reset link.');
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
            </div>

            {/* Back to Login */}
            <Link
                to="/login"
                className="absolute top-8 left-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Login</span>
            </Link>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-8 right-8 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-md w-full"
            >
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                            {sent ? <CheckCircle className="w-8 h-8 text-white" /> : <Sparkles className="w-8 h-8 text-white" />}
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                            {sent ? 'Check Your Email' : 'Reset Password'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {sent
                                ? `We've sent a password reset link to ${email}`
                                : 'Enter your email and we\'ll send you a reset link'
                            }
                        </p>
                    </div>

                    {sent ? (
                        <div className="space-y-6">
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    Please check your inbox and spam folder. The link expires in 15 minutes.
                                </p>
                            </div>
                            <Button
                                onClick={() => setSent(false)}
                                variant="secondary"
                                className="w-full"
                            >
                                Send Again
                            </Button>
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                    placeholder="Enter your email"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg"
                                isLoading={loading}
                            >
                                Send Reset Link
                            </Button>

                            <div className="text-center">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">Remember your password? </span>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-indigo-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
            </motion.div>
        </div>
    );
}
