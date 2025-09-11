import { useEffect, useState } from 'react';
import type { Category, Transaction } from '../../Types';
import { getAccessToken } from '../../../../utils/getCookiesToken';
import { fetchCategories, fetchExpenses } from '../../../../utils/fetch/Fetch';

export default function useExpenseData(t: (key: string, fallback?: string) => string) {
  const [categoryList, setCategoryList] = useState<{ name: string }[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const token = getAccessToken();

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        await fetchCategories(token, setCategories, setCategoryList);
        await fetchExpenses(token, setTransactions, t);
      } catch (err) {
        console.error('[useExpenseData] load error', err);
        setCategories([]);
        setCategoryList([]);
        setTransactions([]);
      }
    };

    load();
  }, [token]); 

  return {
    categoryList,
    transactions,
    setTransactions,
    categories,
    setCategories,
    setCategoryList,
  };
}
