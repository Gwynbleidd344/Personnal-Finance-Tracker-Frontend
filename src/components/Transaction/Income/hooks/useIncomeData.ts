
import { useEffect, useState } from 'react';
import type { Transaction } from '../../Types';
import { getAccessToken } from '../../../../utils/getCookiesToken';

export default function useIncomeData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incomes`, { credentials:'include', headers:{ Authorization: token }});
        const data = await res.json();
        const formatted = data.map((item:any) => ({ id: item.id, name: item.description || item.source, amount: parseFloat(item.amount), date: item.income_date, type: 'income' }));
        setTransactions(formatted);
      } catch (e) { console.error(e); }
    };
    fetchTransactions();
  }, [token]);

  return { transactions, setTransactions };
}
