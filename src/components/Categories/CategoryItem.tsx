import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Edit3, Trash2 } from "lucide-react";
import {
    FaUtensils,
    FaFilm,
    FaTaxi,
    FaBolt,
    FaCoffee,
    FaPlus,
    FaTrash,
} from "react-icons/fa";

type Category = {
    id: string;
    name: string;
    created_at: string;
};

type Props = {
    category: Category;
    onRename: (category: Category) => void;
    onDelete: (id: string) => void;
};

// Match category colors from your TransactionCard design
const categoryColors: Record<string, string> = {
    Food: "bg-red-700",
    Entertainment: "bg-purple-700",
    Transport: "bg-green-700",
    Utilities: "bg-yellow-700",
    Coffee: "bg-orange-700",
    Doctor: "bg-green-700",
    Other: "bg-gray-500",
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

export default function CategoryItem({ category, onRename, onDelete }: Props) {
    const { t } = useTranslation();

    const formattedDate = new Date(category.created_at).toLocaleDateString(
        t("local_date_format", "en-US"),
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    );

    const bgColor = categoryColors[category.name] || "bg-gray-400";
    const icon = categoryIcons[category.name] || <FaTrash className="text-white" />;

    return (
        <motion.div
            key={category.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 0.995 }}
            className="relative w-full px-5 py-4 rounded-lg shadow-sm flex justify-between 
                       bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600/50 
                       hover:shadow-md transition-colors"
        >
            <div
                className={`absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full ${bgColor} shadow`}
            >
                {icon}
            </div>

            <div className="flex flex-col mt-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {category.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formattedDate}
                </span>
            </div>

            <div className="flex flex-col gap-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRename(category)}
                    className="flex items-center justify-center h-8 w-8 rounded-md 
                               bg-gray-300 text-gray-900 transition-all duration-200 
                               hover:scale-105 hover:bg-gray-400 hover:shadow-lg 
                               dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    type="button"
                >
                    <Edit3 className="w-4 h-4" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(category.id)}
                    className="flex items-center justify-center h-8 w-8 rounded-md 
                               bg-red-700/90 text-gray-100 shadow-sm transition-all duration-200 
                               hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95"
                    type="button"
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}
