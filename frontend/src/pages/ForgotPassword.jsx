import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: newPassword
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess('Password reset link sent to your email!');
      setStep(2);
    } catch (err) {
      setError('Failed to send reset link. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/verify-reset-otp', { email, otp });
      setStep(3);
    } catch (err) {
      setError('Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <BackButton />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -180, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">BudgetWise</span>
          </Link>
        </div>

        <motion.div 
          initial={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
          whileHover={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 backdrop-blur-sm"
        >
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`flex-1 h-2 rounded-full mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              {step === 1 && 'Reset Password'}
              {step === 2 && 'Verify OTP'}
              {step === 3 && 'Create New Password'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 1 && 'Enter your email to receive a reset link'}
              {step === 2 && 'Check your email for the verification code'}
              {step === 3 && 'Choose a strong new password'}
            </p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3"
            >
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl mb-6 flex items-center gap-3"
            >
              <span className="text-xl">✓</span>
              <span>{success}</span>
            </motion.div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="your.email@example.com"
                    required
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📧</span>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5 rounded-xl">
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  We sent a verification code to <span className="font-black">{email}</span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full py-5 px-6 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-center text-4xl tracking-widest font-black focus:ring-2 focus:ring-emerald-500"
                  maxLength="6"
                  placeholder="000000"
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : '✓ Verify Code'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-semibold"
              >
                ← Back to Email
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="Re-enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              {/* Password Strength Indicator */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                    {newPassword.length >= 8 ? '✓' : '○'} At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                    {/[A-Z]/.test(newPassword) ? '✓' : '○'} One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                    {/[0-9]/.test(newPassword) ? '✓' : '○'} One number
                  </span>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition disabled:opacity-50"
              >
                {loading ? 'Resetting...' : '🔒 Reset Password'}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-sm inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Login</span>
            </Link>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? <a href="#" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Contact Support</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
