import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, Lock, Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

export default function Settings() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(false);

    // Mock states for form fields (would be connected to API in a real app)
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put('/user/profile', {
                firstName: profileData.firstName,
                lastName: profileData.lastName
            });
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords don't match");
            return;
        }
        setLoading(true);
        try {
            await api.put('/user/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

            {/* Profile Settings */}
            <Card className="p-6">
                <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-primary-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        />
                        <Input
                            label="Last Name"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-50 dark:bg-gray-900/50"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={loading}>Save Changes</Button>
                    </div>
                </form>
            </Card>

            {/* Appearance Settings */}
            <Card className="p-6">
                <div className="flex items-center mb-4">
                    <Moon className="w-5 h-5 text-indigo-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Theme Preference</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose between light and dark mode</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => theme === 'dark' && toggleTheme()}
                            className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-white shadow text-primary-600' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <Sun size={20} />
                        </button>
                        <button
                            onClick={() => theme === 'light' && toggleTheme()}
                            className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-gray-600 shadow text-primary-400' : 'text-gray-500'}`}
                        >
                            <Moon size={20} />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Security Settings */}
            <Card className="p-6">
                <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
                </div>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <Input
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="New Password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="secondary" isLoading={loading}>Update Password</Button>
                    </div>
                </form>
            </Card>

            {/* Account Actions */}
            <Card className="p-6 border-red-100 dark:border-red-900/30">
                <div className="flex items-center mb-4">
                    <LogOut className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Session</h2>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sign Out</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account on this device</p>
                    </div>
                    <Button variant="danger" onClick={logout}>Sign Out</Button>
                </div>
            </Card>
        </div>
    );
}
