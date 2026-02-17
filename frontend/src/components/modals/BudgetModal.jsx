import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { X } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function BudgetModal({ isOpen, onClose, budget, onSuccess }) {
    const [formData, setFormData] = useState({
        amount: '',
        startDate: '',
        endDate: '',
        categoryId: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            api.get('/categories').then(res => setCategories(res.data)).catch(() => {});
        }
    }, [isOpen]);

    useEffect(() => {
        if (budget) {
            setFormData({
                amount: budget.amount,
                startDate: budget.startDate ? budget.startDate.split('T')[0] : '',
                endDate: budget.endDate ? budget.endDate.split('T')[0] : '',
                categoryId: budget.category?.id || ''
            });
        } else {
            setFormData({
                amount: '',
                startDate: '',
                endDate: '',
                categoryId: ''
            });
        }
    }, [budget, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (budget) {
                await api.put(`/budgets/${budget.id}`, formData);
                toast.success('Budget updated');
            } else {
                await api.post('/budgets', formData);
                toast.success('Budget created');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save budget');
        } finally {
            setLoading(false);
        }
    };

    // Handle Escape key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {budget ? 'Edit Budget' : 'New Budget'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Category */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select
                            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="">General (All Categories)</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.emoji} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Amount Limit"
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        placeholder="0.00"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                            <input
                                type="date"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div className="w-full">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                            <input
                                type="date"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        * Leave dates empty to default to current month.
                    </p>

                    <div className="pt-4 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
