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
        // fetchCategories signature: (token, setCategories, setCategoryList)
        // It will call setCategories with Category[] and setCategoryList with {name:string}[]
        await fetchCategories(token, setCategories, setCategoryList);

        // fetchExpenses signature: (token, setTransactions, t)
        await fetchExpenses(token, setTransactions, t);
      } catch (err) {
        console.error('[useExpenseData] load error', err);
        setCategories([]);
        setCategoryList([]);
        setTransactions([]);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, t]);

  return { categoryList, transactions, setTransactions, categories, setCategories };
}