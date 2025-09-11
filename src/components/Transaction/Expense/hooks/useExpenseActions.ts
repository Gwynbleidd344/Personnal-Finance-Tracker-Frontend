// src/components/expense/hooks/useExpenseActions.ts
import type { Dispatch, SetStateAction } from 'react';
import { getAccessToken } from '../../../../utils/getCookiesToken';
import type { Category, Transaction } from '../../Types';
import { fetchCategories, fetchExpenses }from '../../../../utils/fetch/Fetch';

type Params = {
    setTransactions: Dispatch<SetStateAction<Transaction[]>>;
    setCategories: Dispatch<SetStateAction<Category[]>>;
    setCategoryList: Dispatch<SetStateAction<{ name: string }[]>>;
    setIsModalOpen?: (b: boolean) => void;
    setEditingId?: (id: string | null) => void;
    setIsConfirmModalOpen?: (b: boolean) => void;
    t: (key: string, fallback?: string) => string;
};

export default function useExpenseActions({
    setTransactions,
    setCategories,
    setCategoryList,
    setIsModalOpen,
    setEditingId,
    setIsConfirmModalOpen,
    t,
}: Params) {
    const token = getAccessToken();
    const base = import.meta.env.VITE_API_URL;


    const fetchAllTransactions = async () => {
        if (!token) return;
        try {
            await fetchExpenses(token, setTransactions, t);
        } catch (err) {
            console.error('fetchAllTransactions error', err);
        }
    };

    const fetchAllCategories = async () => {
        if (!token) return;
        try {
            await fetchCategories(token, setCategories, setCategoryList);
        } catch (err) {
            console.error('fetchAllCategories error', err);
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

        try {
            const res = await fetch(`${base}/api/expenses`, {
                mode: 'cors',
                credentials: 'include',
                method: 'POST',
                headers: { Authorization: `${token}` }, 
                body: fd,
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                console.error('add failed', res.status, text);
                return;
            }

            await refreshAll();
            setIsModalOpen?.(false);
            form.reset();
        } catch (err) {
            console.error('handleAddTransaction error', err);
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

            try {
                const res = await fetch(`${base}/api/expenses/${txId}`, {
                    mode: 'cors',
                    credentials: 'include',
                    method: 'PUT',
                    headers: { Authorization: `${token}` },
                    body: fd,
                });
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    console.error('update failed', res.status, text);
                    return;
                }
                await refreshAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
                form.reset();
            } catch (err) {
                console.error('handleUpdateTransaction error', err);
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
                if (!res.ok) return;
                await refreshAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
            } catch (err) {
                console.error('programmatic update error', err);
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
                const text = await res.text().catch(() => '');
                console.error('delete failed', res.status, text);
                return;
            }
            await refreshAll();
            setIsConfirmModalOpen?.(false);
            setEditingId?.(null);
        } catch (err) {
            console.error('delete error', err);
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
            if (!res.ok) return;
            const blob = await res.blob();
            const filename = `${id}.${res.headers.get('content-type')?.split('/')[1] ?? 'bin'}`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('download error', err);
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
