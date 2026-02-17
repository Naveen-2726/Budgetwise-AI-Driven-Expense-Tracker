import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck, Sun, Moon, RefreshCw, Mail } from 'lucide-react';

export default function VerifyOtp() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);
    const { verifyOtp, login, otpEmail } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || otpEmail;

    // Redirect if no email available
    useEffect(() => {
        if (!email) {
            toast.error('Session expired. Please login again.');
            navigate('/login');
        }
    }, [email, navigate]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    // Auto-focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are entered
        if (value && index === 5) {
            const fullOtp = newOtp.join('');
            if (fullOtp.length === 6) {
                handleSubmit(null, fullOtp);
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);
            inputRefs.current[5]?.focus();
            handleSubmit(null, pastedData);
        }
    };

    const handleSubmit = async (e, otpString) => {
        if (e) e.preventDefault();
        const fullOtp = otpString || otp.join('');

        if (fullOtp.length !== 6) {
            toast.error('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);
        try {
            await verifyOtp(email, fullOtp);
            navigate('/dashboard');
        } catch (error) {
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setResending(true);
        try {
            await login(email, '');
            toast.success('New OTP sent to your email!');
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    // Mask email for display
    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
        : '';

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Back to Login Link */}
            <Link
                to="/login"
                className="absolute top-8 left-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-10"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Login</span>
            </Link>

            {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className="absolute top-8 right-8 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors z-10"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5" />
                )}
            </button>

            {/* OTP Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-md w-full"
            >
                {/* Glassmorphism Card */}
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    {/* Logo and Title */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg"
                        >
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                            Verify Your Identity
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We sent a 6-digit code to
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Mail className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                {maskedEmail}
                            </span>
                        </div>
                    </div>

                    {/* OTP Input Boxes */}
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center gap-3 mb-8">
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    disabled={loading}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    className={`
                                        w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl
                                        border-2 transition-all duration-200 outline-none
                                        ${digit
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-md shadow-primary-500/10'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white'
                                        }
                                        focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                    `}
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all text-white"
                            isLoading={loading}
                        >
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            Verify & Continue
                        </Button>
                    </form>

                    {/* Resend OTP Section */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Didn't receive the code?
                        </p>
                        {resendTimer > 0 ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm font-medium text-gray-600 dark:text-gray-300"
                            >
                                Resend available in{' '}
                                <span className="text-primary-600 dark:text-primary-400 font-bold tabular-nums">
                                    {formatTime(resendTimer)}
                                </span>
                            </motion.p>
                        ) : (
                            <button
                                onClick={handleResendOtp}
                                disabled={resending}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
                                Resend OTP
                            </button>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                                Wrong email?
                            </span>
                        </div>
                    </div>

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Try Different Email
                        </Link>
                    </div>

                    {/* Security Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
                    >
                        <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            For your security, this code expires in 10 minutes. Never share your OTP with anyone. BudgetWise will never ask for your OTP via phone or email.
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
            </motion.div>
        </div>
    );
}
