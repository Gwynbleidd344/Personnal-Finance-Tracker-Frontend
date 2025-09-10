import type { Category, Transaction } from '../../components/Transaction/Types';


export const fetchCategories = async (
  token: string,
  setCategories: (cats: Category[]) => void,
  setCategoryList: (cats: { name: string }[]) => void,
): Promise<Category[]> => {
  if (!token) return [];
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      mode: 'cors', credentials: 'include',
      headers: { Authorization: `${token}` },
    });
    const data = await res.json();
    const cats: Category[] = Array.isArray(data) ? data : [];
    setCategories(cats);
    setCategoryList(cats.map((c) => ({ name: c.name })));
    return cats;
  } catch (err) {
    console.error('Error fetching categories:', err);
    setCategories([]);
    setCategoryList([]);
    return [];
  }
};


export const fetchExpenses = async (
  token: string,
  setTransactions: (txs: Transaction[]) => void,
  t: (key: string, fallback: string) => string
) => {
  if (!token) return;
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
      mode: 'cors', credentials: 'include',
      headers: { Authorization: `${token}` },
    });
    const data = await res.json();
    const formatted: Transaction[] = Array.isArray(data)
      ? data.map((item: any) => ({
        id: item.id,
        name: item.description || item.name,
        amount: parseFloat(item.amount),
        date: item.date,
        start_date: item.start_date,
        end_date: item.end_date,
        is_recurrent: item.is_recurrent,
        receipt_id: item.receipt_id,
        type: item.is_income ? 'income' : 'expense',
        category:
          item.category_fk?.name || t('uncategorized', 'Uncategorized'),
        source: item.source || '',
      }))
      : [];
    setTransactions(formatted);
    console.log('Fetched and formatted expenses:', formatted);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    setTransactions([]);
  }
};
