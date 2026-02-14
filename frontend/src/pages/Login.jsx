import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      setShowOtp(true);
      setResendTimer(30);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      setResendTimer(30);
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (isVerifyingRef.current) {
      console.log('OTP verification already in progress, ignoring duplicate request');
      return;
    }
    isVerifyingRef.current = true;
    setLoading(true);
    setError('');
    try {
      const response = await verifyOtp(email, otp);
      console.log('Login OTP Verification Success:', response);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login OTP Verification Error:', err);
      setError('Invalid or expired OTP');
    } finally {
      setLoading(false);
      isVerifyingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <BackButton />
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">BudgetWise</span>
          </Link>
        </div>

        <motion.div 
          initial={{ boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
          whileHover={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 backdrop-blur-sm"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Welcome Back!</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to continue</p>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}
          
          {!showOtp ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-5 rounded-xl">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">OTP sent to {email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">Enter 6-Digit Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full py-5 px-6 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-center text-4xl tracking-widest font-black focus:ring-2 focus:ring-green-500"
                  maxLength="6"
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : '✓ Verify & Sign In'}
              </button>
              
              <button
                type="button"
                onClick={() => { setShowOtp(false); setOtp(''); setError(''); }}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 font-semibold py-2"
              >
                ← Back
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="text-sm font-semibold disabled:opacity-50"
                >
                  {resendTimer > 0 ? (
                    <span className="text-gray-500">Resend in {resendTimer}s</span>
                  ) : (
                    <span className="text-blue-600">🔄 Resend Code</span>
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account? <Link to="/register" className="text-blue-600 font-bold">Create Account</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
