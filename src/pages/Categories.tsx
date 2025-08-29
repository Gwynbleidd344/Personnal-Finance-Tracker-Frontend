import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../components/UI/ErrorMessage";
import { AnimatePresence, motion } from "framer-motion";

type Category = {
    id: string;
    name: string;
    created_at: string;
};

type Message = {
    message: string;
    error?: string;
};

export default function Categories() {
    const token = localStorage.getItem("accessToken");

    const [categoryReload, setCategoryReload] = useState<boolean>(false);
    const [categoryList, setCategoryList] = useState<Array<Category> | null>(
        null
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [notificationMessage, setNotificationMessage] =
        useState<Message | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [searchFilter, setSearchFilter] = useState<string>("");
    const searchFilterRef = useRef<string>("");
    const categoryIdRef = useRef<string>("");
    const categoryNameRef = useRef<string>("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/categories/", {
            headers: { Authorization: "Bearer " + token },
        })
            .then(async (res) => {
                return await res.json().then((res) => {
                    if ("message" in res) {
                        setNotificationMessage(res);
                        return [];
                    }
                    return res;
                });
            })
            .then((res) => setCategoryList(res))
            .catch(async (rej) => await handleNotification(rej));
        setCategoryReload(false);
    }, [categoryReload]);

    async function handleNotification(res: any) {
        return await res.json().then((res: any) => {
            if ("message" in res) {
                setNotificationMessage(res);
            }
        });
    }

    function handleCreate(categoryName: string) {
        fetch(`http://localhost:8080/api/categories/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ name: categoryName }),
        })
            .then(async (res) => await handleNotification(res))
            .then(() => setCategoryReload(true))
            .catch(async (rej) => await handleNotification(rej))
            .finally(() => clearModal());
    }

    function handleUpdate(categoryId: string, categoryName: string) {
        fetch(`http://localhost:8080/api/categories/${categoryId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ name: categoryName }),
        })
            .then(async (res) => await handleNotification(res))
            .then(() => setCategoryReload(true))
            .finally(() => clearModal());
    }

    function handleDelete(categoryId: string, force?: boolean) {
        fetch(
            `http://localhost:8080/api/categories/${categoryId}?force=${force}`,
            {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
            }
        )
            .then(async (res) => await handleNotification(res))
            .catch(() => setCategoryReload(true))
            .finally(() => clearModal());
    }

    function clearModal() {
        closeModal();
        setIsUpdating(false);
        setIsCreating(false);
        categoryNameRef.current = "";
        categoryIdRef.current = "";
    }

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
        <>
            <AnimatePresence>
                {notificationMessage ? (
                    <ErrorMessage
                        message={
                            notificationMessage?.error || notificationMessage?.message
                        }
                        onClose={() => {
                            setNotificationMessage(null);
                        }}
                    />
                ) : null}
            </AnimatePresence>

            <div className="h-[94vh] w-full p-5 bg-gray-100 rounded-lg">
                <div className="flex justify-between items-center mb-6 border-b border-gray-300">
                    <h3 className="text-3xl font-bold text-gray-800 p-2 mb-3">Categories</h3>
                </div>

                <div className="w-full flex flex-col-reverse gap-6 xl:flex-row-reverse">
                    <div className="relative w-full xl:w-7/10 flex flex-col gap-4 rounded-2xl overflow-y-scroll max-h-[calc(100vh-200px)]">
                        <div className="sticky top-0 bg-white font-semibold w-full px-6 py-3 rounded-lg shadow-sm grid grid-cols-3 gap-x-5 items-center text-gray-500 text-sm">
                            <div>Name</div>
                            <div className="text-center">Created</div>
                            <div className="text-center">Actions</div>
                        </div>

                        <motion.div
                            className="w-full px-6 py-5 rounded-xl shadow-sm flex justify-center items-center bg-white hover:bg-gray-50 cursor-pointer"
                            layout
                            onClick={() => {
                                setIsCreating(true);
                                openModal();
                            }}
                            whileHover={{ scale: 0.99 }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <i className="bx bx-plus text-3xl text-gray-400" />
                        </motion.div>

                        <AnimatePresence>
                            {categoryList
                                ?.filter((a) =>
                                    a?.name?.toLowerCase().includes(searchFilter.toLowerCase())
                                )
                                .sort((a, b) => (a?.name > b?.name ? 1 : -1))
                                .map((category: Category) => {
                                    const formattedDate = new Date(
                                        category["created_at"]?.valueOf()
                                    ).toLocaleDateString("en-FR", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <motion.div
                                            key={category.id}
                                            className="w-full px-6 py-4 rounded-xl shadow-sm grid grid-cols-3 gap-x-5 items-center bg-white hover:bg-gray-50 transition-colors text-gray-800"
                                            layout
                                            whileHover={{ scale: 0.995 }}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="text-lg font-medium">
                                                {category["name"]}
                                            </div>
                                            <div className="text-center text-sm text-gray-600">
                                                {formattedDate}
                                            </div>
                                            <div className="flex justify-center gap-3 flex-wrap">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        categoryIdRef.current = category["id"];
                                                        setIsUpdating(true);
                                                        openModal();
                                                    }}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                                                    type="button"
                                                >
                                                    Rename
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        categoryIdRef.current = category["id"];
                                                        setIsUpdating(false);
                                                        openModal();
                                                    }}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                                                    type="button"
                                                >
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                        </AnimatePresence>
                    </div>

                    <div className="relative max-w-[350px] min-w-[250px] bg-white rounded-xl shadow-md p-6 flex-1 h-fit">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Search Categories
                        </h4>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setSearchFilter(searchFilterRef.current);
                            }}
                            className="flex flex-col gap-4"
                        >
                            <div className="relative">
                                <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    ref={searchInputRef}
                                    id="searchFilter"
                                    onChange={(e) => (searchFilterRef.current = e.target.value)}
                                    className="bg-gray-50 w-full h-10 pl-10 pr-4 rounded-lg text-gray-800 border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Search by name..."
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        if (searchInputRef.current) {
                                            searchInputRef.current.value = "";
                                        }
                                        searchFilterRef.current = "";
                                        setSearchFilter("");
                                    }}
                                    className="text-gray-700 font-medium bg-white border border-gray-300 py-1.5 px-4 rounded-lg hover:bg-gray-100"
                                >
                                    Clear
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-white font-medium bg-blue-600 py-1.5 px-4 rounded-lg hover:bg-blue-700"
                                >
                                    Search
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.2 } }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        onClick={clearModal}
                    >
                        <motion.div
                            className="relative w-full max-w-md m-4 bg-white rounded-2xl shadow-xl border border-gray-200/50"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } }}
                            exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <div className="flex items-center justify-between p-5 border-b rounded-t-2xl bg-gray-50">
                                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                    <i className={modalDetails.icon}></i>
                                    {modalDetails.title}
                                </h3>
                                <button
                                    onClick={clearModal}
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
                                >
                                    <i className="bx bx-x text-2xl"></i>
                                </button>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    isCreating
                                        ? handleCreate(categoryNameRef.current)
                                        : isUpdating
                                            ? handleUpdate(categoryIdRef.current, categoryNameRef.current)
                                            : handleDelete(
                                                categoryIdRef.current,
                                                (
                                                    document.getElementById(
                                                        "forceCategoryDelete"
                                                    ) as HTMLInputElement
                                                )?.checked
                                            );
                                }}
                            >
                                <div className="p-6 space-y-4">
                                    {isUpdating || isCreating ? (
                                        <div>
                                            <label
                                                htmlFor="categoryNewName"
                                                className="block mb-2 text-sm font-medium text-gray-900"
                                            >
                                                Category Name
                                            </label>
                                            <input
                                                type="text"
                                                name="categoryNewName"
                                                id="categoryNewName"
                                                onChange={(e) =>
                                                    (categoryNameRef.current = e.target.value)
                                                }
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                placeholder="Enter a name"
                                                required
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-600">
                                                Are you sure you want to delete this category? This
                                                action cannot be undone.
                                            </p>
                                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <input
                                                    id="forceCategoryDelete"
                                                    type="checkbox"
                                                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 accent-red-500"
                                                />
                                                <label
                                                    htmlFor="forceCategoryDelete"
                                                    className="text-sm font-medium text-red-800"
                                                >
                                                    Force delete even if it's in use
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center justify-end p-5 space-x-3 border-t border-gray-200 rounded-b-2xl bg-gray-50">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={clearModal}
                                        className="font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-4 focus:outline-none ${modalDetails.confirmColor}`}
                                    >
                                        {modalDetails.confirmText}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}