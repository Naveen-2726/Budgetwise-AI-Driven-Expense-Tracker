import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    ArrowUp,
    ArrowDown,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    Calendar,
    BarChart3,
    PieChart as PieChartIcon,
    Activity,
    ArrowRight,
    Minus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'];

// Custom tooltip component
function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
            <p className="text-xs text-gray-400 mb-1.5 font-medium">{label}</p>
            {payload.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-gray-300 capitalize">{entry.dataKey}:</span>
                    <span className="text-white font-semibold">${Number(entry.value).toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
}

// Custom pie tooltip
function PieTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    return (
        <div className="bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
            <div className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }} />
                <span className="text-gray-300">{data.name}:</span>
                <span className="text-white font-semibold">${Number(data.value).toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{data.payload.percent}% of total</p>
        </div>
    );
}

export default function DashboardOverview() {
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, recentRes, allRes] = await Promise.all([
                    api.get('/transactions/stats'),
                    api.get('/transactions/recent'),
                    api.get('/transactions')
                ]);
                setStats(statsRes.data);
                setRecentTransactions(recentRes.data);
                setAllTransactions(allRes.data);
            } catch (error) {
                console.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── Derived data for charts ──────────────────────────────────
    const days = timeRange === '7d' ? 7 : 30;

    // Financial flow area chart (last N days)
    const flowChartData = useMemo(() => {
        const dayMap = {};
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const label = days <= 7
                ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
                : `${d.getMonth() + 1}/${d.getDate()}`;
            dayMap[key] = { name: label, income: 0, expense: 0 };
        }

        allTransactions.forEach(t => {
            const date = t.transactionDate?.split('T')[0];
            if (dayMap[date]) {
                const amt = Number(t.amount) || 0;
                if (t.type === 'INCOME') dayMap[date].income += amt;
                else dayMap[date].expense += amt;
            }
        });

        return Object.values(dayMap);
    }, [allTransactions, days]);

    // Category breakdown pie chart (expenses only)
    const categoryData = useMemo(() => {
        const catMap = {};
        let totalExpense = 0;

        allTransactions.forEach(t => {
            if (t.type !== 'EXPENSE') return;
            const amt = Number(t.amount) || 0;
            const catName = t.category?.name || 'Uncategorized';
            const emoji = t.category?.emoji || '📦';
            catMap[catName] = catMap[catName] || { name: catName, value: 0, emoji };
            catMap[catName].value += amt;
            totalExpense += amt;
        });

        return Object.values(catMap)
            .sort((a, b) => b.value - a.value)
            .slice(0, 8)
            .map((item, idx) => ({
                ...item,
                fill: COLORS[idx % COLORS.length],
                percent: totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(1) : '0'
            }));
    }, [allTransactions]);

    // Monthly comparison bar chart (last 6 months)
    const monthlyData = useMemo(() => {
        const months = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
                name: d.toLocaleString('default', { month: 'short' }),
                income: 0,
                expense: 0
            });
        }

        allTransactions.forEach(t => {
            const date = t.transactionDate?.split('T')[0];
            if (!date) return;
            const monthKey = date.substring(0, 7);
            const month = months.find(m => m.key === monthKey);
            if (month) {
                const amt = Number(t.amount) || 0;
                if (t.type === 'INCOME') month.income += amt;
                else month.expense += amt;
            }
        });

        return months;
    }, [allTransactions]);

    // Period-over-period trends
    const trends = useMemo(() => {
        const now = new Date();
        const periodMs = days * 24 * 60 * 60 * 1000;
        const periodStart = new Date(now.getTime() - periodMs);
        const prevStart = new Date(periodStart.getTime() - periodMs);

        let currentIncome = 0, currentExpense = 0;
        let prevIncome = 0, prevExpense = 0;

        allTransactions.forEach(t => {
            const d = new Date(t.transactionDate);
            const amt = Number(t.amount) || 0;
            if (d >= periodStart && d <= now) {
                if (t.type === 'INCOME') currentIncome += amt;
                else currentExpense += amt;
            } else if (d >= prevStart && d < periodStart) {
                if (t.type === 'INCOME') prevIncome += amt;
                else prevExpense += amt;
            }
        });

        const calcTrend = (cur, prev) => {
            if (prev === 0) return cur > 0 ? 100 : 0;
            return ((cur - prev) / prev * 100);
        };

        return {
            incomeTrend: calcTrend(currentIncome, prevIncome),
            expenseTrend: calcTrend(currentExpense, prevExpense),
            currentIncome,
            currentExpense,
        };
    }, [allTransactions, days]);

    // Payment method breakdown
    const paymentMethodData = useMemo(() => {
        const methodMap = {};
        allTransactions.forEach(t => {
            if (t.type !== 'EXPENSE') return;
            const method = (t.paymentMethod || 'OTHER').replace(/_/g, ' ');
            methodMap[method] = (methodMap[method] || 0) + (Number(t.amount) || 0);
        });
        return Object.entries(methodMap)
            .map(([name, value], idx) => ({ name, value, fill: COLORS[(idx + 3) % COLORS.length], percent: '0' }))
            .sort((a, b) => b.value - a.value)
            .map((item, _idx, arr) => {
                const total = arr.reduce((sum, i) => sum + i.value, 0);
                return { ...item, percent: total > 0 ? ((item.value / total) * 100).toFixed(1) : '0' };
            });
    }, [allTransactions]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your financial summary at a glance</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Time range toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        {[
                            { key: '7d', label: '7 Days' },
                            { key: '30d', label: '30 Days' },
                        ].map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setTimeRange(opt.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                    timeRange === opt.key
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                        </span>
                        <span className="font-medium text-xs">Live</span>
                    </div>
                </div>
            </div>

            {/* ── Stats Grid (4 cards) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatsCard
                    title="Total Balance"
                    value={stats?.balance}
                    icon={Wallet}
                    color="primary"
                    trend={null}
                />
                <StatsCard
                    title={`Income (${timeRange})`}
                    value={trends.currentIncome}
                    icon={ArrowUp}
                    color="green"
                    trend={trends.incomeTrend}
                    trendLabel="vs prev period"
                />
                <StatsCard
                    title={`Expenses (${timeRange})`}
                    value={trends.currentExpense}
                    icon={ArrowDown}
                    color="red"
                    trend={trends.expenseTrend}
                    trendLabel="vs prev period"
                    invertTrend
                />
                <StatsCard
                    title="Transactions"
                    value={stats?.transactionCount}
                    icon={CreditCard}
                    color="indigo"
                    isCurrency={false}
                />
            </div>

            {/* ── Row 1: Area Chart + Category Donut ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Flow — spans 2 cols */}
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Flow</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Income vs expenses over the last {days} days</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-gray-500 dark:text-gray-400">Income</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-gray-500 dark:text-gray-400">Expenses</span>
                            </span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={flowChartData}>
                                <defs>
                                    <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.15} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9CA3AF"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={days > 7 ? Math.floor(days / 7) - 1 : 0}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                                    width={50}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#10B981"
                                    strokeWidth={2.5}
                                    fill="url(#gradIncome)"
                                    dot={false}
                                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#10B981', fill: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#EF4444"
                                    strokeWidth={2.5}
                                    fill="url(#gradExpense)"
                                    dot={false}
                                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#EF4444', fill: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Category Donut */}
                <Card className="p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spending by Category</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Where your money goes</p>
                    </div>
                    {categoryData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-56 text-gray-400 dark:text-gray-600">
                            <PieChartIcon size={40} className="mb-2 opacity-50" />
                            <p className="text-sm">No expense data yet</p>
                        </div>
                    ) : (
                        <>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                            animationBegin={0}
                                            animationDuration={800}
                                        >
                                            {categoryData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<PieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-3 space-y-2 max-h-36 overflow-y-auto pr-1">
                                {categoryData.map((cat, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.fill }} />
                                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                                                {cat.emoji} {cat.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900 dark:text-white">${cat.value.toLocaleString()}</span>
                                            <span className="text-xs text-gray-400 w-10 text-right">{cat.percent}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Card>
            </div>

            {/* ── Row 2: Monthly Bar Chart + Payment Methods ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Comparison */}
                <Card className="p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Comparison</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last 6 months income vs expenses</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-indigo-500" />
                                <span className="text-gray-500 dark:text-gray-400">Income</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-rose-500" />
                                <span className="text-gray-500 dark:text-gray-400">Expenses</span>
                            </span>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.15} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9CA3AF"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
                                    width={50}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="income" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                                <Bar dataKey="expense" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Payment Methods Mini Donut */}
                <Card className="p-6 flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">How you pay for things</p>
                    </div>
                    {paymentMethodData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center flex-1 text-gray-400 dark:text-gray-600">
                            <CreditCard size={36} className="mb-2 opacity-50" />
                            <p className="text-sm">No data yet</p>
                        </div>
                    ) : (
                        <>
                            <div className="h-36">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentMethodData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={60}
                                            paddingAngle={3}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {paymentMethodData.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<PieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 space-y-2 flex-1 overflow-y-auto">
                                {paymentMethodData.map((pm, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: pm.fill }} />
                                            <span className="text-gray-700 dark:text-gray-300 text-xs capitalize">{pm.name.toLowerCase()}</span>
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white text-xs">${pm.value.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </Card>
            </div>

            {/* ── Row 3: Recent Activity ── */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your latest transactions</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/transactions')} className="text-primary-600 dark:text-primary-400">
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
                <div className="space-y-3">
                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 dark:text-gray-600">
                            <Activity size={36} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No recent transactions</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recentTransactions.map(t => (
                                <div
                                    key={t.id}
                                    className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group cursor-pointer"
                                    onClick={() => navigate('/dashboard/transactions')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-xl ${
                                            t.type === 'INCOME'
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : 'bg-red-100 dark:bg-red-900/30'
                                        }`}>
                                            {t.type === 'INCOME'
                                                ? <ArrowUp size={16} className="text-green-600 dark:text-green-400" />
                                                : <ArrowDown size={16} className="text-red-600 dark:text-red-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {t.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {t.category && (
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                                        {t.category.emoji} {t.category.name}
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {new Date(t.transactionDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-sm ${
                                        t.type === 'INCOME'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {t.type === 'INCOME' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

// ── Enhanced Stats Card ──────────────────────────────────────
function StatsCard({ title, value, icon: Icon, color, trend, trendLabel, invertTrend, isCurrency = true }) {
    const colorMap = {
        primary: {
            icon: 'text-primary-600 dark:text-primary-400',
            bg: 'bg-primary-50 dark:bg-primary-900/20',
            ring: 'ring-primary-500/20'
        },
        green: {
            icon: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            ring: 'ring-emerald-500/20'
        },
        red: {
            icon: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/20',
            ring: 'ring-red-500/20'
        },
        indigo: {
            icon: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50 dark:bg-indigo-900/20',
            ring: 'ring-indigo-500/20'
        }
    };

    const c = colorMap[color] || colorMap.primary;

    const isPositive = trend > 0;
    const isNeutral = trend === 0 || trend === null || trend === undefined;
    const trendIsGood = invertTrend ? !isPositive : isPositive;

    return (
        <Card className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1.5">
                        {isCurrency ? `$${(Number(value) || 0).toLocaleString()}` : (Number(value) || 0).toLocaleString()}
                    </h3>
                    {trend !== null && trend !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                            isNeutral
                                ? 'text-gray-400'
                                : trendIsGood
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-red-600 dark:text-red-400'
                        }`}>
                            {isNeutral ? (
                                <Minus size={12} />
                            ) : isPositive ? (
                                <TrendingUp size={12} />
                            ) : (
                                <TrendingDown size={12} />
                            )}
                            <span>{Math.abs(trend).toFixed(1)}%</span>
                            {trendLabel && <span className="text-gray-400 font-normal">{trendLabel}</span>}
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${c.bg} ring-1 ${c.ring}`}>
                    <Icon size={22} className={c.icon} />
                </div>
            </div>
        </Card>
    );
}
