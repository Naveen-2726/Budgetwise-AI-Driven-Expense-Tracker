import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Target, Calendar, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import GoalModal from '../../components/modals/GoalModal';
import ContributionModal from '../../components/modals/ContributionModal';

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [contributionModalOpen, setContributionModalOpen] = useState(false);
    const [contributionGoal, setContributionGoal] = useState(null);

    const fetchGoals = async () => {
        setLoading(true);
        try {
            const response = await api.get('/goals');
            setGoals(response.data);
        } catch (error) {
            toast.error('Failed to load goals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await api.delete(`/goals/${id}`);
                toast.success('Goal deleted');
                fetchGoals();
            } catch (error) {
                toast.error('Failed to delete goal');
            }
        }
    };

    const handleEdit = (goal) => {
        setSelectedGoal(goal);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedGoal(null);
        setModalOpen(true);
    };

    const handleContribute = (goal) => {
        setContributionGoal(goal);
        setContributionModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Savings Goals</h1>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Goal
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading goals...</div>
            ) : goals.length === 0 ? (
                <Card className="p-10 text-center">
                    <div className="flex justify-center mb-4">
                        <Target className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No goals yet</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Set a savings target to track your progress.</p>
                    <div className="mt-6">
                        <Button onClick={handleCreate}>Create your first goal</Button>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                        return (
                            <Card key={goal.id} className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl mr-3"
                                            style={{ backgroundColor: `${goal.color}20`, color: goal.color || '#10B981' }}
                                        >
                                            {goal.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                {goal.deadline && (
                                                    <>
                                                        <Calendar size={12} className="mr-1" />
                                                        {new Date(goal.deadline).toLocaleDateString()}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button onClick={() => handleEdit(goal)} className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(goal.id)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">${goal.currentAmount.toLocaleString()}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">${goal.targetAmount.toLocaleString()}</span>
                                </div>

                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                                    <div
                                        className="h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${progress}%`, backgroundColor: goal.color || '#10B981' }}
                                    ></div>
                                </div>

                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleContribute(goal)}>
                                    Add Contribution
                                </Button>
                            </Card>
                        );
                    })}
                </div>
            )}

            <GoalModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                goal={selectedGoal}
                onSuccess={fetchGoals}
            />

            <ContributionModal
                isOpen={contributionModalOpen}
                onClose={() => setContributionModalOpen(false)}
                goal={contributionGoal}
                onSuccess={fetchGoals}
            />
        </div>
    );
}
