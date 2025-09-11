import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type Props = {
    isOpen: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    categoryName: string;
    categoryNameLength: number;
    onClose: () => void;
    onSubmit: (payload?: any) => void;
    onChangeName: (name: string) => void;
};

export default function CategoryModal({ isOpen, isCreating, isUpdating, categoryName, categoryNameLength, onClose, onSubmit, onChangeName }: Props) {
    const { t } = useTranslation();

    const modalDetails = isCreating
        ? {
            title: "Create New Category",
            icon: "bx bx-plus-circle",
            confirmText: "Create",
            confirmColor: "bg-blue-600 hover:bg-blue-700",
        }
        : isUpdating
            ? {
                title: "Rename Category",
                icon: "bx bx-pencil",
                confirmText: "Save Changes",
                confirmColor: "bg-blue-600 hover:bg-blue-700",
            }
            : {
                title: "Delete Category",
                icon: "bx bx-trash",
                confirmText: "Delete",
                confirmColor: "bg-red-600 hover:bg-red-700",
            };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-md m-4 bg-white rounded-2xl shadow-xl border border-gray-200/50 dark:bg-gray-800 dark:border-gray-700"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
                        exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                        onClick={(e) => e.stopPropagation()}
                    >
                            <div className="flex items-center justify-between p-5 border-b rounded-t-2xl bg-gray-50 dark:bg-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-3">
                                <i className={modalDetails.icon}></i>
                                {modalDetails.title}
                            </h3>
                            <button
                                onClick={onClose}
                                type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-gray-100"
                            >
                                <i className="bx bx-x text-2xl"></i>
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSubmit();
                            }}
                        >
                            <div className="p-6 space-y-4">
                                {isUpdating || isCreating ? (
                                    <div>
                                        <label htmlFor="categoryNewName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {t('category_name_label', 'Category Name')}
                                        </label>
                                        <input
                                            type="text"
                                            name="categoryNewName"
                                            id="categoryNewName"
                                            maxLength={15}
                                            value={categoryName}
                                            onChange={(e) => onChangeName(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                            placeholder={t('enter_category_placeholder', 'Enter a name')}
                                            required
                                        />
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{categoryNameLength}/15</span>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('delete_confirm_text', 'Are you sure you want to delete this category? This action cannot be undone.')}</p>
                                        <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                                            <input id="forceCategoryDelete" type="checkbox" className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 accent-red-500" />
                                            <label htmlFor="forceCategoryDelete" className="text-sm font-medium text-red-800 dark:text-red-300">{t('force_delete_label', 'Force delete even if it\'s in use')}</label>
                                        </div>
                                    </>
                                )}

                            </div>
                            <div className="flex items-center justify-end p-5 space-x-3 border-t border-gray-200 dark:border-gray-900 rounded-b-2xl bg-gray-50 dark:bg-gray-700">
                                <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200">
                                    {t('cancel', 'Cancel')}
                                </motion.button>
                                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-4 focus:outline-none ${modalDetails.confirmColor}`}>
                                    {modalDetails.confirmText}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
