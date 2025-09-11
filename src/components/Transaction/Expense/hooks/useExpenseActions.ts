// src/components/expense/hooks/useExpenseActions.ts
import type { Dispatch, SetStateAction } from 'react';
import { getAccessToken } from '../../../../utils/getCookiesToken';
import type { Category, Transaction } from '../../Types';
import { fetchCategories, fetchExpenses } from '../../../../utils/fetch/Fetch';
import downloadReceipt from 'js-file-download'


type Params = {
    setTransactions: Dispatch<SetStateAction<Transaction[]>>;
    setCategories: Dispatch<SetStateAction<Category[]>>;
    setCategoryList: Dispatch<SetStateAction<{ name: string }[]>>;
    setIsModalOpen?: (b: boolean) => void;
    setEditingId?: (id: string | null) => void;
    setIsConfirmModalOpen?: (b: boolean) => void;
    setErrorMessage?: (error: string) => void;
    t: (key: string, fallback?: string) => string;
};

export default function useExpenseActions({
    setTransactions,
    setCategories,
    setCategoryList,
    setIsModalOpen,
    setEditingId,
    setIsConfirmModalOpen,
    setErrorMessage,

    t,
}: Params) {
    const token = getAccessToken();
    const base = import.meta.env.VITE_API_URL;

    const getErrorMessage = (error?: { message?: string, error?: string }, customError?: string) => setErrorMessage?.(error?.error || error?.message || customError || "Unexpected error")

    const fetchAllTransactions = async () => {
        if (!token) return getErrorMessage?.(undefined, 'No token available');
        try {
            await fetchExpenses(token, setTransactions, t);
        } catch (err: any) {
            console.error('fetchAllTransactions error', err);
            return getErrorMessage?.()
        }
    };

    const fetchAllCategories = async () => {

        if (!token) return getErrorMessage?.(undefined, 'No token available');
        try {
            await fetchCategories(token, setCategories, setCategoryList)
        } catch (err: any) {
            console.error('fetchAllCategories error', err);
            return getErrorMessage?.()
        }
    };

    const refreshAll = async () => {
        await Promise.all([fetchAllTransactions(), fetchAllCategories()]);
    };

    const handleAddTransaction = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        if (!token) return;
        const form = e.currentTarget;
        const fd = new FormData(form);
        const startDate = String(fd.get('startDate'))
        const endDate = String(fd.get('endDate'))

        try {
            if (Boolean(new Date(startDate).getTime()) && new Date(endDate) < new Date(startDate)) {
                return getErrorMessage?.(undefined, 'End date must be after start date')
            }
            const res = await fetch(`${base}/api/expenses`, {
                mode: 'cors',
                credentials: 'include',
                method: 'POST',
                headers: { Authorization: `${token}` },
                body: fd,
            });

            if (!res.ok) {

                const error = await res.json()
                return getErrorMessage?.(error, 'Error when creating')
            }
            await refreshAll();
            setIsModalOpen?.(false);
            form.reset();

        } catch (err: any) {
            console.error('handleAddTransaction error', err);
            return getErrorMessage?.()

        }
    };

    const handleUpdateTransaction = async (
        e: React.FormEvent<HTMLFormElement> | undefined,
        id?: string,
    ) => {
        if (!token) return;
        if (!e && !id) return;

        if (e) {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            const txId = id ?? (form as any).dataset?.id;
            if (!txId) return;

            const startDate = String(fd.get('startDate'))
            const endDate = String(fd.get('endDate'))

            try {
                if (Boolean(new Date(startDate).getTime()) && new Date(endDate) < new Date(startDate)) {
                    return getErrorMessage?.(undefined, 'End date must be after start date')
                }
                const res = await fetch(`${base}/api/expenses/${txId}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: 'PUT',
                    headers: { Authorization: `${token}` },
                    body: fd,
                });
                if (!res.ok) {
                    const error = await res.json()
                    return getErrorMessage?.(error, 'Error when updating')

                }
                await refreshAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
                form.reset();

            } catch (err: any) {
                console.error('handleUpdateTransaction error', err);
                return getErrorMessage?.()

            }
        } else {
            try {
                const res = await fetch(`${base}/api/expenses/${id}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: 'PUT',
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });

                if (!res.ok) {
                    const error = await res.json()
                    return getErrorMessage?.(error, 'Error when updating')
                }
                await refreshAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
            } catch (err: any) {
                console.error('programmatic update error', err);
                return getErrorMessage?.()

            }
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${base}/api/expenses/${id}`, {
                mode: 'cors',
                credentials: 'include',
                method: 'DELETE',
                headers: { Authorization: `${token}` },
            });
            if (!res.ok) {

                const error = await res.json()
                return getErrorMessage?.(error, 'Error when deleting')

            }
            await refreshAll();
            setIsConfirmModalOpen?.(false);
            setEditingId?.(null);

        } catch (err: any) {
            console.error('delete error', err);
            getErrorMessage?.()

        }
    };

    const handleChangeTransaction = (id: string) => {
        setEditingId?.(id);
        setIsModalOpen?.(true);
    };

    const handleDownloadReceipt = async (id: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${base}/api/receipts/${id}`, {
                mode: 'cors',
                credentials: 'include',
                headers: { Authorization: `${token}` },
            });

            if (!res.ok) {
                const error = await res.json()
                return getErrorMessage?.(error, 'Error when downloading receipt')
            }
            const blob = await res.blob();
            const filename = `${id}.${res.headers.get('content-type')?.split('/')[1] ?? 'bin'}`;
            return downloadReceipt(blob, filename)
            // const url = URL.createObjectURL(blob);
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = filename;
            // document.body.appendChild(a);
            // a.click();
            // a.remove();
            // URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error('download error', err);
            getErrorMessage?.()

        }
    };

    return {
        refreshAll,
        fetchAllTransactions,
        fetchAllCategories,
        handleAddTransaction,
        handleUpdateTransaction,
        handleChangeTransaction,
        handleDownloadReceipt,
        handleDeleteTransaction,
    };
}
