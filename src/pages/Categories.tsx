import { useEffect, useState } from "react";
import ErrorMessage from "../components/UI/ErrorMessage";
import { useTranslation } from "react-i18next";
import CategoryList from "../components/Categories/CategoryList";
import CategoryModal from "../components/Categories/CategoryModal";
import SearchPanel from "../components/Categories/SearchPanel";
import { getAccessToken } from "../utils/getCookiesToken";
import handleRequestError from "../utils/handleRequestError";

type Category = {
    id: string;
    name: string;
    created_at: string;
};

export default function Categories() {
    const { t } = useTranslation();
    const token = getAccessToken()

    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // controlled modal fields
    const [modalCategoryName, setModalCategoryName] = useState<string>("");
    const [modalCategoryId, setModalCategoryId] = useState<string>("");

    const [searchFilter, setSearchFilter] = useState<string>("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    function fetchCategories() {
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/`, {
            mode: 'cors', credentials: 'include',
            headers: { Authorization: `${token}` },
        })
            .then(async (res) => { return handleRequestError(res, 'Failed to fetch categories') })
            .then(async res => await res?.json())
            .then((res) => setCategoryList(res))
            .catch(rej => setNotificationMessage(rej.message))
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    function handleCreate(categoryName: string) {
        if (categoryName.length > 15) {
            setNotificationMessage("Category name cannot be longer than 15 characters.");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/categories/`, {
            mode: 'cors', credentials: 'include',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`
            },
            body: JSON.stringify({ name: categoryName }),
        })
            .then(async (res) => { return handleRequestError(res, 'Failed to create categories') })
            .then(() => fetchCategories())
            .catch(rej => setNotificationMessage(rej.message))
            .finally(() => clearModal());
    }

    function handleUpdate(categoryId: string, categoryName: string) {
        if (categoryName.length > 15) {
            setNotificationMessage("Category name cannot be longer than 15 characters.");

            return;
        }
        fetch(`${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`, {
            method: "PUT",
            mode: 'cors', credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`
            },
            body: JSON.stringify({ name: categoryName }),
        })
            .then(async (res) => { return handleRequestError(res, 'Failed to update categories') })
            .then(() => fetchCategories())
            .catch(rej => setNotificationMessage(rej.message))
            .finally(() => clearModal());
    }

    function handleDelete(categoryId: string, force?: boolean) {
        fetch(
            `${import.meta.env.VITE_API_URL}/api/categories/${categoryId}?force=${force}`,
            {
                mode: 'cors', credentials: 'include',
                headers: { Authorization: `${token}` },
                method: "DELETE",
            }
        )
            .then(async (res) => { return handleRequestError(res, 'Failed to delete categories') })
            .then(() => fetchCategories())
            .catch(rej => setNotificationMessage(rej.message))
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
            <ErrorMessage message={notificationMessage} onClose={() => setNotificationMessage('')} />

            <div className={`lg:h-[96vh] h-[calc(96vh-120px)] w-full p-5 bg-gray-100 dark:border-2 dark:border-gray-800 dark:bg-gray-900 rounded-lg`}>
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 dark:border-gray-700">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 p-2 mb-3">
                        {t('categories_title', 'Categories')}
                    </h3>
                </div>

                <div className="w-full flex flex-col gap-4  h-full max-h-[calc(100vh-200px)]">
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
