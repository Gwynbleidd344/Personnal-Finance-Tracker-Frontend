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
        { day: '2-digit', month: 'short', year: 'numeric' },
    );

    const formattedEndDate = transaction.end_date
        ? new Date(transaction.end_date).toLocaleDateString(
              t('local_date_format', 'en-US'),
              { day: '2-digit', month: 'short', year: 'numeric' },
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
            className={`group relative mb-2 scale-99 cursor-pointer rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-100 hover:shadow-md hover:before:opacity-100 dark:border-gray-600/55 dark:bg-gray-900 ${
                view === 'list' ? 'h-24 sm:h-28' : 'h-auto'
            }`}
        >
            {/* Badge icon */}
            <div
                className={`absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl ${bgColor} shadow`}
            >
                {icon}
            </div>

            {/* Main content */}
            <div className="flex items-start justify-between">
                {/* Info */}
                <div
                    className={
                        view === 'list'
                            ? 'ml-12 flex w-full flex-col justify-between'
                            : 'flex flex-col space-y-2'
                    }
                >
                    {/* Name & Amount */}
                    <div className="mt-6 flex w-fit items-center justify-between space-x-4 capitalize">
                        <h2 className="mb-1 truncate pl-1.5 text-xl leading-tight font-semibold text-gray-900 dark:text-gray-100">
                            {formatName(transaction.name)}
                        </h2>
                        <p
                            className={`text-2xl font-bold tracking-tight ${
                                transaction.type === 'expense'
                                    ? 'text-red-600 dark:text-red-500/75'
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
                    <div className="text-md mt-1 flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span className="max-w-[150px] truncate rounded-full bg-gray-300 px-3 py-1.5 font-medium text-gray-700 dark:bg-gray-800  dark:text-gray-300">

                            {formatName(
                                transaction.type === 'expense'
                                    ? transaction.category || 'Uncategorized'
                                    : transaction.source || 'Unknown',
                            )}
                        </span>
                        <span className="font-medium text-gray-500 dark:text-gray-400">
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
                <div className="mt-2 ml-4 flex min-h-full">
                    {transaction.receipt_id && (
                        <button
                            onClick={actions?.onDownload}
                            className="group/btn flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                        >
                            <FaFileDownload className="text-sm transition-transform duration-200 group-hover/btn:scale-110" />
                        </button>
                    )}

                    <div
                        className={`flex ${
                            view === 'grid'
                                ? 'flex-col items-center space-y-2'
                                : 'h-full flex-col justify-between gap-2'
                        }`}
                    >
                        <button
                            onClick={actions?.onChange}
                            className="group/btn flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-700 shadow-md transition-all duration-200 hover:scale-105 hover:bg-gray-300 hover:shadow-lg active:scale-95 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            <FaExchangeAlt className="text-sm transition-transform duration-200 group-hover/btn:scale-110" />
                        </button>

                        <button
                            onClick={actions?.onDelete}
                            className="group/btn flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/80 text-gray-100 shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95"
                        >
                            <FaTrash className="text-sm transition-transform duration-200 group-hover/btn:scale-110" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
