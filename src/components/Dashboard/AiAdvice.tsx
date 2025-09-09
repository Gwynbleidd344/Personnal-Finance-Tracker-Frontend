import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect } from "react";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function AiAdvice() {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [advice, setAdvice] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);

    const language = localStorage.getItem("appLanguage") || "en";
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setShowAdvice(false);
            try {
                const headers = { Authorization: "Bearer " + accessToken };

                const [expensesRes, incomesRes, categoriesRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/incomes`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/categories`, { headers }),
                ]);

                const [expensesData, incomesData, categoriesData] = await Promise.all([
                    expensesRes.json(),
                    incomesRes.json(),
                    categoriesRes.json(),
                ]);

                setExpenses(expensesData);
                setIncomes(incomesData);
                setCategories(categoriesData);

                const prompt = `
                    Give the answer in the given language: ${language}
                    - English if 'en', French if 'fr'
                    Give in one short sentence (max 20 words) a clever financial advice based on expenses, incomes, and categories.
                    Incomes: ${JSON.stringify(incomesData)}
                    Categories: ${JSON.stringify(categoriesData)}
                    Expenses: ${JSON.stringify(expensesData)}
                `;

                const result = await model.generateContent(prompt);
                const text = result.response.text();
                setAdvice(text);

                setTimeout(() => setShowAdvice(true), 50);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accessToken, language]);

    return (
        <section className="flex flex-wrap items-end text-gray-800 gap-6 border border-gray-300 dark:border-gray-800 dark:bg-gray-800 dark:text-white rounded-lg px-6 py-4 m-4 mb-0 mx-0">
            {loading ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">AI is thinking</span>
                    <span className="flex gap-1 pt-1">
                        <span className="w-2 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
                    </span>
                </div>
            ) : (
                <p
                    className={`text-sm flex items-center gap-2 transition-opacity duration-700 ${
                        showAdvice ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <i className="bx bx-light-bulb text-lg"></i>
                    <span>Tips: {advice}</span>
                </p>
            )}
        </section>
    );
}
