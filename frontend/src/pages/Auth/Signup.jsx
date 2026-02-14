import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Mail, Lock, User, Check, X, Sun, Moon } from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords don't match");
        }
        setLoading(true);
        try {
            await register(formData.firstName, formData.lastName, formData.email, formData.password);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Password strength checker
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        const levels = [
            { strength: 0, label: '', color: '' },
            { strength: 1, label: 'Weak', color: 'bg-red-500' },
            { strength: 2, label: 'Fair', color: 'bg-yellow-500' },
            { strength: 3, label: 'Good', color: 'bg-blue-500' },
            { strength: 4, label: 'Strong', color: 'bg-green-500' }
        ];

        return levels[strength];
    };

    const passwordStrength = getPasswordStrength();
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 transition-colors duration-200 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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

            {/* Signup Card */}
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
                            Create Account
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start your financial journey with BudgetWise
                        </p>
                    </div>

                    {/* Signup Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="pl-10"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="pl-10"
                                />
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                                            <span className={`text-xs font-medium ${passwordStrength.strength >= 3 ? 'text-green-600' : 'text-gray-600'}`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full ${level <= passwordStrength.strength
                                                        ? passwordStrength.color
                                                        : 'bg-gray-200 dark:bg-gray-700'
                                                        } transition-all`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="pl-10"
                                />
                                {/* Password Match Indicator */}
                                {formData.confirmPassword && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        {passwordsMatch ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                required
                                className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                I agree to the{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                            isLoading={loading}
                        >
                            Create Account
                        </Button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Sign In Instead
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
