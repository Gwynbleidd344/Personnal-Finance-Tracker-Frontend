import { useTranslation } from "react-i18next";

type ChartOptions = {
    start: Date;
    end: Date;
    category?: string;
    type?: string;
};

type ExpenseFilterProps = {
    chartOptions: ChartOptions;
    setChartOptions: React.Dispatch<React.SetStateAction<ChartOptions>>;
    categoryList: any[];
};

export default function ExpenseFilter({
    chartOptions,
    setChartOptions,
    categoryList
}: ExpenseFilterProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-end lg:justify-start justify-center gap-6 border border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:text-white rounded-lg px-6 py-4 m-4 mb-0 mx-0">
            {/* Start Date */}
            <div className="flex flex-col text-gray-600 dark:text-gray-100">
                <label htmlFor="startExpenseDate" className="text-sm font-medium  mb-1">
                    {t("start_date", "Start date")}
                </label>
                <input
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                    type="date"
                    id="startExpenseDate"
                    defaultValue={new Date(
                        new Date().setFullYear(new Date().getFullYear(), 0, 1)
                    )
                        .toISOString()
                        .split("T")[0]}
                    onChange={(e) =>
                        setChartOptions({
                            ...chartOptions,
                            start: new Date(e.target.value || 0),
                        })
                    }
                />
            </div>

            {/* End Date */}
            <div className="flex flex-col text-gray-600 dark:text-gray-100">
                <label htmlFor="endExpenseDate" className="text-sm font-medium text-gray-600 mb-1 dark:text-gray-100">
                    {t("end_date", "End date")}
                </label>
                <input
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                    type="date"
                    id="endExpenseDate"
                    defaultValue={new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1, 0, 1)
                    )
                        .toISOString()
                        .split("T")[0]}
                    onChange={(e) =>
                        setChartOptions({
                            ...chartOptions,
                            end: new Date(e.target.value || "30000"),
                        })
                    }
                />
            </div>

            {/* Category */}
            <div className="flex flex-col min-w-[160px]">
                <label htmlFor="categoryId" className="text-sm font-medium text-gray-600 dark:text-gray-100 mb-1">
                    {t("category", "Category")}
                </label>
                <select
                    id="categoryId"
                    className="border border-gray-300 dark:border-gray-600  rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                    onChange={(e) =>
                        setChartOptions({
                            ...chartOptions,
                            category: e.target.value,
                        })
                    }
                >
                    <option value="">{t("all", "All")}</option>
                    {Array.isArray(categoryList) &&
                        categoryList.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                </select>
            </div>

            {/* Expense Type */}
            <div className="flex flex-col min-w-[160px]">
                <label htmlFor="expenseType" className="text-sm font-medium text-gray-600 dark:text-gray-100 mb-1">
                    {t("expense_type", "Expense type")}
                </label>
                <select
                    id="expenseType"
                    className="border border-gray-300 dark:border-gray-600  rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition"
                    onChange={(e) =>
                        setChartOptions({
                            ...chartOptions,
                            type: e.target.value,
                        })
                    }
                >
                    <option value="">{t("all", "All")}</option>
                    <option value="one-time">{t("one_time", "One-time")}</option>
                    <option value="recurring">{t("recurring", "Recurring")}</option>
                </select>
            </div>
        </div>
    );
}
