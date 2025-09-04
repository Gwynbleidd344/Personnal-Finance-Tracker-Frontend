import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { useTranslation } from 'react-i18next';

ChartJS.register(Tooltip, Legend, ArcElement);

export const PieChart = ({ chartValueOptions }: any) => {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "right" as const,
                labels: {
                    color: "#374151",
                    font: { size: 14, weight: 500 },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        return ` $${value.toLocaleString()}`;
                    },
                },
            },
        },
    };

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const expenses = await getExpensesOverTime(chartValueOptions?.start, chartValueOptions?.end, chartValueOptions?.category, chartValueOptions?.type);

                const expensesByCategory = expenses.reduce(
                    (acc: Record<string, number>, expense: any) => {
                        const category = expense.category_fk?.name || t("uncategorized");
                        acc[category] = (acc[category] || 0) + expense.amount;
                        return acc;
                    },
                    {}
                );

                const labels = Object.keys(expensesByCategory);
                const data = Object.values(expensesByCategory);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Expenses by Category",
                            data,
                            backgroundColor: [
                                "#424B54",
                                "#E1CE7A",
                                "#EBCFB2",
                                "#C5BAAF",
                                "#5CA39B",
                                "#A6D833",
                            ],
                            borderColor: [
                                "rgba(255, 99, 132, 1)",
                                "rgba(54, 162, 235, 1)",
                                "rgba(255, 206, 86, 1)",
                                "rgba(75, 192, 192, 1)",
                                "rgba(153, 102, 255, 1)",
                                "rgba(255, 159, 64, 1)",
                            ],
                            borderWidth: 0,
                        },
                    ],
                });
            } catch (err) {
                setError("⚠️ Failed to fetch expenses.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [chartValueOptions]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[40vh] w-[40vh]">
                <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-700"></span>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="h-[40vh] w-[40vh] flex-1/2 max-w-fit cursor-pointer">
            {chartData && <Pie options={options} data={chartData} />}
        </div>
    );
};
