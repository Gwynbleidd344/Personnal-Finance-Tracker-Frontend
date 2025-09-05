import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaList, FaPlus, FaThLarge } from 'react-icons/fa';
import { fetchCategories, fetchExpenses } from '../../utils/fetch/Fetch.ts';
import ExpenseFilter from '../UI/ExpenseFilter.tsx';
import Input from './../UI/searchButton.tsx';
import TransactionCard from './TransactionCard';
import type { Category, Transaction } from './Types';
import fileDownload from "js-file-download";

type ChartOptions = {
  start: Date;
  end: Date;
  category?: string;
  type?: string;
};

export default function Expense() {
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeValue, setTypeValue] = useState<'one-time' | 'recurring'>('one-time');

  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    start: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
    end: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1, 0, 1),
    ),
    category: undefined,
    type: undefined,
  });

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const token = localStorage.getItem('accessToken');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !chartOptions.category || t.category === chartOptions.category;

    const matchesRecurring =
      !chartOptions.type ||
      (chartOptions.type === 'recurring' && t.is_recurrent) ||
      (chartOptions.type === 'one-time' && !t.is_recurrent);

    const transactionDate = new Date(t.date);
    const matchesDate =
      (!chartOptions.start || transactionDate >= chartOptions.start) &&
      (!chartOptions.end || transactionDate <= chartOptions.end);

    return matchesSearch && matchesCategory && matchesRecurring && matchesDate;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      await fetchCategories(token, setCategories, setCategoryList);
      await fetchExpenses(token, setTransactions, t);
    };
    fetchData();
  }, [token]);

  const handleAddTransaction = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      description: { value: string };
      amount: { value: string };
      date: { value: string };
      startDate?: { value: string };
      endDate?: { value: string };
      type: { value: string };
      categoryId: { value: string };
      receipt?: { files: FileList };
    };

    if (!token) return;

    const formData = new FormData();
    formData.append('description', target.description.value);
    formData.append('amount', target.amount.value);
    formData.append('date', target.date.value);
    formData.append('type', typeValue);
    formData.append('categoryId', target.categoryId.value);

    if (typeValue === 'recurring') {
      if (target.startDate?.value) formData.append('startDate', target.startDate.value);
      else return;
      if (target.endDate?.value && new Date(target.startDate?.value) <= new Date(target.endDate?.value)) formData.append('endDate', target.endDate.value);
      else return;
    }

    if (
      target.receipt?.files?.[0] &&
      target.receipt.files.length < 2 &&
      [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ].includes(target.receipt.files[0].type) &&
      target.receipt.files[0].size <= 2097152
    ) {
      formData.append('receipt', target.receipt.files[0]);
    }

    try {
      // Debug: log token and FormData entries so we can compare with Postman
      console.log('Creating expense - token present?', !!token);
      for (const entry of formData.entries()) {
        console.log('formData entry:', entry[0], entry[1]);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        // Read server error body to surface useful debugging info
        const text = await res.text();
        console.error('Create expense failed', res.status, text);
      } else {
        await fetchExpenses(token, setTransactions, t);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Create expense exception', err);
    }
  };

  const handleUpdateTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId || !token) return;

    const target = event.target as typeof event.target & {
      description: { value: string };
      amount: { value: string };
      date: { value: string };
      startDate?: { value: string };
      endDate?: { value: string };
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

    if (
      target.receipt?.files?.[0] &&
      target.receipt?.files?.length < 2 &&
      [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ].includes(target.receipt.files[0].type) &&
      target.receipt.files[0].size <= 2097152
    ) {
      formData.append('receipt', target.receipt.files[0]);
    }

    try {
      console.log('Updating expense', editingId, 'token present?', !!token);
      for (const entry of formData.entries()) {
        console.log('formData entry:', entry[0], entry[1]);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${editingId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Update expense failed', res.status, text);
      } else {
        await fetchExpenses(token, setTransactions, t);
        setIsModalOpen(false);
        setEditingId(null);
      }
    } catch (err) {
      console.error('Update expense exception', err);
    }
  };

  const handleChangeTransaction = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleDownloadReceipt = async (id: string) => {
    if (!token) return;
    try {
      return await fetch(`${import.meta.env.VITE_API_URL}/api/receipts/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }).then(async res => (res.ok) ? fileDownload(await res.blob(), `${id}.${res.headers.get('content-type')?.split('/')[1]}`) : null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchExpenses(token, setTransactions, t);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="z-50 flex h-[94vh] w-full flex-col items-center rounded-lg bg-gray-100">
      <div className="flex min-h-full w-full max-w-7xl flex-col rounded-2xl p-6">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-300 pb-2 text-3xl font-bold md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">{t('expenses', 'Expenses')}</h1>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
            {/* Add button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-200 hover:bg-gray-300 hover:shadow-md active:scale-95"
            >
              <FaPlus className="text-lg text-gray-600" />
              <span>{t('add', 'Add')}</span>
            </button>

            {/* Search */}
            <div className="relative flex items-center">
              <Input value={searchTerm} onChange={setSearchTerm} placeholder={t('search', 'Search')} />
            </div>

            {/* View toggle */}
            <div className="flex space-x-2">
              <button
                onClick={toggleView}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-gray-200 text-gray-800 transition hover:bg-gray-300 active:scale-95"
              >
                {view === 'grid' ? <FaList /> : <FaThLarge />}
              </button>
            </div>
          </div>
        </div>

        <ExpenseFilter chartOptions={chartOptions} setChartOptions={setChartOptions} categoryList={categoryList} />

        {/* Transactions */}
        <AnimatePresence>
          <motion.div
            layout
            className={`mt-6 w-full overflow-y-auto pt-3 pl-2 ${view === 'grid'
              ? 'grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col space-y-4'
              }`}
            style={{ maxHeight: 'calc(100vh - 220px)' }}
          >
            {filteredTransactions.map((t) => (
              <motion.div
                layout
                key={t.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.1, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className='relative'
              >
                <TransactionCard
                  transaction={t}
                  view={view}
                  actions={{
                    onDownload() {
                      handleDownloadReceipt(t.id)
                    },
                    onChange: () => handleChangeTransaction(t.id),
                    onDelete: () => {
                      setIsConfirmModalOpen(true)
                      setEditingId(t.id)
                    },
                  }}
                />

              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal Add/Edit Transaction */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: .15 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-3">
                {editingId
                  ? `${t('update', 'Update')} ${t('expense', 'Expense')}`
                  : `${t('add_new', 'Add New')} ${t('expense', 'Expense')}`}
              </h2>
              <form
                className="flex flex-col space-y-4"
                onSubmit={editingId ? handleUpdateTransaction : handleAddTransaction}
                encType="multipart/form-data"
              >
                <input
                  name="description"
                  type="text"
                  placeholder={t('description', 'Description')}
                  className="rounded-lg border border-gray-300 p-3 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <input
                  name="amount"
                  type="number"
                  placeholder={t('amount', 'Amount')}
                  className="rounded-lg border border-gray-300 p-3 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  required
                />
                <input
                  name="date"
                  type="datetime-local"
                  className="rounded-lg border border-gray-300 p-3 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
                <select
                  name="categoryId"
                  className="rounded-lg border border-gray-300 p-3 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">{t('select_category', 'Select Category')}</option>
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
                  className="rounded-lg border border-gray-300 p-3 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />

                {/* Type selection */}
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="type"
                      value="one-time"
                      checked={typeValue === 'one-time'}
                      onChange={() => setTypeValue('one-time')}
                    />
                    <span>{t('one_time', 'One-time')}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="type"
                      value="recurring"
                      checked={typeValue === 'recurring'}
                      onChange={() => setTypeValue('recurring')}
                    />
                    <span>{t('recurring', 'Recurring')}</span>
                  </label>
                </div>

                {/* Conditional recurring dates */}
                {typeValue === 'recurring' && (
                  <div className="flex flex-col space-y-2">
                    <input
                      name="startDate"
                      type="date"
                      className="rounded-lg border border-gray-300 p-3 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                    <input
                      name="endDate"
                      type="date"
                      className="rounded-lg border border-gray-300 p-3 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>
                )}

                <div className="mt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg bg-gray-200 px-5 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
                  >
                    {t('cancel', 'Cancel')}
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-5 py-2 font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
                  >
                    {editingId ? t('update', 'Update') : t('add', 'Add')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )
        }
      </AnimatePresence >
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: .15 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-3">
                {t("expense_confirm_delete", "Are you sure to delete this expense ?")}
              </h2>
              <div className='flex justify-end gap-2'>
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="rounded-lg bg-gray-200 px-5 py-2 text-gray-800 font-medium hover:bg-gray-300 transition"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="button"
                  className={`rounded-lg px-5 py-2 font-medium text-white transition bg-red-700 hover:bg-red-800'
                  }`}
                  onClick={() => {
                    setIsConfirmModalOpen(false)
                    handleDeleteTransaction(editingId);
                    setEditingId(null)
                  }}
                >
                  {t('delete', 'Delete')}
                </button>
              </div>
            </motion.div>
          </div>
        )
        }
      </AnimatePresence >
    </div >
  );
}
