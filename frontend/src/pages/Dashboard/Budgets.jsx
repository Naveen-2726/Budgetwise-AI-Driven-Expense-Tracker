import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Edit2, Trash2, PiggyBank } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import BudgetModal from '../../components/modals/BudgetModal';

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    const fetchBudgets = async () => {
        setLoading(true);
        try {
            const response = await api.get('/budgets');
            setBudgets(response.data);
        } catch (error) {
            toast.error('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await api.delete(`/budgets/${id}`);
                toast.success('Budget deleted');
                fetchBudgets();
            } catch (error) {
                toast.error('Failed to delete budget');
            }
        }
    };

    const handleEdit = (budget) => {
        setSelectedBudget(budget);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedBudget(null);
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Set Budget
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : budgets.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                        <PiggyBank className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No budgets</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new budget.</p>
                        <div className="mt-6">
                            <Button onClick={handleCreate}>Create Budget</Button>
                        </div>
                    </div>
                ) : (
                    budgets.map((budget) => {
                        const spent = budget.spent || 0;
                        const limit = budget.amount || 0;
                        const percentage = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
                        const isOverBudget = spent > limit;

                        return (
                            <Card key={budget.id} className="p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                    <button onClick={() => handleEdit(budget)} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(budget.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <PiggyBank className="text-indigo-600 dark:text-indigo-400 h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        {budget.category ? budget.category.name : 'General'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Budget Limit</p>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">${Number(limit).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        {budget.startDate && budget.endDate
                                            ? `${new Date(budget.startDate).toLocaleDateString()} - ${new Date(budget.endDate).toLocaleDateString()}`
                                            : 'Current month'
                                        }
                                    </p>
                                </div>

                                {/* Spending Progress */}
                                <div className="mb-2 flex justify-between text-xs">
                                    <span className={isOverBudget ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                                        ${Number(spent).toLocaleString('en-US', { minimumFractionDigits: 2 })} spent
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">{percentage.toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                    ></div>
                                </div>
                                {isOverBudget && (
                                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                                        Over budget by ${(spent - limit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </p>
                                )}
                            </Card>
                        );
                    })
                )}
            </div>

            <BudgetModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                budget={selectedBudget}
                onSuccess={fetchBudgets}
            />
        </div>
    );
}
