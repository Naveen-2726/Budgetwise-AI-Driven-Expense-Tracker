import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Shield,
    Zap,
    TrendingUp,
    Target,
    Sparkles,
    Brain,
    PiggyBank,
    BarChart3,
    Sun,
    Moon,
    Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                BudgetWise
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-lg font-medium h-10 px-4 py-2 bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
                            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                                AI-Powered Financial Management
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                        >
                            Take Control of Your
                            <span className="block bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                                Financial Future
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 dark:text-gray-300 mb-10"
                        >
                            Smart budgeting, intelligent insights, and automated tracking.
                            Achieve your financial goals with AI-powered guidance.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link to="/signup">
                                <Button size="lg" className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-lg px-8">
                                    Start Free Trial
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                                    View Demo
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                    >
                        {[
                            { value: '10K+', label: 'Active Users' },
                            { value: '$2M+', label: 'Money Saved' },
                            { value: '99%', label: 'Satisfaction' }
                        ].map((stat, index) => (
                            <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                                <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Powerful features to manage your finances effortlessly
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Brain,
                                title: 'AI-Powered Insights',
                                description: 'Get personalized financial advice and spending predictions',
                                gradient: 'from-purple-500 to-pink-500'
                            },
                            {
                                icon: Shield,
                                title: 'Bank-Grade Security',
                                description: 'Your data is protected with enterprise-level encryption',
                                gradient: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: Target,
                                title: 'Smart Goals',
                                description: 'Set and track financial goals with intelligent recommendations',
                                gradient: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: Zap,
                                title: 'Real-Time Tracking',
                                description: 'Monitor expenses and income with automatic categorization',
                                gradient: 'from-yellow-500 to-orange-500'
                            },
                            {
                                icon: BarChart3,
                                title: 'Advanced Analytics',
                                description: 'Visualize your financial data with beautiful charts',
                                gradient: 'from-indigo-500 to-purple-500'
                            },
                            {
                                icon: PiggyBank,
                                title: 'Budget Management',
                                description: 'Create and manage budgets with smart alerts',
                                gradient: 'from-pink-500 to-rose-500'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-12 text-center shadow-xl">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Finances?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of users achieving their financial goals
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left max-w-2xl mx-auto">
                            {[
                                'Unlimited transactions',
                                'AI-powered insights',
                                'Budget tracking',
                                'Goal management',
                                'Secure & encrypted',
                                'Mobile friendly'
                            ].map((benefit, index) => (
                                <div key={index} className="flex items-center space-x-3 text-white">
                                    <Check className="w-5 h-5" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/signup">
                            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 shadow-lg">
                                Get Started for Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2026 BudgetWise. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
