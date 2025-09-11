import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExpenseFilter from '../../UI/ExpenseFilter';
import type { Transaction } from '../Types';
import ExpenseConfirmModal from './ExpenseConfirmModal';
import ExpenseHeader from './ExpenseHeader';
import ExpenseList from './ExpenseList';
import ExpenseModal from './ExpenseModal';
import useExpenseData from './hooks/useExpenseData';

import useExpenseActions from './hooks/useExpenseActions';

type ChartOptions = {
    start: Date;
    end: Date;
    category?: string;
    type?: string;
};

export default function Expense(): React.ReactElement {
    const { t } = useTranslation();
    const [view, setView] = useState<'grid' | 'list'>(
        () =>
            (localStorage.getItem('transactionView') as 'grid' | 'list') ||
            'grid',
    );
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeValue, setTypeValue] = useState<'one-time' | 'recurring'>(
        'one-time',
    );
    const [chartOptions, setChartOptions] = useState<ChartOptions>({
        start: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
        end: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1, 0, 1),
        ),
        category: undefined,
        type: undefined,
    });

    const {
        categoryList,
        transactions,
        setTransactions,
        categories,
        setCategories,
        setCategoryList,
    } = useExpenseData(t as any);

    const {
        handleAddTransaction,
        handleUpdateTransaction,
        handleChangeTransaction,
        handleDownloadReceipt,
        handleDeleteTransaction,
    } = useExpenseActions({
        setTransactions,
        setCategories,
        setCategoryList,
        setIsModalOpen,
        setEditingId,
        setIsConfirmModalOpen,
        t: t as any,
    });

    const editingTransaction = useMemo(
        () =>
            editingId
                ? (transactions.find((tx) => tx.id === editingId) ?? null)
                : null,
        [editingId, transactions],
    );

    const filteredTransactions = transactions.filter((tx) => {
        const name = (tx.name ?? '').toString().toLowerCase();
        const cat = (tx.category ?? '').toString().toLowerCase();
        const matchesSearch =
            name.includes(searchTerm.toLowerCase()) ||
            cat.includes(searchTerm.toLowerCase());
        const matchesCategory =
            !chartOptions.category || tx.category === chartOptions.category;
        const transactionDate = tx.date ? new Date(tx.date) : null;
        const matchesDate =
            (!chartOptions.start ||
                !transactionDate ||
                transactionDate >= chartOptions.start) &&
            (!chartOptions.end ||
                !transactionDate ||
                transactionDate <= chartOptions.end);
        const matchesRecurring =
            !chartOptions.type ||
            (chartOptions.type === 'recurring' && tx.is_recurrent) ||
            (chartOptions.type === 'one-time' && !tx.is_recurrent);
        return (
            matchesSearch && matchesCategory && matchesDate && matchesRecurring
        );
    });

    const toggleView = () => {
        const newView = view === 'grid' ? 'list' : 'grid';
        setView(newView);
        localStorage.setItem('transactionView', newView);
    };

    return (
        <div className="z-50 flex h-[calc(96vh-120px)] w-full flex-col items-center rounded-lg bg-gray-100 lg:h-[96vh] dark:border-2 dark:border-gray-800 dark:bg-gray-900">
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

                <div
                    className={`${isFilterVisible ? '' : 'max-md:hidden'} px-4 pb-2.5`}
                >
                    <ExpenseFilter
                        chartOptions={chartOptions}
                        setChartOptions={setChartOptions}
                        categoryList={categoryList}
                    />
                </div>

                <ExpenseList
                    transactions={filteredTransactions}
                    view={view}
                    actions={{
                        onDownload: (tx: Transaction) =>
                            handleDownloadReceipt?.(tx.id),
                        onChange: (tx: Transaction) => {
                            setEditingId(tx.id);
                            setIsModalOpen(true);
                            handleChangeTransaction?.(tx.id);
                        },
                        onDelete: (tx: Transaction) => {
                            setEditingId(tx.id);
                            setIsConfirmModalOpen(true);
                        },
                    }}
                />
            </div>

            <ExpenseModal
                t={t}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingId(null);
                }}
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    if (editingId)
                        return handleUpdateTransaction?.(e, editingId);
                    return handleAddTransaction?.(e);
                }}
                editingId={editingId}
                typeValue={typeValue}
                setTypeValue={setTypeValue}
                categories={categories}
                editingTransaction={editingTransaction}
            />

            <ExpenseConfirmModal
                t={t}
                isOpen={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    if (editingId) {
                        handleDeleteTransaction?.(editingId);
                        setIsConfirmModalOpen(false);
                        setEditingId(null);
                    }
                }}
            />
        </div>
    );
}
