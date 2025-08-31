import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import type { Transaction } from "./Transaction/Types";

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale)

export default function BarChart() {
    const [chartData, setChartData] = useState<{ labels: any[], datasets: any[] }>({ labels: [], datasets: [] })
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const chartOptions = {
        borderRadius: 100,
        base: 0,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
        }
    }

    async function getExpensesOverTime(start: Date, end: Date, category?: string, type?: "one-time" | "recurring") {
        try {
            return await fetch(`http://localhost:8080/api/expenses?start=${start.toISOString().split('T')[0]}&end=${end.toISOString().split('T')[0]}&category=${category}&type=${type || ''}`, {
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
            return await fetch(`http://localhost:8080/api/income?start=${start.toISOString().split('T')[0]}&end=${end.toISOString().split('T')[0]}`, {
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
                const fetchedExpense = await getExpensesOverTime(new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)), new Date(new Date().setFullYear(new Date().getFullYear() + 1, 0, 1)), undefined, 'one-time')
                const fetchedIncome = await getIncomesOverTime(new Date(new Date().setFullYear(new Date().getFullYear(), 0, 1)), new Date(new Date().setFullYear(new Date().getFullYear() + 1, 0, 1)))

                const totalPerMonth: any = {}
                fetchedExpense?.reverse().forEach(
                    (expense: Transaction) => {
                        const date = new Date(expense?.date);
                        if (!totalPerMonth[date.toLocaleDateString('en-US', { year: "numeric", month: "short" })]) {
                            totalPerMonth[date.toLocaleDateString('en-US', { year: "numeric", month: "short" })] = [0, 0]
                        }
                        totalPerMonth[date.toLocaleDateString('en-US', { year: "numeric", month: "short" })][0] += parseFloat(expense.amount);
                    }
                )

                console.log(fetchedIncome)
                fetchedIncome?.reverse().forEach(
                    (income: Transaction) => {
                        const date = new Date(income?.income_date);
                        if (!totalPerMonth[date.toLocaleDateString('en-US', { year: "numeric", month: "short" })]) {
                            totalPerMonth[date.toLocaleDateString('en-US', { year: "numeric", month: "short" })] = [0, 0]
                        }
                        totalPerMonth[date.toLocaleDateString('en-US', { year: "numeric", month: "short" })][1] += parseFloat(income.amount);
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
                            label: 'Total expense',
                            data: expenseData,
                            backgroundColor: 'rgba(226, 45, 45, 1)'
                        },
                        {
                            label: 'Total income',
                            data: incomeData,
                            backgroundColor: 'rgba(52, 124, 206, 1)'
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
    }, [])

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
        <div className="h-[40vh] w-full min-w-[600px] max-w-[720px] cursor-pointer">
            {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>
    )
}