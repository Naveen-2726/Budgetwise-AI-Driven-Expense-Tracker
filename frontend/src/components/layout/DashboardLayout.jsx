import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    Sparkles,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Target,
    Award,
    ChevronLeft,
    Settings
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import NotificationBell from '../ui/NotificationBell';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
        { name: 'Budgets', href: '/dashboard/budgets', icon: PiggyBank },
        { name: 'Goals', href: '/dashboard/goals', icon: Target },
        { name: 'Achievements', href: '/dashboard/achievements', icon: Award },
        { name: 'AI Insights', href: '/dashboard/ai', icon: Sparkles },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                        BudgetWise
                    </span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                                    isActive
                                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                                )}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className={clsx("mr-3 h-5 w-5", isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400 dark:text-gray-500")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="mr-3 h-5 w-5 text-yellow-500" />
                                Light Mode
                            </>
                        ) : (
                            <>
                                <Moon className="mr-3 h-5 w-5 text-primary-600" />
                                Dark Mode
                            </>
                        )}
                    </button>

                    <div className="flex items-center px-4">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">
                            {user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={logout}>
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header for both Mobile and Desktop */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Mobile/Tablet Header (lg:hidden) */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 mr-4"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Back Button for Mobile */}
                        {location.pathname !== '/dashboard' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        )}

                        <span className="font-semibold text-gray-900 dark:text-white">BudgetWise</span>
                    </div>

                    {/* Desktop Header (hidden lg:flex) */}
                    <div className="hidden lg:flex items-center">
                        {location.pathname !== '/dashboard' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(-1)}
                                className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            >
                                <ChevronLeft className="mr-1 h-5 w-5" />
                                Back
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <NotificationBell />
                        {/* Add UserProfile dropdown or other header items here if needed */}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
