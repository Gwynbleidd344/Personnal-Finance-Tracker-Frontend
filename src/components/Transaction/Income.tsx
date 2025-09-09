import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaList, FaPlus, FaSearch, FaThLarge } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import TransactionCard from './TransactionCard';
import type { Transaction } from './Types';

type ActionsModel = {
    status: boolean;
    isDeleting: boolean;
};

export default function Income() {
    const { t } = useTranslation();
    const [view, setView] = useState<'grid' | 'list'>(
        () =>
            (localStorage.getItem('transactionView') as 'grid' | 'list') ||
            'grid',
    );

    const toggleView = () => {
        const newView = view === 'grid' ? 'list' : 'grid';
        setView(newView);
        localStorage.setItem('transactionView', newView);
    };

    const isModifying = useRef<ActionsModel>({
        status: false,
        isDeleting: false,
    });
    const cardIdRef = useRef<string>('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        isModifying.current = { status: false, isDeleting: false };
        cardIdRef.current = '';
        setIsModalOpen(false);
    };

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const token = localStorage.getItem('accessToken');

    const [searchTerm, setSearchTerm] = useState('');
    const filteredTransactions = transactions.filter((t) => {
        const matchesSearch =
            t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });
    const fetchTransactions = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incomes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const formatted: Transaction[] = data.map((item: any) => ({
                id: item.id,
                name: item.description || item.source,
                amount: parseFloat(item.amount),
                date: item.income_date,
                type: 'income',
                source: item.source,
            }));
            setTransactions(formatted);
        } catch (err) {
            console.error('Error fetching incomes:', err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    const handleAddTransaction = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const amount = parseFloat(formData.get('amount') as string);
        const date = formData.get('date') as string;
        const source = formData.get('source') as string;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incomes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount,
                    date,
                    source,
                    description: name,
                }),
            });

            if (!res.ok) throw new Error('Error creating income');

            await fetchTransactions();
            closeModal();
            form.reset();
        } catch (error) {
            console.error('Failed to add income:', error);
        }
    };

    const handleUpdateTransaction = (
        e: React.FormEvent<HTMLFormElement>,
        incomeId: string,
    ) => {
        e.preventDefault();
        incomeId = cardIdRef.current;
        const form = e.currentTarget;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const amount = parseFloat(formData.get('amount') as string);
        const date = formData.get('date') as string;
        const source = formData.get('source') as string;

        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/incomes/` + incomeId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount,
                    date,
                    source,
                    description: name,
                }),
            })
                .then(() => fetchTransactions())
                .catch(() => console.log('Error while updating'))
                .finally(() => {
                    closeModal();
                    form.reset();
                });
        } catch (error) {
            console.error('Failed to add income:', error);
        }
    };

    const handleDeleteTransaction = (
        e: React.FormEvent<HTMLFormElement>,
        incomeId: string,
    ) => {
        e.preventDefault();
        incomeId = cardIdRef.current;
        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/incomes/` + incomeId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => fetchTransactions())
                .catch(() => console.log('Error while updating'))
                .finally(() => {
                    closeModal();
                });
        } catch (error) {
            console.error('Failed to add income:', error);
        }
    };

    return (
        <div className="z-50 flex h-[96vh] dark:border-2 dark:border-gray-800 w-full flex-col items-center rounded-lg  bg-gray-100 dark:bg-gray-900">
            <div className="flex min-h-full w-full max-w-7xl flex-col rounded-2xl p-6">
                {/* Header */}
                <div className="flex flex-col border-b border-gray-300 dark:text-gray-100 dark:border-gray-500 pb-2 text-3xl font-bold md:flex-row md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold">{t('incomes','Incomes')}</h1>

                    <div className="flex flex-col md:flex-row md:items-center md:space-x-2 space-y-2 md:space-y-0">
                        {/* Add Button */}
                        <button
                            onClick={openModal}
                            className="flex items-center cursor-pointer gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-800 text-lg font-medium shadow-sm transition-all duration-200 hover:bg-gray-300 hover:shadow-md active:scale-95"
                        >
                                <FaPlus className="text-gray-600 text-lg" />
                                <span>{t('add', 'Add')}</span>
                        </button>

                        {/* Search Input */}
                        <div className="relative flex items-center w-full md:w-64">
                            <FaSearch className="pointer-events-none absolute left-3 text-gray-600 text-lg" />
                            <input
                                type="text"
                                className="h-12 w-full rounded-lg bg-gray-200 pl-10 pr-4 text-lg text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                                placeholder={t('search', 'Search')}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* View Toggle Button */}
                        <button
                            onClick={toggleView}
                            className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-gray-200 text-gray-800 transition hover:bg-gray-300 active:scale-95"
                        >
                            {view === 'grid' ? <FaList /> : <FaThLarge />}
                        </button>
                    </div>

                </div>

                {/* Liste des revenus */}
                <AnimatePresence>
                    <motion.div
                        layout
                        className={`mt-6 w-full overflow-y-auto pt-3 pb-10 ${view === 'grid'
                            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                            : 'flex flex-col space-y-4'
                            }`}
                        style={{ maxHeight: 'calc(100vh - 220px)' }}
                    >
                        <AnimatePresence>
                            {filteredTransactions.map((t) => (
                                <motion.div
                                    layout
                                    key={t.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.1, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <TransactionCard
                                        transaction={t}
                                        view={view}
                                        actions={{
                                            onChange() {
                                                isModifying.current = {
                                                    status: true,
                                                    isDeleting: false,
                                                };
                                                cardIdRef.current = t.id;
                                                openModal();
                                            },
                                            onDelete() {
                                                isModifying.current = {
                                                    status: true,
                                                    isDeleting: true,
                                                };
                                                cardIdRef.current = t.id;
                                                openModal();
                                            },
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        {/* Modal Header */}
                        <h2 className="mb-4 text-2xl font-bold text-gray-800">
                            {isModifying.current.status
                                ? isModifying.current.isDeleting
                                    ? t('delete', 'Delete')
                                    : t('update', 'Update')
                                : t('add_new', 'Add New')}{' '}{t('income', 'Income')}
                        </h2>

                        {/* Form */}
                        <form
                            className="flex flex-col space-y-4"
                            onSubmit={(e) =>
                                isModifying.current.status
                                    ? isModifying.current.isDeleting
                                        ? handleDeleteTransaction(e, cardIdRef.current)
                                        : handleUpdateTransaction(e, cardIdRef.current)
                                    : handleAddTransaction(e)
                            }
                        >
                            {!isModifying.current.isDeleting && (
                                <>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder={t('name', 'Name')}
                                        className="rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                        required
                                    />
                                    <input
                                        name="amount"
                                        type="number"
                                        placeholder={t('amount', 'Amount')}
                                        className="rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                        required
                                    />
                                    <input
                                        name="date"
                                        type="date"
                                        className="rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                        required
                                    />
                                    <input
                                        name="source"
                                        type="text"
                                        placeholder={t('source', 'Source')}
                                        className="rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                        required
                                    />
                                </>
                            )}

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800 font-medium hover:bg-gray-300 transition"
                                    >
                                        {t('cancel', 'Cancel')}
                                    </button>
                                <button
                                    type="submit"
                                    className={`rounded-lg px-5 py-2 font-medium text-white transition ${isModifying.current.isDeleting
                                        ? 'bg-red-700 hover:bg-red-800'
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                        }`}
                                >
                                    {isModifying.current.status
                                        ? isModifying.current.isDeleting
                                            ? t('delete', 'Delete')
                                            : t('update', 'Update')
                                        : t('add', 'Add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
