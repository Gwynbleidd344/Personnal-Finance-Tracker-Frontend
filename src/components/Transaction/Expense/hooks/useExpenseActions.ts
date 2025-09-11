import type { Dispatch, SetStateAction } from 'react';
import { getAccessToken } from '../../../../utils/getCookiesToken';
import type { Transaction } from '../../Types';

type Params = {
    setTransactions: Dispatch<SetStateAction<Transaction[]>>;
    setIsModalOpen?: (b: boolean) => void;
    setEditingId?: (id: string | null) => void;
    setIsConfirmModalOpen?: (b: boolean) => void;
};

export default function useExpenseActions({
    setTransactions,
    setIsModalOpen,
    setEditingId,
    setIsConfirmModalOpen,
}: Params) {
    const token = getAccessToken();
    const base = import.meta.env.VITE_API_URL;

    
    const mapItem = (item: any): Transaction => ({
        id: String(item.id),
        name: item.description ?? item.name ?? '',
        amount: Number(item.amount) || 0,
        date: item.expense_date ?? item.date ?? '',
        type: 'expense',
        start_date: item.start_date ?? item.startDate ?? null,
        end_date: item.end_date ?? item.endDate ?? null,
        receipt_id: item.receipt_id ?? item.receiptId ?? null,
        is_recurrent: Boolean(item.is_recurrent ?? item.isRecurrent),
        category:
            typeof item.category === 'string'
                ? item.category
                : (item.category?.name ?? item.category_name ?? undefined),
        source: item.source ?? undefined,
    });

  
    const fetchAll = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${base}/api/expenses`, {
                credentials: 'include',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const data = await res.json();
            const list = Array.isArray(data) ? data.map(mapItem) : [];
            setTransactions(list);
        } catch (err) {
            console.error('fetchAll error', err);
        }
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
                method: 'POST',
                credentials: 'include',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                console.error('add failed', res.status, text);
                return;
            }
            await fetchAll();
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
                    method: 'PUT',
                    credentials: 'include',
                    headers: { Authorization: `Bearer ${token}` },
                    body: fd,
                });
                if (!res.ok) {
                    const text = await res.text().catch(() => '');
                    console.error('update failed', res.status, text);
                    return;
                }
                await fetchAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
                form.reset();
            } catch (err) {
                console.error('handleUpdateTransaction error', err);
            }
        } else {
            
            try {
                const res = await fetch(`${base}/api/expenses/${id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}),
                });
                if (!res.ok) return;
                await fetchAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
            } catch (err) {
                console.error('programmatic update error', err);
            }
        }
    };

    
    const handleChangeTransaction = (id: string) => {
        setEditingId?.(id);
        setIsModalOpen?.(true);
    };

    const handleDownloadReceipt = async (id: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${base}/api/expenses/${id}/receipt`, {
                credentials: 'include',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const res2 = await fetch(`${base}/api/receipts/${id}`, {
                    credentials: 'include',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res2.ok) return;
                const blob2 = await res2.blob();
                const url2 = URL.createObjectURL(blob2);
                const a2 = document.createElement('a');
                a2.href = url2;
                a2.download = `receipt_${id}`;
                document.body.appendChild(a2);
                a2.click();
                a2.remove();
                URL.revokeObjectURL(url2);
                return;
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `receipt_${id}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('download error', err);
        }
    };

    
    const handleDeleteTransaction = async (id: string) => {
        if (!token) return;
        try {
            const res = await fetch(`${base}/api/expenses/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            await fetchAll();
            setIsConfirmModalOpen?.(false);
            setEditingId?.(null);
        } catch (err) {
            console.error('delete error', err);
        }
    };

    return {
        fetchAll,
        handleAddTransaction,
        handleUpdateTransaction,
        handleChangeTransaction,
        handleDownloadReceipt,
        handleDeleteTransaction,
    };
}
