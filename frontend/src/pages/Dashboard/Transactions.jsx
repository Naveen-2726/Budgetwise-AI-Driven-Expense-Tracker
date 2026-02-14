import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus, Search, Filter, ChevronLeft, ChevronRight, Edit2, Trash2, Download } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import TransactionModal from '../../components/modals/TransactionModal';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/transactions/paged?page=${page}&size=10`);
            setTransactions(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const handleExport = async () => {
        try {
            const response = await api.get('/transactions/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Transactions exported successfully');
        } catch (error) {
            toast.error('Failed to export transactions');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                toast.success('Transaction deleted');
                fetchTransactions();
            } catch (error) {
                toast.error('Failed to delete transaction');
            }
        }
    };

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedTransaction(null);
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                <div className="flex space-x-3">
                    <Button variant="secondary" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Add Transaction
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No transactions found</td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(t.transactionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {t.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {t.category ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                                                    {t.category.emoji} {t.category.name}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {t.paymentMethod.replace('_', ' ')}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${t.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {t.type === 'INCOME' ? '+' : '-'}${t.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(t)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</Button>
                        <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{page + 1}</span> of <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <TransactionModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                transaction={selectedTransaction}
                onSuccess={fetchTransactions}
            />
        </div>
    );
}
