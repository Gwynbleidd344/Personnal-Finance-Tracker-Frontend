export type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: string;
  income_date?: string;
  type: "income" | "expense";
  start_date?: string,
  end_date?: string,
  receipt_id?: string,
  is_recurrent?: boolean
  category?: string;
  source?: string;
};
export type Category = {
  id: string;
  name: string;
};