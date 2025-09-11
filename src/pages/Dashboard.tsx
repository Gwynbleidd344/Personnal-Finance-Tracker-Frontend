import StatCard from '../components/Dashboard/StatCard.tsx';
import { PieChart } from "../components/Dashboard/PieChart.tsx";
import ExpenseList from "../components/Dashboard/ExpenseList.tsx";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BarChart from '../components/Dashboard/BarChart.tsx';
import ExpenseFilter from '../components/UI/ExpenseFilter.tsx';
import AiAdvice from '../components/Dashboard/AiAdvice.tsx';
import { getAccessToken } from '../utils/getCookiesToken.ts';
import SessionExpiryBox from '../components/UI/SessionExpiryBox.tsx';

type MonthlySummaryType = {
    year: number
    month: number
    totalIncome: number
    totalExpense: number
    netSavings: number
}

export default function Dashboard() {
    const token = getAccessToken()

    const { t } = useTranslation();
    const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryType | null>(null)
    const [balanceAlert, setBalaceAlert] = useState<{ alert: boolean, message: string } | null>(null)
    const [chartOptions, setChartOptions] = useState<any>({
        start: new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)),
        end: new Date(new Date().setFullYear(new Date().getFullYear() + 1, 0, 1)),
        category: undefined,
        type: undefined
    })
    const [categoryList, setCategoryList] = useState<any[]>([])

    function getMonthlySummary(month: string) {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/summary/monthly?month=` + month, {
                mode: 'cors', credentials: 'include',
                headers: { Authorization: `${token}` },
            })
                .then(res => res.json())
                .then(res => setMonthlySummary(res))
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    function checkMonthBalance() {
        try {
            fetch(`${import.meta.env.VITE_API_URL}/api/summary/alerts`, {
                mode: 'cors', credentials: 'include',
                headers: { Authorization: `${token}` },
            })
                .then(res => res.json())
                .then(res => setBalaceAlert(res))
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    const fetchCategories = async (): Promise<any[]> => {
        if (!token) return [];
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
                mode: 'cors', credentials: 'include',
                headers: { Authorization: `${token}` },
            });
            const data = await res.json();
            const cats: any[] = Array.isArray(data) ? data : [];
            setCategoryList(cats);
            return cats;
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategoryList([]);
            return [];
        }
    };

    useEffect(() => {
        const now = new Date()
        getMonthlySummary(now.getFullYear() + "-" + (now.getMonth() + 1))
        checkMonthBalance()
        fetchCategories()
    }, [])

    return (
        <section className={'flex h-full'}>
            <div className={`lg:h-[96vh] h-[calc(96vh-120px)] w-full rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-2 dark:border-gray-800 p-5 overflow-y-scroll overflow-x-hidden dark:text-white`}>
                <div className="flex justify-between border-b border-gray-300 dark:border-gray-500 items-center mb-5">
                    <h1 className="text-3xl font-bold p-2 mb-3">
                        {t("dashboard_title", "Dashboard")}
                    </h1>
                </div>
                <AnimatePresence>
                    {(balanceAlert?.alert) && (<motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex p-3 px-6 -mt-3 mb-2 items-center border border-amber-300 bg-yellow-100/70 rounded-[10px]'>
                        <h3 className='font-medium text-lg text-gray-800 dark:text-gray-900 flex items-center gap-2'><i className="bxr bx-alert-triangle text-yellow-500 dark:text-yellow-300 text-2xl" />{balanceAlert.message}</h3>
                    </motion.div>)}
                </AnimatePresence>
                <div className={'xl:grid grid-cols-3 flex flex-row w-full justify-evenly gap-6 flex-wrap '}>
                    <StatCard
                        title={t('total_income', 'Total Income')}
                        amount={monthlySummary?.totalIncome}
                        color={'text-green-600'}
                    />
                    <StatCard
                        title={t('total_expenses', 'Total Expenses')}
                        amount={monthlySummary?.totalExpense}
                        color={'text-red-600'}
                    />
                    <StatCard
                        title={t('remaining_balance', 'Remaining Balance')}
                        amount={monthlySummary?.netSavings}
                        color={'text-blue-600'}
                    />
                </div>
                <AiAdvice />
                <ExpenseFilter
                    chartOptions={chartOptions}
                    setChartOptions={setChartOptions}
                    categoryList={categoryList}
                />
                <div className={`flex flex-col m-5`}>
                    <h1 className={`text-2xl font-semibold`}>{t('expenses_categories', 'Expenses Categories')}</h1>
                    <div className="flex md:flex-row flex-col items-center max-w-[1200px] w-full gap-6 md:items-start mt-5">
                        <PieChart chartValueOptions={chartOptions} />
                        <BarChart chartValueOptions={chartOptions} />
                    </div>
                </div>
                <div className={`flex flex-col mt-5 pt-5 dark:bg-gray-800 rounded-lg`}>
                    <h1 className={`text-2xl font-semibold border-b-1 border-gray-300 mx-6 pb-3 `}>{t('recent_expenses', 'Recent Expenses')}</h1>
                    <div className={`flex flex-col`}>
                        <ExpenseList />
                    </div>
                </div>
            </div>
        </section>
    );
}
