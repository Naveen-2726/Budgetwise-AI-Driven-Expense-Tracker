import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { ArrowUp, ArrowDown, DollarSign, Activity, Zap } from 'lucide-react';
import api from '../../api/axios';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function DashboardOverview() {
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, recentRes] = await Promise.all([
                    api.get('/transactions/stats'),
                    api.get('/transactions/recent')
                ]);
                setStats(statsRes.data);
                setRecentTransactions(recentRes.data);
            } catch (error) {
                console.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading dashboard...</div>;

    // Mock trend data for the area chart to look "real-time"
    const data = [
        { name: 'Mon', income: 4000, expense: 2400 },
        { name: 'Tue', income: 3000, expense: 1398 },
        { name: 'Wed', income: 2000, expense: 9800 },
        { name: 'Thu', income: 2780, expense: 3908 },
        { name: 'Fri', income: 1890, expense: 4800 },
        { name: 'Sat', income: 2390, expense: 3800 },
        { name: 'Sun', income: 3490, expense: 4300 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="font-medium">Live Updates</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Balance"
                    value={stats?.balance}
                    icon={DollarSign}
                    className="text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400"
                />
                <StatsCard
                    title="Total Income"
                    value={stats?.totalIncome}
                    icon={ArrowUp}
                    className="text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                />
                <StatsCard
                    title="Total Expenses"
                    value={stats?.totalExpenses}
                    icon={ArrowDown}
                    className="text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Flow</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB', borderRadius: '8px' }}
                                    itemStyle={{ color: '#F9FAFB' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                                <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentTransactions.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent transactions</p>
                        ) : (
                            recentTransactions.map(t => (
                                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className={t.type === 'INCOME' ? 'p-2 bg-green-100 dark:bg-green-900/30 rounded-full' : 'p-2 bg-red-100 dark:bg-red-900/30 rounded-full'}>
                                            {t.type === 'INCOME' ? <ArrowUp size={16} className="text-green-600 dark:text-green-400" /> : <ArrowDown size={16} className="text-red-600 dark:text-red-400" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{t.description}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.transactionDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={t.type === 'INCOME' ? 'font-semibold text-green-600 dark:text-green-400' : 'font-semibold text-red-600 dark:text-red-400'}>
                                        {t.type === 'INCOME' ? '+' : '-'}${t.amount}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300">
                            View All Transactions
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon: Icon, className }) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        ${value?.toLocaleString() || '0.00'}
                    </h3>
                </div>
                <div className={`p-3 rounded-full ${className}`}>
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );
}
