import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { X } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function TransactionModal({ isOpen, onClose, transaction, onSuccess }) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'EXPENSE',
        paymentMethod: 'CASH',
        transactionDate: new Date().toISOString().split('T')[0],
        categoryId: '',
        isRecurring: false,
        recurringFrequency: 'MONTHLY'
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description,
                amount: transaction.amount,
                type: transaction.type,
                paymentMethod: transaction.paymentMethod,
                transactionDate: transaction.transactionDate ? transaction.transactionDate.split('T')[0] : new Date().toISOString().split('T')[0],
                categoryId: transaction.category?.id || ''
            });
        } else {
            setFormData({
                description: '',
                amount: '',
                type: 'EXPENSE',
                paymentMethod: 'CASH',
                transactionDate: new Date().toISOString().split('T')[0],
                categoryId: '',
                isRecurring: false,
                recurringFrequency: 'MONTHLY'
            });
        }
    }, [transaction, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            ...formData,
            categoryId: formData.categoryId === '' ? null : formData.categoryId
        };

        try {
            if (transaction) {
                await api.put(`/transactions/${transaction.id}`, payload);
                toast.success('Transaction updated');
            } else {
                await api.post('/transactions', payload);
                toast.success('Transaction created');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save transaction');
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden dark:border dark:border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {transaction ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Input
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        placeholder="e.g. Groceries"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            placeholder="0.00"
                        />

                        <div className="w-full">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                            <input
                                type="date"
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                value={formData.transactionDate}
                                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="w-full">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                            <select
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="EXPENSE">Expense</option>
                                <option value="INCOME">Income</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="w-full">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                        <select
                            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                            value={formData.paymentMethod}
                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        >
                            <option value="CASH">Cash</option>
                            <option value="CREDIT_CARD">Credit Card</option>
                            <option value="DEBIT_CARD">Debit Card</option>
                            <option value="DIGITAL_WALLET">Digital Wallet</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    {!transaction && (
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <div className="flex items-center mb-4">
                                <input
                                    id="recurring"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                    checked={formData.isRecurring}
                                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                                />
                                <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Make this a recurring transaction
                                </label>
                            </div>

                            {formData.isRecurring && (
                                <div className="w-full bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
                                    <select
                                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                                        value={formData.recurringFrequency}
                                        onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
                                        required={formData.isRecurring}
                                    >
                                        <option value="DAILY">Daily</option>
                                        <option value="WEEKLY">Weekly</option>
                                        <option value="MONTHLY">Monthly</option>
                                        <option value="YEARLY">Yearly</option>
                                    </select>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        A recurring rule will be created starting from the selected date.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
