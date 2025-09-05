import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next"
import type { Transaction } from "./Transaction/Types";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../utils/currency";

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

export default function BarChart({ chartValueOptions }: any) {
    const { t } = useTranslation()
    const [chartData, setChartData] = useState<{ labels: any[], datasets: any[] }>({ labels: [], datasets: [] })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currency } = useContext(CurrencyContext);

    const chartOptions = {
        base: 0,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: t("amount", 'Amount'),
                },
            },
            x: {
                title: {
                    display: true,
                    text: t("month", 'Month'),
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y, currency);
                        }
                        return label;
                    }
                }
            }
        }
    }

    async function getExpensesOverTime(start: Date, end: Date, category?: string, type?: "one-time" | "recurring") {
        try {
            return await fetch(`${import.meta.env.VITE_API_URL}/api/expenses?start=${start.toISOString().split('T')[0]}&end=${end.toISOString().split('T')[0]}&category=${category}&type=${type || ''}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('accessToken') }
            })
                .then(async res => await res.json())
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    async function getIncomesOverTime(start: Date, end: Date) {
        try {
            return await fetch(`${import.meta.env.VITE_API_URL}/api/incomes?start=${start.toISOString().split('T')[0]}&end=${end.toISOString().split('T')[0]}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem('accessToken') }
            })
                .then(async res => await res.json())
                .catch(rej => console.log(rej.message))
        } catch (err: any) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        const fetchStructuredData = async () => {
            try {
                const fetchedExpense = await getExpensesOverTime(chartValueOptions?.start, chartValueOptions?.end, chartValueOptions?.category, chartValueOptions?.type)
                const fetchedIncome = await getIncomesOverTime(chartValueOptions?.start, chartValueOptions?.end)

                const totalPerMonth: any = {}
                fetchedExpense?.reverse().forEach(
                    (expense: Transaction & { is_recurrent: boolean, start_date: string, end_date: string }) => {
                        let date;
                        if (expense.is_recurrent === false) {
                            date = new Date(expense?.date)
                        } else if (new Date() > new Date(expense.start_date)) {
                            (new Date() < new Date(expense.end_date || "30000")) ? date = new Date() : expense.end_date ? date = new Date(expense.end_date) : null
                        } else {
                            date = new Date(expense.start_date)
                        }
                        if (date) {
                            if (!totalPerMonth[date.toLocaleDateString(t('local_date_format', 'en-US'), { year: "numeric", month: "short" })]) {
                                totalPerMonth[date.toLocaleDateString(t('local_date_format', 'en-US'), { year: "numeric", month: "short" })] = [0, 0]
                            }
                            totalPerMonth[date.toLocaleDateString(t('local_date_format', 'en-US'), { year: "numeric", month: "short" })][0] += Number(expense.amount)
                        };
                    }
                )

                fetchedIncome?.reverse().forEach(
                    (income: Transaction) => {
                            const dateStr = income?.income_date ?? income?.date;
                            if (!dateStr) return; // skip if no usable date
                            const date = new Date(dateStr);

                            const key = date.toLocaleDateString(t('local_date_format', 'en-US'), { year: "numeric", month: "short" });
                            if (!totalPerMonth[key]) {
                                totalPerMonth[key] = [0, 0]
                            }
                            totalPerMonth[key][1] += Number(income.amount);
                        }
                )

                const labels = Object.keys(totalPerMonth)
                const data: number[][] = Object.values(totalPerMonth)

                let expenseData: number[] = []
                let incomeData: number[] = []

                data.forEach((value: number[]) => {
                    expenseData.push(value[0])
                    incomeData.push(value[1])
                })

                return setChartData({
                    labels,
                    datasets: [
                        {
                            label: t("expenses", "Expenses"),
                            data: expenseData,
                            backgroundColor: '#F44336'
                        },
                        {
                            label: t("incomes", 'Incomes'),
                            data: incomeData,
                            backgroundColor: '#4CAF50'
                        }
                    ]
                })
            } catch (err) {
                setError("⚠️ Failed to fetch chart data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStructuredData()
    }, [chartValueOptions])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[40vh] max-w-[720px] min-w-[600px]">
                <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-700"></span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="h-[40vh] flex-1/2 min-w-[600px] max-w-[720px] cursor-pointer">
            {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>
    )
}