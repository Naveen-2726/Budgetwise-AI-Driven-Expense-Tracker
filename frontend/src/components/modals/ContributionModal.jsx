import React, { useState, useEffect } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function ContributionModal({ isOpen, onClose, goal, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) setAmount('');
    }, [isOpen]);

    if (!isOpen || !goal) return null;

    const remaining = goal.targetAmount - goal.currentAmount;
    const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (!val || val <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        setLoading(true);
        try {
            await api.post(`/goals/${goal.id}/contribute`, { amount: val });
            toast.success(`$${val.toLocaleString()} added to "${goal.name}"!`);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add contribution');
        } finally {
            setLoading(false);
        }
    };

    // Handle Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden dark:border dark:border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${goal.color}20`, color: goal.color || '#10B981' }}
                        >
                            {goal.icon}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Contribution</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{goal.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Progress display */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Current</span>
                            <span className="text-gray-600 dark:text-gray-400">Target</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-gray-900 dark:text-white">${goal.currentAmount.toLocaleString()}</span>
                            <span className="text-gray-900 dark:text-white">${goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                            <div
                                className="h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%`, backgroundColor: goal.color || '#10B981' }}
                            ></div>
                        </div>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            ${remaining.toLocaleString()} remaining ({progress.toFixed(1)}% complete)
                        </p>
                    </div>

                    <Input
                        label="Contribution Amount ($)"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        placeholder="0.00"
                    />

                    {/* Quick amount buttons */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Quick Add</label>
                        <div className="flex gap-2">
                            {[10, 25, 50, 100].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(String(val))}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                        amount === String(val)
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-600'
                                            : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    ${val}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Contribute
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
