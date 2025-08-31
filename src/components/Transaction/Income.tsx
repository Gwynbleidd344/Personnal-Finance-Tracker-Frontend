import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaList, FaPlus, FaSearch, FaThLarge } from 'react-icons/fa';
import TransactionCard from './TransactionCard';
import type { Transaction } from './Types';

type ActionsModel = {
    status: boolean;
    isDeleting: boolean;
};

export default function Income() {
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

    const fetchTransactions = async () => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost:8080/api/income', {
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
            const res = await fetch('http://localhost:8080/api/income', {
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
            fetch('http://localhost:8080/api/income/' + incomeId, {
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
            fetch('http://localhost:8080/api/income/' + incomeId, {
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
        <div className="z-50 flex h-[94vh] w-full flex-col items-center rounded-lg bg-gray-100">
            <div className="flex min-h-full w-full max-w-7xl flex-col rounded-2xl p-6">
                {/* Header */}
                <div className="flex flex-col border-b border-gray-300 pb-2 text-3xl font-bold md:flex-row md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold">Expense Tracker</h1>

                    <div className="flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                        {/* Search */}
                        <button
                            onClick={openModal}
                            className="flex h-11 items-center space-x-2 rounded bg-emerald-600 px-3 py-1 text-xl text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
                        >
                            <FaPlus className="pointer-events-none left-3 text-xl" />
                            <p className="text-lg">Add </p>
                        </button>
                        <div className="relative flex items-center">
                            <FaSearch className="pointer-events-none absolute left-3 text-xl text-gray-800" />
                            <input
                                type="text"
                                className="h-11 w-60 rounded-lg border-none bg-gray-200 pl-10 text-xl text-gray-800 placeholder-gray-800/70 outline-none"
                                placeholder="Search"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                            <button
                                onClick={toggleView}
                                className="flex h-11 w-11 items-center justify-center rounded border border-gray-300 bg-gray-200 text-gray-800 transition hover:bg-gray-300 active:scale-95"
                            >
                                {view === 'grid' ? <FaList /> : <FaThLarge />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des revenus */}
                <AnimatePresence>
                    <motion.div
                        layout
                        className={`mt-6 w-full overflow-y-auto pt-3 pl-2 ${
                            view === 'grid'
                                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                                : 'flex flex-col space-y-4'
                        }`}
                        style={{ maxHeight: 'calc(100vh - 220px)' }}
                    >
                        <AnimatePresence>
                            {transactions.map((t) => (
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
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-3 text-2xl font-bold">
                            {isModifying.current.status
                                ? isModifying.current.isDeleting
                                    ? 'Delete'
                                    : 'Update'
                                : 'Add New'}{' '}
                            Income
                        </h2>
                        <form
                                className="flex flex-col space-y-4"
                            onSubmit={(e) =>
                                isModifying.current.status
                                    ? isModifying.current.isDeleting
                                        ? handleDeleteTransaction(
                                              e,
                                              cardIdRef.current,
                                          )
                                        : handleUpdateTransaction(
                                              e,
                                              cardIdRef.current,
                                          )
                                    : handleAddTransaction(e)
                            }
                        >
                            {!isModifying.current.isDeleting && (
                                <>
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        className="rounded border p-2"
                                        required
                                    />
                                    <input
                                        name="amount"
                                        type="number"
                                        placeholder="Amount"
                                        className="rounded border p-2"
                                        required
                                    />
                                    <input
                                        name="date"
                                        type="date"
                                        className="rounded border p-2"
                                        required
                                    />
                                    <input
                                        name="source"
                                        type="text"
                                        placeholder="Source"
                                        className="rounded border p-2"
                                        required
                                    />
                                </>
                            )}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded bg-gray-300 px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={
                                        'rounded ' +
                                        (isModifying.current.isDeleting
                                            ? 'bg-neutral-950/90'
                                            : 'bg-emerald-600') +
                                        ' px-4 py-2 text-white'
                                    }
                                >
                                    {isModifying.current.status
                                        ? isModifying.current.isDeleting
                                            ? 'Delete'
                                            : 'Update'
                                        : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
