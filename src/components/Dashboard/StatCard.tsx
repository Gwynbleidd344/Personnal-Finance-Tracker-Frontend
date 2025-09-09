import { useContext } from 'react';
import { CurrencyContext } from '../../context/CurrencyContext';
import { formatCurrency } from '../../utils/currency';
import formatAmount from '../../utils/FormatAmount';

export default function StatCard({ title, amount, color }: { title: string, amount?: any, color: string }) {
    const { currency } = useContext(CurrencyContext);

    return (
        <div className={'flex flex-col border-1 border-gray-300  rounded-lg p-4 w-full dark:border-gray-900 dark:bg-gray-800 '}>
            <h3 className={'text-nowrap  '}>{title}</h3>
            <h2 className={`text-3xl font-semibold ${color}`}>{formatCurrency(formatAmount(amount), currency, true)}</h2>
        </div>
    )
}