import StatCard from '../components/StatCard.tsx';
import { PieChart } from "../components/PieChart.tsx";
import ExpenseList from "../components/ExpenseList.tsx";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BarChart from '../components/BarChart.tsx';

export default function Dashboard() {
    const token = localStorage.getItem('accessToken')

    const { t } = useTranslation();
    const [monthlySummary, setMonthlySummary] = useState<{ year: number, month: number, totalIncome: number, totalExpense: number, netSavings: number } | null>(null)
    const [balanceAlert, setBalaceAlert] = useState<{ alert: boolean, message: string } | null>(null)

    function getMonthlySummary(month: string) {
        try {
            fetch("http://localhost:8080/api/summary/monthly?month=" + month,
                { headers: { Authorization: "Bearer " + token } }
            )
                .then(res => res.json())
                .then(res => setMonthlySummary(res))
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    function checkMonthBalance() {
        try {
            fetch("http://localhost:8080/api/summary/alerts",
                { headers: { Authorization: "Bearer " + token } }
            )
                .then(res => res.json())
                .then(res => setBalaceAlert(res))
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        const now = new Date()
        getMonthlySummary(now.getFullYear() + "-" + (now.getMonth() + 1))
        checkMonthBalance()
    }, [])

    return (
        <section className={'flex'}>
            <div className="h-[94vh] w-full rounded-lg bg-gray-100 p-5 overflow-x-hidden overflow-scroll">
                <div className="flex justify-between border-b border-gray-300 items-center mb-5">
                    <h1 className="text-3xl font-bold p-2 mb-3">
                        {t("dashboard_title", "Dashboard")}
                    </h1>
                </div>
                <AnimatePresence>
                    {(balanceAlert?.alert) && (<motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex p-3 px-6 -mt-3 mb-2 items-center border border-amber-400 bg-yellow-300/40 rounded-[10px]'>
                        <h3 className='font-medium text-lg text-red-500 flex items-center'>{balanceAlert.message}</h3>
                    </motion.div>)}
                </AnimatePresence>
                <div className={'flex justify-evenly gap-6'}>
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
                <div className={`flex flex-col m-5`}>
                    <h1 className={`text-2xl font-semibold`}>Expenses Categoires</h1>
                    <div className='flex justify-evenly items-center'>
                        <PieChart />
                        <BarChart />
                    </div>
                </div>
                <div className={`flex flex-col mt-5`}>
                    <h1 className={`text-2xl font-semibold border-b-1 border-gray-300 mx-6 pb-3`}>Recent Expenses</h1>
                    <div className={`flex flex-col`}>
                        <ExpenseList />
                    </div>
                </div>
            </div>
        </section>
    );
}
