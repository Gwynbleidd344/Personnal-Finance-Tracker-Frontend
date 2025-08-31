import { useEffect, useState } from 'react';
import { FaList, FaPlus, FaSearch, FaThLarge } from 'react-icons/fa';
import TransactionCard from './TransactionCard';
import type { Transaction } from './Types';

type Category = { id: string; name :string};

export default function Expense() {
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const token = localStorage.getItem('accessToken');


    const fetchCategories = async (): Promise<Category[]> => {
        if (!token) return [];
        try {
            const res = await fetch('http://localhost:8080/api/categories', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const cats: Category[] = Array.isArray(data) ? data : [];
            setCategories(cats);
            return cats;
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
            return [];
        }
    };


    const fetchExpenses = async (_cats: Category[]) => {
        if (!token) return;
        try {
            const res = await fetch('http://localhost:8080/api/expenses', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const formatted: Transaction[] = Array.isArray(data)
                ? data.map((item: any) => ({
                      id: item.id,
                      name: item.description || item.name,
                      amount: parseFloat(item.amount),
                      date: item.date,
                      type: 'expense',
                      category: item.category_fk?.name || 'Uncategorized',
                      source: item.source || '',
                  }))
                : [];
            setTransactions(formatted);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setTransactions([]);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            const _cats = await fetchCategories();
            await fetchExpenses(_cats);
        };
        fetchData();
    }, [token]);


    const handleAddTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            description: { value: string };
            amount: { value: string };
            date: { value: string };
            type: { value: string };
            categoryId: { value: string };
        };

        if (!token) return;

        const formData = new FormData();
        formData.append('description', target.description.value);
        formData.append('amount', target.amount.value);
        formData.append('date', target.date.value);
        formData.append('type', target.type.value);
        formData.append('categoryId', target.categoryId.value);

        try {
            await fetch('http://localhost:8080/api/expenses', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            await fetchExpenses(categories);
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };


    const handleUpdateTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingId || !token) return;

        const target = event.target as typeof event.target & {
            description: { value: string };
            amount: { value: string };
            date: { value: string };
            type: { value: string };
            categoryId: { value: string };
            receipt?: { files: FileList };
        };

        const formData = new FormData();
        formData.append('description', target.description.value);
        formData.append('amount', target.amount.value);
        formData.append('date', target.date.value);
        formData.append('type', target.type.value);
        formData.append('categoryId', target.categoryId.value);

        if (target.receipt?.files?.[0]) {
            formData.append('receipt', target.receipt.files[0]);
        }

        try {
            await fetch(`http://localhost:8080/api/expenses/${editingId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            await fetchExpenses(categories);
            closeModal();
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };


    const handleChangeTransaction = (id: string) => {
        setEditingId(id);
        openModal();
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!token) return;
        try {
            await fetch(`http://localhost:8080/api/expenses/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchExpenses(categories);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="z-50 flex h-[94vh] w-full flex-col items-center rounded-lg bg-gray-100">
            <div className="flex min-h-full w-full max-w-7xl flex-col rounded-2xl p-6">
                {/* Header */}
                <div className="flex flex-col border-b border-gray-300 pb-2 text-3xl font-bold md:flex-row md:items-center md:justify-between">
                    <h1 className="text-3xl font-bold">Expense Tracker</h1>

                    <div className="flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                        <button
                            onClick={openModal}
                            className="flex h-11 items-center space-x-2 rounded bg-red-800/90 px-3 py-1 text-xl text-white shadow-md transition hover:bg-red-700 active:scale-95"
                        >
                            <FaPlus className="pointer-events-none left-3 text-xl" />
                            <p className="text-lg">Add</p>
                        </button>

                        <div className="relative flex items-center">
                            <FaSearch className="pointer-events-none absolute left-3 text-xl text-gray-800" />
                            <input
                                type="text"
                                className="h-11 w-60 rounded-lg border-none bg-gray-200 pl-10 text-xl text-gray-800 placeholder-gray-800/70 outline-none"
                                placeholder="Search"
                            />
                        </div>

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

                {/* Liste des transactions */}
                <div
                    className={`mt-6 w-full overflow-y-auto pt-3 pl-2 ${
                        view === 'grid'
                            ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                            : 'flex flex-col space-y-4'
                    }`}
                    style={{ maxHeight: 'calc(100vh - 220px)' }}
                >
                    {Array.isArray(transactions) &&
                        transactions.map((t) => (
                            <TransactionCard
                                key={t.id}
                                transaction={t}
                                view={view}
                                actions={{
                                    onChange: () =>
                                        handleChangeTransaction(t.id),
                                    onDelete: () =>
                                        handleDeleteTransaction(t.id),
                                }}
                            />
                        ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="text-2xl font-bold">Add New Expense</h2>
                        <form
                            className="flex flex-col space-y-4"
                            onSubmit={
                                editingId
                                    ? handleUpdateTransaction
                                    : handleAddTransaction
                            }
                            encType="multipart/form-data"
                        >
                            <input
                                name="description"
                                type="text"
                                placeholder="Description"
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
                                type="datetime-local"
                                className="rounded border p-2"
                                defaultValue={new Date()
                                    .toISOString()
                                    .slice(0, 16)}
                            />

                            <select
                                name="categoryId"
                                className="rounded border p-2"
                                required
                            >
                                <option value="">Select Category</option>
                                {Array.isArray(categories) &&
                                    categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                            </select>

                            <input
                                name="receipt"
                                type="file"
                                className="rounded border p-2"
                            />

                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="one-time"
                                        defaultChecked
                                    />
                                    <span>One-time</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="recurring"
                                    />
                                    <span>Recurring</span>
                                </label>
                            </div>

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
                                    className="rounded bg-emerald-600 px-4 py-2 text-white"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
