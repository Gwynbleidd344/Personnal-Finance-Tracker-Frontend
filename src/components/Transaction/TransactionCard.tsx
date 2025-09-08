import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FaBolt,
    FaCoffee,
    FaExchangeAlt,
    FaFileDownload,
    FaFilm,
    FaMoneyBillWave,
    FaPlus,
    FaTaxi,
    FaTrash,
    FaUtensils,
} from 'react-icons/fa';
import { CurrencyContext } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/currency';
import formatName from '../../utils/FormatTransactionName';
import type { Transaction } from './Types';

type TransactionCardProps = {
    transaction: Transaction;
    view: 'grid' | 'list';
    actions?: {
        onDownload?: () => void;
        onChange?: () => void;
        onDelete?: () => void;
    };
};

const categoryIcons: Record<string, React.ReactNode> = {
    Food: <FaUtensils className="text-white" />,
    Entertainment: <FaFilm className="text-white" />,
    Transport: <FaTaxi className="text-white" />,
    Utilities: <FaBolt className="text-white" />,
    Coffee: <FaCoffee className="text-white" />,
    Doctor: <FaPlus className="text-white" />,
    Other: <FaTrash className="text-white" />,
};

const categoryColors: Record<string, string> = {
    Food: 'bg-red-700',
    Entertainment: 'bg-purple-700',
    Transport: 'bg-green-700',
    Utilities: 'bg-yellow-700',
    Coffee: 'bg-orange-700',
    Doctor: 'bg-green-700',
};

export default function TransactionCard({
    transaction,
    view,
    actions,
}: TransactionCardProps) {
    const { currency } = useContext(CurrencyContext);
    const { t } = useTranslation();

    const formattedDate = new Date(transaction.date).toLocaleDateString(
        t('local_date_format', 'en-US'),
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        },
    );

    const formattedEndDate = transaction.end_date
        ? new Date(transaction.end_date).toLocaleDateString(
              t('local_date_format', 'en-US'),
              {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
              },
          )
        : t('unset', 'Unset');

    const icon: React.ReactNode =
        transaction.type === 'income' ? (
            <FaMoneyBillWave className="text-white" />
        ) : (
            categoryIcons[transaction.category || ''] || (
                <FaUtensils className="text-white" />
            )
        );

    const bgColor =
        transaction.type === 'income'
            ? 'bg-emerald-600'
            : categoryColors[transaction.category || ''] || 'bg-gray-400';

    return (
        <div
            className={`group relative mb-2 scale-99 cursor-pointer rounded-xl border border-gray-200/60 bg-gray-100 px-4 py-5 shadow-sm backdrop-blur-sm transition-transform duration-200 before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:scale-100 hover:shadow-md hover:before:opacity-100 dark:border-gray-700/80 dark:bg-gray-900 dark:shadow-emerald-950 ${view === 'list' ? 'h-24' : 'h-auto'}`}
        >
            {/* Badge icon */}
            <div
                className={`absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-lg ${bgColor} shadow`}
            >
                {icon}
            </div>

            {/* Main content */}
            <div className="flex items-start justify-between">
                <div
                    className={
                        view === 'list'
                            ? 'ml-12 flex flex-col justify-between'
                            : ''
                    }
                >
                    {/* Name & Amount */}
                    <div className="mt-5 flex w-fit items-center justify-between space-x-4">
                        <h2 className="mb-1 truncate text-xl leading-tight font-semibold text-gray-900 dark:text-gray-100">
                            {formatName(transaction.name)}
                        </h2>
                        <p
                            className={`text-2xl font-bold tracking-tight ${
                                transaction.type === 'expense'
                                    ? 'text-red-600 dark:text-red-500/70'
                                    : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                        >
                            {transaction.type === 'expense' ? '-' : '+'}
                            {formatCurrency(transaction.amount, currency, true)}
                        </p>
                        {transaction.is_recurrent && (
                            <i className="bx bx-rotate-right text-xl text-gray-500 dark:text-gray-400" />
                        )}
                    </div>

                    {/* Category / Source & Date */}
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            {formatName(
                                transaction.type === 'expense'
                                    ? transaction.category || 'Uncategorized'
                                    : transaction.source || 'Unknown',
                            )}
                        </span>
                        <span className="font-medium text-gray-400 dark:text-gray-500">
                            {formattedDate}
                        </span>
                        {transaction.start_date && (
                            <>
                                <span className="text-gray-300 dark:text-gray-600">
                                    →
                                </span>
                                <span className="font-medium">
                                    {formattedEndDate}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-start justify-center gap-2">
                    {transaction.receipt_id && (
                        <button
                            onClick={actions?.onDownload}
                            className="flex items-center justify-center rounded bg-blue-500 p-2 text-white transition hover:bg-blue-600 active:scale-95"
                        >
                            <FaFileDownload />
                        </button>
                    )}
                    <div
                        className={`flex ${
                            view === 'grid'
                                ? 'flex-col space-y-2'
                                : 'flex-row space-x-3'
                        } items-center`}
                    >
                        <button
                            className={`flex items-center justify-center gap-2 rounded bg-gray-300 p-2 text-gray-800 transition hover:bg-gray-400 active:scale-95 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500`}
                            onClick={actions?.onChange}
                        >
                            <FaExchangeAlt />
                        </button>

                        <button
                            className={`flex items-center justify-center gap-2 rounded bg-red-600 p-2 text-white transition hover:bg-red-700 active:scale-95`}
                            onClick={actions?.onDelete}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
