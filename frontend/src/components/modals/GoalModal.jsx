import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function GoalModal({ isOpen, onClose, goal, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        deadline: '',
        color: '#10B981', // Default green
        icon: '🎯'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (goal) {
            setFormData({
                name: goal.name,
                targetAmount: goal.targetAmount,
                deadline: goal.deadline || '',
                color: goal.color || '#10B981',
                icon: goal.icon || '🎯'
            });
        } else {
            setFormData({
                name: '',
                targetAmount: '',
                deadline: '',
                color: '#10B981',
                icon: '🎯'
            });
        }
    }, [goal, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                targetAmount: parseFloat(formData.targetAmount)
            };

            if (goal) {
                await api.put(`/goals/${goal.id}`, payload);
                toast.success('Goal updated successfully');
            } else {
                await api.post('/goals', payload);
                toast.success('Goal created successfully');
            }
            onSuccess();
            onClose();
        } catch (error) {
            toast.error('Failed to save goal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:border dark:border-gray-700">
                    <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                {goal ? 'Edit Goal' : 'Create New Goal'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Goal Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="e.g. New Laptop"
                            />
                            <Input
                                label="Target Amount ($)"
                                type="number"
                                step="0.01"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                                required
                                placeholder="0.00"
                            />
                            <Input
                                label="Deadline (Optional)"
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                                <div className="flex gap-2">
                                    {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`w-8 h-8 rounded-full border-2 ${formData.color === c ? 'border-gray-600 dark:border-gray-300' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setFormData({ ...formData, color: c })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <Button type="submit" className="w-full sm:col-start-2" isLoading={loading}>
                                    {goal ? 'Update Goal' : 'Create Goal'}
                                </Button>
                                <Button type="button" variant="secondary" className="mt-3 w-full sm:mt-0 sm:col-start-1" onClick={onClose}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
