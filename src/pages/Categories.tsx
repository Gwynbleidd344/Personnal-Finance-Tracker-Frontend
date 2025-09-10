import { useEffect, useState } from "react";
import ErrorMessage from "../components/UI/ErrorMessage";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import CategoryList from "../components/Categories/CategoryList";
import CategoryModal from "../components/Categories/CategoryModal";
import SearchPanel from "../components/Categories/SearchPanel";

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
    const { t } = useTranslation();

    const [categoryReload, setCategoryReload] = useState<boolean>(false);
    const [categoryList, setCategoryList] = useState<Array<Category> | null>(
        null
    );
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [notificationMessage, setNotificationMessage] =
        useState<Message | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // controlled modal fields
    const [modalCategoryName, setModalCategoryName] = useState<string>("");
    const [modalCategoryId, setModalCategoryId] = useState<string>("");

    const [searchFilter, setSearchFilter] = useState<string>("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/`, {
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
        if (categoryName.length > 15) {
            setNotificationMessage({
                message: "Category name cannot be longer than 15 characters.",
                error: "Category name cannot be longer than 15 characters.",
            });

            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/`, {
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
        if (categoryName.length > 15) {
            setNotificationMessage({
                message: "Category name cannot be longer than 15 characters.",
                error: "Category name cannot be longer than 15 characters.",
            });

            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`, {
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
            `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}?force=${force}`,
            {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
            }
        )
            .then(async (res) => await handleNotification(res))
            .then(() => setCategoryReload(true))
            .finally(() => clearModal());
    }

    function clearModal() {
        closeModal();
        setIsUpdating(false);
        setIsCreating(false);
        setModalCategoryName("");
        setModalCategoryId("");
    }

    return (
        <>
            <AnimatePresence>
                {notificationMessage ? (
                    <ErrorMessage
                        message={
                            notificationMessage?.error || notificationMessage?.message
                        }
                        onClose={() => setNotificationMessage(null)}
                    />
                ) : null}
            </AnimatePresence>

            <div className={`lg:h-[96vh] h-[calc(96vh-120px)] w-full p-5 bg-gray-100 dark:border-2 dark:border-gray-800 dark:bg-gray-900 rounded-lg`}>
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 dark:border-gray-700">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 p-2 mb-3">
                        {t('categories_title', 'Categories')}
                    </h3>
                </div>

                <div className="w-full flex flex-col gap-3  h-full max-h-[calc(100vh-200px)]">
                    <SearchPanel
                        onSearch={(value: string) => setSearchFilter(value)}
                        onClear={() => setSearchFilter("")}
                    />
                    <CategoryList
                        categories={categoryList}
                        searchFilter={searchFilter}
                        onCreate={() => {
                            setIsCreating(true);
                            setModalCategoryName("");
                            setModalCategoryId("");
                            openModal();
                        }}
                        onRename={(category: Category) => {
                            setModalCategoryName(category.name);
                            setModalCategoryId(category.id);
                            setIsUpdating(true);
                            openModal();
                        }}
                        onDelete={(id: string) => {
                            setModalCategoryId(id);
                            setIsUpdating(false);
                            openModal();
                        }}
                    />
                </div>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                isCreating={isCreating}
                isUpdating={isUpdating}
                categoryName={modalCategoryName}
                categoryNameLength={modalCategoryName.length}
                onClose={clearModal}
                onChangeName={(name: string) => setModalCategoryName(name)}
                onSubmit={() => {
                    if (isCreating) {
                        handleCreate(modalCategoryName);
                    } else if (isUpdating) {
                        handleUpdate(modalCategoryId, modalCategoryName);
                    } else {
                        handleDelete(
                            modalCategoryId,
                            (document.getElementById("forceCategoryDelete") as HTMLInputElement)?.checked
                        );
                    }
                }}
            />
        </>
    );
}
