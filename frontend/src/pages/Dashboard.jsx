import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIInsights from '../components/AIInsights';
import BackButton from '../components/BackButton';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    description: '',
    amount: '',
    categoryId: '',
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0]
  });
  const [profileEdit, setProfileEdit] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [transRes, catRes] = await Promise.all([
        api.get('/api/transactions'),
        api.get('/api/categories')
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data);
      
      // Calculate budgets from transactions
      const budgetData = catRes.data.map(cat => {
        const spent = transRes.data
          .filter(t => t.categoryId === cat.id && t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          limit: cat.budget || 5000,
          spent
        };
      });
      setBudgets(budgetData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/transactions', {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount)
      });
      setShowAddTransaction(false);
      setTransactionForm({
        description: '',
        amount: '',
        categoryId: '',
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0]
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/api/transactions/${id}`);
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/profile', profile);
      setProfileEdit(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Calculate spending by category
  const spendingByCategory = categories.map(cat => {
    const total = transactions
      .filter(t => t.categoryId === cat.id && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: cat.name, value: total };
  }).filter(c => c.value > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'transactions', name: 'Transactions', icon: '💳' },
    { id: 'budgets', name: 'Budgets', icon: '💰' },
    { id: 'profile', name: 'Profile', icon: '👤' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-300 rounded-full opacity-20"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-indigo-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            >
              B
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BudgetWise
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.firstName || 'User'}!</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAIInsights(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🤖 AI Insights
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 border-b border-gray-200">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-500'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Total Balance</p>
                      <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{balance.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {balance >= 0 ? '+' : ''}{balance.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                      💰
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Total Income</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">
                        ₹{totalIncome.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">This month</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                      📈
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Total Expenses</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">
                        ₹{totalExpenses.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">This month</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                      📉
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Charts and Recent Transactions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending by Category */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Spending by Category</h3>
                  <div className="space-y-3">
                    {spendingByCategory.length > 0 ? (
                      spendingByCategory.map((cat, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold text-gray-700">{cat.name}</span>
                            <span className="text-gray-600">₹{cat.value.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(cat.value / totalExpenses) * 100}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No expenses yet</p>
                    )}
                  </div>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((trans, idx) => (
                        <motion.div
                          key={trans.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">{trans.description}</p>
                            <p className="text-xs text-gray-500">{new Date(trans.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`font-bold ${trans.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                            {trans.type === 'INCOME' ? '+' : '-'}₹{trans.amount}
                          </span>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No transactions yet</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Quick Add Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAddTransaction(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl hover:shadow-3xl transition-all duration-300 z-50"
              >
                +
              </motion.button>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddTransaction(true)}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  + Add Transaction
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((trans, idx) => (
                      <motion.tr
                        key={trans.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-600">{new Date(trans.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-semibold text-gray-800">{trans.description}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {categories.find(c => c.id === trans.categoryId)?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            trans.type === 'INCOME'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {trans.type}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right font-bold ${
                          trans.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trans.type === 'INCOME' ? '+' : '-'}₹{trans.amount}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteTransaction(trans.id)}
                            className="text-red-500 hover:text-red-700 font-semibold"
                          >
                            Delete
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length === 0 && (
                  <p className="text-center text-gray-500 py-12">No transactions yet. Add your first transaction!</p>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'budgets' && (
            <motion.div
              key="budgets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {budgets.map((budget, idx) => (
                <motion.div
                  key={budget.categoryId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{budget.categoryName}</h3>
                    <span className="text-gray-600">
                      ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-4 rounded-full ${
                        budget.spent > budget.limit
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : budget.spent > budget.limit * 0.8
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600'
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {budget.spent > budget.limit
                      ? `Over budget by ₹${(budget.spent - budget.limit).toLocaleString()}`
                      : `₹${(budget.limit - budget.spent).toLocaleString()} remaining`}
                  </p>
                </motion.div>
              ))}
              {budgets.length === 0 && (
                <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100 text-center">
                  <p className="text-gray-500 text-lg">No budgets set yet. Add categories to track your spending!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                  {!profileEdit && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setProfileEdit(true)}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Edit Profile
                    </motion.button>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      disabled={!profileEdit}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      disabled={!profileEdit}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {profileEdit && (
                    <div className="flex space-x-4">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Save Changes
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setProfileEdit(false);
                          setProfile({
                            firstName: user?.firstName || '',
                            lastName: user?.lastName || '',
                            email: user?.email || ''
                          });
                        }}
                        className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAddTransaction(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    required
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
                    placeholder="e.g., Grocery shopping"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    required
                    value={transactionForm.categoryId}
                    onChange={(e) => setTransactionForm({ ...transactionForm, categoryId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <div className="flex space-x-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        value="EXPENSE"
                        checked={transactionForm.type === 'EXPENSE'}
                        onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                        transactionForm.type === 'EXPENSE'
                          ? 'border-red-500 bg-red-50 font-semibold'
                          : 'border-gray-300 hover:border-red-300'
                      }`}>
                        Expense
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        value="INCOME"
                        checked={transactionForm.type === 'INCOME'}
                        onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                        transactionForm.type === 'INCOME'
                          ? 'border-green-500 bg-green-50 font-semibold'
                          : 'border-gray-300 hover:border-green-300'
                      }`}>
                        Income
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 transition-all"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Add Transaction
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddTransaction(false)}
                    className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Insights Modal */}
      <AnimatePresence>
        {showAIInsights && (
          <AIInsights
            transactions={transactions}
            onClose={() => setShowAIInsights(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
