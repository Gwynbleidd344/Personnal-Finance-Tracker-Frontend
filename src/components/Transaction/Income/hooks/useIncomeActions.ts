
import type { Transaction } from '../../Types';
import { getAccessToken } from '../../../../utils/getCookiesToken';

export default function useIncomeActions({ setTransactions }: { setTransactions: (t: Transaction[]) => void }) {
  const token = getAccessToken();

  const fetchAll = async () => {
    if (!token) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incomes`, { credentials:'include', headers:{ Authorization: token }});
    const data = await res.json();
    setTransactions(data.map((item:any) => ({ id:item.id, name:item.description||item.source, amount:parseFloat(item.amount), date:item.income_date, type:'income' })));
  };

  

  return { fetchAll };
}
