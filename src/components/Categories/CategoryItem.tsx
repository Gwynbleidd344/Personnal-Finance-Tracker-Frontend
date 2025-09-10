import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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

export default function CategoryItem({ category, onRename, onDelete }: Props) {
    const { t } = useTranslation();

    const formattedDate = new Date(category["created_at"]?.valueOf()).toLocaleDateString(t("local_date_format", "en-US"), {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <motion.div
            key={category.id}
            className="w-full px-4 sm:px-6 py-4 rounded-xl shadow-sm h-fit flex justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100"
            layout
            whileHover={{ scale: 0.995 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex-row">
                <div className="text-lg font-medium">{category["name"]}</div>
                <div className="text-center text-sm text-gray-600">{formattedDate}</div>
            </div>
                <div className="flex justify-center gap-3 flex-col">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRename(category)}
                    className="px-3 py-1.5 cursor-pointer bg-blue-50 text-blue-600 rounded-lg text-sm font-medium dark:bg-blue-900 dark:text-blue-300"
                    type="button"
                >
                    {t('rename', 'Rename')}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(category.id)}
                    className="px-3 py-1.5 cursor-pointer bg-red-50 text-red-600 rounded-lg text-sm font-medium dark:bg-red-900 dark:text-red-300"
                    type="button"
                >
                    {t('delete', 'Delete')}
                </motion.button>
            </div>
        </motion.div>
    );
}
