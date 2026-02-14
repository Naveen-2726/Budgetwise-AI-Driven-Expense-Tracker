import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import BackButton from '../components/BackButton';

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <BackButton />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">BudgetWise</span>
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wide uppercase">AI Finance Manager</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Toggle theme"
              >
                <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
              </button>
              <Link 
                to="/login" 
                className="hidden sm:block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-5 py-2 font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 px-5 py-2.5 rounded-full mb-8 shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 cursor-default"
            >
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-lg"
              >
                🚀
              </motion.span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">AI-Powered Financial Intelligence</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              Take Control of<br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Your Financial Future
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Smart expense tracking with AI-powered insights. Track, analyze, and optimize your spending with intelligent recommendations tailored for you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register" 
                  className="group bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <motion.span 
                    className="relative z-10 group-hover:translate-x-1 transition-transform"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>▶️</span>
                Watch Demo
              </motion.button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Free 30-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
          </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative max-w-6xl mx-auto"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-3xl blur-3xl opacity-10"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-gray-900/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Dashboard Preview</div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring" }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 p-6 rounded-2xl text-white shadow-xl shadow-red-500/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold opacity-90">Monthly Expenses</p>
                    <motion.span 
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-2xl"
                    >
                      💸
                    </motion.span>
                  </div>
                  <p className="text-4xl font-black">$2,847</p>
                  <p className="text-xs mt-2 opacity-75">↑ 12% from last month</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 rounded-2xl text-white shadow-xl shadow-green-500/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold opacity-90">Monthly Income</p>
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl"
                    >
                      💰
                    </motion.span>
                  </div>
                  <p className="text-4xl font-black">$5,200</p>
                  <p className="text-xs mt-2 opacity-75">↑ 8% from last month</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 rounded-2xl text-white shadow-xl shadow-blue-500/30 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold opacity-90">Total Savings</p>
                    <motion.span 
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="text-2xl"
                    >
                      🎯
                    </motion.span>
                  </div>
                  <p className="text-4xl font-black">$2,353</p>
                  <p className="text-xs mt-2 opacity-75">↑ 5% from last month</p>
                </motion.div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Analytics</h3>
                  <span className="text-5xl">📊</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="flex-1 h-3 bg-blue-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{width: '70%'}}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">70%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div className="flex-1 h-3 bg-purple-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{width: '50%'}}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">50%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <div className="flex-1 h-3 bg-pink-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{width: '35%'}}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">35%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                Smart Financial Management
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to take control of your finances in one beautiful platform
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group"
            >
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30"
              >
                <span className="text-3xl">🤖</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Get personalized spending recommendations powered by advanced AI algorithms that learn from your habits</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
            >
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/30"
              >
                <span className="text-3xl">📊</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-Time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Beautiful charts and visualizations that update instantly as you track your expenses and income</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 group"
            >
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-green-500/30"
              >
                <span className="text-3xl">🔒</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Bank-Level Security</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Your financial data is protected with encryption, 2FA authentication, and secure JWT tokens</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group"
            >
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/30"
              >
                <span className="text-3xl">💳</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Categorization</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Automatically categorize your transactions using intelligent pattern recognition technology</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 group"
            >
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-pink-500/30"
              >
                <span className="text-3xl">🎯</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Budget Goals & Alerts</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Set financial goals and receive smart alerts to keep your spending on track</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/30"
              >
                <span className="text-3xl">📱</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cross-Platform Access</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Access your finances from any device with responsive design and real-time cloud sync</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              className="p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-default"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2"
              >
                50K+
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold text-sm">Active Users</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              className="p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-default"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2"
              >
                $10M+
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold text-sm">Money Tracked</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              className="p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-default"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2"
              >
                4.9★
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold text-sm">User Rating</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1 }}
              className="p-6 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-default"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2"
              >
                99.9%
              </motion.div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold text-sm">Uptime SLA</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-black text-white mb-6"
            >
              Ready to Transform Your
              <span className="block">Financial Future?</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto"
            >
              Join over 50,000 users who are already managing their finances smarter with AI-powered insights
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-200 group relative overflow-hidden"
                >
                  <span className="relative z-10">Start Your Free Trial</span>
                  <motion.span 
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                  <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-200 shadow-lg"
              >
                <span>📞</span>
                Contact Sales
              </motion.button>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-sm text-blue-100 mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="flex items-center gap-1">
                <span>✓</span> No credit card required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>✓</span> Cancel anytime
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>✓</span> 30-day money-back guarantee
              </span>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="text-xl">💰</span>
                </div>
                <span className="text-xl font-black text-gray-900 dark:text-white">BudgetWise</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">AI-powered financial management that helps you achieve your goals</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2025 BudgetWise. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
