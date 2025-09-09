import { AnimatePresence, motion } from "framer-motion";
import CategoryItem from "./CategoryItem";
import useWindowDimensions from "../../hooks/useWindowDimensions";

type Category = {
    id: string;
    name: string;
    created_at: string;
};

type Props = {
    categories: Array<Category> | null;
    searchFilter: string;
    onRename: (category: Category) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
};

export default function CategoryList({ categories, searchFilter, onRename, onDelete, onCreate }: Props) {
    const { width } = useWindowDimensions()
    const isWideViewPort = () => width > 1024

    return (
    <div className={`relative w-full ${isWideViewPort() ? "grid grid-cols-3" : "flex flex-col h-[calc(100%-120px)]"} gap-4 rounded-2xl pb-4 overflow-y-scroll max-h-full`}>
            <motion.div
        className="w-full px-6 py-5 rounded-xl shadow-sm flex justify-center items-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"
                layout
                onClick={onCreate}
                whileHover={{ scale: 0.99 }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
            >
                <i className="bx bx-plus text-3xl text-gray-400" />
            </motion.div>

            <AnimatePresence>
                {categories
                    ?.filter((a) => a?.name?.toLowerCase().includes(searchFilter.toLowerCase()))
                    .sort((a, b) => (a?.name > b?.name ? 1 : -1))
                    .map((category) => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            onRename={onRename}
                            onDelete={onDelete}
                        />
                    ))}
            </AnimatePresence>
        </div>
    );
}
