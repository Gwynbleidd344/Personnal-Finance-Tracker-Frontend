import StatCard from '../components/StatCard.tsx';
import { PieChart } from "../components/PieChart.tsx";
import ExpenseList from "../components/ExpenseList.tsx";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { Transaction } from '../components/Transaction/Types.tsx';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dashboard() {
    const token = localStorage.getItem('accessToken')

    const { t } = useTranslation();
    const [monthExpenses, setMonthExpenses] = useState<Transaction[] | null>(null)
    const [monthIncomes, setMonthIncomes] = useState<Transaction[] | null>(null)
    const [remainingBalance, setRemainingBalane] = useState<number>(0)

    function getMonthExpenses(time: { year: number, month: number }) {
        try {
            const monthStart = new Date(`${time.year}-${time.month < 10 ? ("0" + time.month) : time.month}`).toISOString()
            const monthEnd = new Date(time.month === 12 ? `${time.year + 1}-01` : `${time.year}-${time.month < 9 ? ("0" + (time.month + 1)) : time.month + 1}`).toISOString()

            fetch(`http://localhost:8080/api/expenses?start=${monthStart}&end=${monthEnd}`, {
                headers: { Authorization: "Bearer " + token }
            })
                .then(res => res.json())
                .then(res => setMonthExpenses(res))
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    function getMonthIncomes(time: { year: number, month: number }) {
        try {
            const monthStart = new Date(`${time.year}-${time.month < 10 ? ("0" + time.month) : time.month}`).toISOString()
            const monthEnd = new Date(time.month >= 12 ? `${time.year + 1}-01` : `${time.year}-${time.month < 9 ? ("0" + (time.month + 1)) : time.month + 1}`).toISOString()

            fetch(`http://localhost:8080/api/income?start=${monthStart}&end=${monthEnd}`, {
                headers: { Authorization: "Bearer " + token }
            })
                .then(res => res.json())
                .then(res => setMonthIncomes(res))
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getMonthExpenses({ year: new Date().getFullYear(), month: new Date().getMonth() })
        getMonthIncomes({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 })
    }, [monthExpenses, monthIncomes])

    useEffect(() => {
        setRemainingBalane(((monthIncomes?.reduce((acc, income) => acc += Number(income.amount), 0) || 0) - (monthExpenses?.reduce((acc, expense) => acc += Number(expense.amount), 0) || 0)))
    }, [monthExpenses, monthIncomes])

    return (
        <section className={'flex'}>
            <div className="h-[94vh] w-full rounded-lg bg-gray-100 p-5 overflow-x-hidden overflow-scroll">
                <div className="flex justify-between border-b border-gray-300 items-center mb-5">
                    <h1 className="text-3xl font-bold p-2 mb-3">
                        {t("dashboard_title", "Dashboard")}
                    </h1>
                </div>
                <AnimatePresence>
                    {(remainingBalance < 0) && (<motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex p-3 px-6 -mt-3 mb-2 items-center border border-amber-400 bg-yellow-300/40 rounded-[10px]'>
                        <h3 className='font-medium text-gray-900 flex items-center'>You have exceeded your monthly budget by <span className='text-red-700 text-2xl pl-2'>${-remainingBalance}</span></h3>
                    </motion.div>)}
                </AnimatePresence>
                <div className={'flex justify-evenly gap-6'}>
                    <StatCard
                        title={t('total_income', 'Total Income')}
                        amount={1000}
                        color={'text-green-600'}
                    />
                    <StatCard
                        title={t('total_expenses', 'Total Expenses')}
                        amount={1000}
                        color={'text-red-600'}
                    />
                    <StatCard
                        title={t('remaining_balance', 'Remaining Balance')}
                        amount={1000}
                        color={'text-blue-600'}
                    />
                </div>
                <div className={`flex flex-col m-5`}>
                    <h1 className={`text-2xl font-semibold`}>Expenses Categoires</h1>
                    <PieChart />
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
