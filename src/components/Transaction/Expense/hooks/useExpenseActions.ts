
import type { Transaction } from '../../Types';
import { getAccessToken } from '../../../../utils/getCookiesToken';

type Params = {
  setTransactions: (t: Transaction[]) => void;
  setIsModalOpen: (b: boolean) => void;
  setEditingId: (id: string | null) => void;
  setIsConfirmModalOpen: (b: boolean) => void;
};

export default function useExpenseActions({ setTransactions, setIsModalOpen }: Params) {
  const token = getAccessToken();

  const fetchAll = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, { headers: { Authorization: token }, credentials: 'include' });
      const data = await res.json();
      setTransactions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        method: 'POST',
        credentials: 'include',
        headers: { Authorization: token },
        body: fd,
      });
      await fetchAll();
      setIsModalOpen(false);
      form.reset();
    } catch (err) { console.error(err); }
  };

  const handleUpdateTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const id = (form as any).dataset?.id;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { Authorization: token },
        body: fd,
      });
      await fetchAll();
      setIsModalOpen(false);
      form.reset();
    } catch (err) { console.error(err); }
  };

  const handleChangeTransaction = (id: string) => {
    // open modal handled by caller; here you could populate form via state if needed
  };

  const handleDownloadReceipt = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}/receipt`, { headers: { Authorization: token }, credentials: 'include' });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'receipt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) { console.error(e); }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, { method: 'DELETE', credentials: 'include', headers: { Authorization: token } });
      await fetchAll();
    } catch (e) { console.error(e); }
  };

  return { handleAddTransaction, handleUpdateTransaction, handleChangeTransaction, handleDownloadReceipt, handleDeleteTransaction };
}
