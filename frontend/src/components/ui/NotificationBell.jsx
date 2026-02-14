import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'WARNING': return <AlertTriangle className="text-yellow-500" size={18} />;
            case 'SUCCESS': return <CheckCircle className="text-green-500" size={18} />;
            case 'GOAL_REACHED': return <Target className="text-indigo-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={clsx(
                                            "p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer",
                                            !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                                        )}
                                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={clsx("text-sm font-medium", notification.isRead ? "text-gray-900 dark:text-white" : "text-gray-900 dark:text-white")}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="flex-shrink-0 self-center">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
