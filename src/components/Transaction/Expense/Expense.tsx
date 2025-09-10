import  { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import ExpenseHeader from './ExpenseHeader';
import ExpenseList from './ExpenseList';
import ExpenseModal from './ExpenseModal';
import ExpenseConfirmModal from './ExpenseConfirmModal';
import ExpenseFilter from '../../UI/ExpenseFilter';
import useExpenseData from './hooks/useExpenseData';
import useExpenseActions from './hooks/useExpenseActions';

type ChartOptions = {
  start: Date;
  end: Date;
  category?: string;
  type?: string;
};

export default function Expense(): JSX.Element {
  const { t } = useTranslation();
  const [view, setView] = useState<'grid' | 'list'>(
    () => (localStorage.getItem('transactionView') as 'grid' | 'list') || 'grid'
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeValue, setTypeValue] = useState<'one-time' | 'recurring'>('one-time');
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    start: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
    end: new Date(new Date().setFullYear(new Date().getFullYear() + 1, 0, 1)),
    category: undefined,
    type: undefined,
  });

  const { categoryList, transactions, setTransactions, categories, setCategories } = useExpenseData(t);

  const {
    handleAddTransaction,
    handleUpdateTransaction,
    handleChangeTransaction,
    handleDownloadReceipt,
    handleDeleteTransaction,
  } = useExpenseActions({
    setTransactions,
    setIsModalOpen,
    setEditingId,
    setIsConfirmModalOpen,
  });

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !chartOptions.category || tx.category === chartOptions.category;
    const transactionDate = new Date(tx.date);
    const matchesDate =
      (!chartOptions.start || transactionDate >= chartOptions.start) &&
      (!chartOptions.end || transactionDate <= chartOptions.end);
    const matchesRecurring =
      !chartOptions.type ||
      (chartOptions.type === 'recurring' && tx.is_recurrent) ||
      (chartOptions.type === 'one-time' && !tx.is_recurrent);
    return matchesSearch && matchesCategory && matchesDate && matchesRecurring;
  });

  const toggleView = () => {
    const newView = view === 'grid' ? 'list' : 'grid';
    setView(newView);
    localStorage.setItem('transactionView', newView);
  };

  return (
    <div className="z-50 flex lg:h-[96vh] h-[calc(96vh-120px)] w-full flex-col items-center rounded-lg bg-gray-100 dark:border-2 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex min-h-full w-full flex-col rounded-2xl">
        <ExpenseHeader
          t={t}
          view={view}
          toggleView={toggleView}
          setIsModalOpen={setIsModalOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isFilterVisible={isFilterVisible}
          setIsFilterVisible={setIsFilterVisible}
        />
        <div className={`${isFilterVisible ? '' : 'max-md:hidden'} px-4 pb-2.5`}>
          <ExpenseFilter chartOptions={chartOptions} setChartOptions={setChartOptions} categoryList={categoryList} />
        </div>
        <ExpenseList
          transactions={filteredTransactions}
          view={view}
          actions={(t) => ({
            onDownload: () => handleDownloadReceipt(t.id),
            onChange: () => handleChangeTransaction(t.id),
            onDelete: () => {
              setIsConfirmModalOpen(true);
              setEditingId(t.id);
            },
          })}
        />
      </div>

      <ExpenseModal
        t={t}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingId ? handleUpdateTransaction : handleAddTransaction}
        editingId={editingId}
        typeValue={typeValue}
        setTypeValue={setTypeValue}
        categories={categories}
      />

      <ExpenseConfirmModal
        t={t}
        isOpen={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={() => {
          if (editingId) {
            setIsConfirmModalOpen(false);
            handleDeleteTransaction(editingId);
            setEditingId(null);
          }
        }}
      />
    </div>
  );
}