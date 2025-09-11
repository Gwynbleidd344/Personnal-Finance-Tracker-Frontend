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

    const fetchAll = async () => {
        if (!token) return;
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/expenses`,
                {
                    credentials: 'include',
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!res.ok) throw new Error('Failed to fetch expenses');
            const data = await res.json();
            const mapped: Transaction[] = Array.isArray(data)
                ? data.map((item: any) => {
                      let categoryName: string | undefined;
                      if (typeof item.category === 'string')
                          categoryName = item.category;
                      else if (
                          item.category &&
                          typeof item.category === 'object'
                      )
                          categoryName =
                              item.category.name ??
                              item.category.label ??
                              undefined;
                      else if (typeof item.category_name === 'string')
                          categoryName = item.category_name;
                      else if (
                          typeof item.category_id === 'string' ||
                          typeof item.category_id === 'number'
                      ) {
                          categoryName = String(item.category_id);
                      } else {
                          categoryName = undefined;
                      }

                      return {
                          id: String(item.id),
                          name: item.description ?? item.name ?? '',
                          amount: Number(item.amount) || 0,
                          date: item.expense_date ?? item.date ?? '',
                          type: 'expense',
                          start_date: item.start_date ?? item.startDate ?? null,
                          end_date: item.end_date ?? item.endDate ?? null,
                          receipt_id: item.receipt_id ?? item.receiptId ?? null,
                          is_recurrent: Boolean(
                              item.is_recurrent ?? item.isRecurrent,
                          ),
                          category: categoryName,
                          source: item.source ?? undefined,
                      } as Transaction;
                  })
                : [];
            setTransactions(mapped);
        } catch (err) {
            console.error('[useExpenseActions] fetchAll error', err);
        }
    };

    const handleAddTransaction = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        if (!token) {
            console.warn('No token for add');
            return;
        }
        const form = e.currentTarget;
        const fd = new FormData(form);
        const type = (fd.get('type') as string) ?? 'one-time';
        if (type === 'recurring') {
            const start = fd.get('startDate');
            const end = fd.get('endDate');
            if (!start || !end) {
                console.warn('Missing startDate or endDate for recurring add');
                return;
            }
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/expenses`,
                {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: fd,
                },
            );

            if (!res.ok) {
                const text = await res.text();
                console.error(
                    '[useExpenseActions] add failed',
                    res.status,
                    text,
                );
                return;
            }
            await fetchAll();
            setIsModalOpen?.(false);
            form.reset();
        } catch (err) {
            console.error(
                '[useExpenseActions] handleAddTransaction error',
                err,
            );
        }
    };

    const handleUpdateTransaction = async (
        e: React.FormEvent<HTMLFormElement> | undefined,
        id?: string,
    ) => {
        if (!token) return;
        if (e) {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            const txId = id ?? (form as any).dataset?.id;
            if (!txId) {
                console.warn('update missing id');
                return;
            }

            const type = (fd.get('type') as string) ?? 'one-time';
            if (type === 'recurring') {
                const start = fd.get('startDate');
                const end = fd.get('endDate');
                if (!start || !end) {
                    console.warn(
                        'Missing startDate/endDate for recurring update',
                    );
                    return;
                }
            }

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/expenses/${txId}`,
                    {
                        method: 'PUT',
                        mode: 'cors',
                        credentials: 'include',
                        headers: { Authorization: `Bearer ${token}` },
                        body: fd,
                    },
                );
                if (!res.ok) {
                    const text = await res.text();
                    console.error(
                        '[useExpenseActions] update failed',
                        res.status,
                        text,
                    );
                    return;
                }
                await fetchAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
                form.reset();
            } catch (err) {
                console.error(
                    '[useExpenseActions] handleUpdateTransaction error',
                    err,
                );
            }
        } else {
            if (!id) {
                console.warn('handleUpdateTransaction called without id');
                return;
            }
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/expenses/${id}`,
                    {
                        method: 'PUT',
                        mode: 'cors',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({}),
                    },
                );
                if (!res.ok) {
                    const text = await res.text();
                    console.error(
                        '[useExpenseActions] programmatic update failed',
                        res.status,
                        text,
                    );
                    return;
                }
                await fetchAll();
                setIsModalOpen?.(false);
                setEditingId?.(null);
            } catch (err) {
                console.error(
                    '[useExpenseActions] handleUpdateTransaction (programmatic) error',
                    err,
                );
            }
        }
    };

    const handleChangeTransaction = (id: string) => {
        console.log('[useExpenseActions] handleChangeTransaction', id);
        setEditingId?.(id);
        setIsModalOpen?.(true);
    };

    const handleDownloadReceipt = async (id: string) => {
        if (!token) return;
        const base = import.meta.env.VITE_API_URL;
        const urls = [
            `${base}/api/expenses/${id}/receipt`,
            `${base}/api/receipts/${id}`,
        ];

        const tryFetch = async (url: string) => {
            try {
                const res = await fetch(url, {
                    mode: 'cors',
                    credentials: 'include',
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    const text = await res.text().catch(() => '<no body>');
                    console.warn(
                        `[useExpenseActions] download failed ${res.status} ${url}:`,
                        text,
                    );
                    return false;
                }

                const blob = await res.blob();
                const contentType = res.headers.get('content-type') ?? '';
                const dispo = res.headers.get('content-disposition') ?? '';
                const m = dispo.match(
                    /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/,
                );
                const ext = contentType.split('/')[1] ?? 'bin';
                const filename =
                    m && m[1]
                        ? decodeURIComponent(m[1])
                        : `receipt_${id}.${ext}`;

                const urlObj = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = urlObj;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(urlObj);
                return true;
            } catch (err) {
                console.error('[useExpenseActions] download exception', err);
                return false;
            }
        };

        for (const url of urls) {
            const ok = await tryFetch(url);
            if (ok) return;
        }
        console.error(
            '[useExpenseActions] receipt download failed for all known endpoints',
        );
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!token) return;
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/expenses/${id}`,
                {
                    method: 'DELETE',
                    mode: 'cors',
                    credentials: 'include',
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!res.ok) {
                const text = await res.text();
                console.error(
                    '[useExpenseActions] delete failed',
                    res.status,
                    text,
                );
                return;
            }
            await fetchAll();
            setIsConfirmModalOpen?.(false);
            setEditingId?.(null);
        } catch (err) {
            console.error(
                '[useExpenseActions] handleDeleteTransaction error',
                err,
            );
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
