import { motion } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

type Props = {
    onSearch: (value: string) => void;
    onClear: () => void;
};

export default function SearchPanel({ onSearch, onClear }: Props) {
    const { t } = useTranslation();
    const searchInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="relative bg-gray-50 rounded-xl shadow-sm p-3 h-fit dark:bg-gray-800">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSearch(searchInputRef.current?.value || "");
                }}
                className="flex justify-between gap-3 flex-row"
            >
                <div className="relative w-full">
                    <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        ref={searchInputRef}
                        id="searchFilter"
                        onChange={() => {}}
                        className="bg-white w-full h-10 pl-10 pr-4 rounded-lg text-gray-800 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        placeholder={t('search_placeholder', 'Search by name...')}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (searchInputRef.current) searchInputRef.current.value = "";
                            onClear();
                        }}
                        className="text-gray-700 font-medium bg-white border border-gray-300 py-1.5 px-4 max-sm:px-2.5 rounded-lg hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                        {t('clear', 'Clear')}
                    </motion.button>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-white font-medium bg-blue-600 py-1.5 px-4 max-sm:px-2.5 rounded-lg hover:bg-blue-700"
                    >
                        {t('search', 'Search')}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
