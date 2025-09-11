import { motion } from 'framer-motion';
import type { Category, Transaction } from '../Types';

type ExpenseModalProps = {
  t: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingId: string | null;
  typeValue: 'one-time' | 'recurring';
  setTypeValue: (v: 'one-time' | 'recurring') => void;
  categories: Category[];
  editingTransaction?: Transaction | null;
};

export default function ExpenseModal({
  t, isOpen, onClose, onSubmit, editingId, typeValue, setTypeValue, categories
}: ExpenseModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.15 }} className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 dark:text-gray-200 max-sm:m-1.5 p-6 shadow-lg">
        <h2 className="mb-3 text-2xl font-bold">
          {editingId ? `${t('update', 'Update')} ${t('expense', 'Expense')}` : `${t('add_new', 'Add New')} ${t('expense', 'Expense')}`}
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={onSubmit} encType="multipart/form-data">
          <input name="description" type="text" placeholder={t('description', 'Description')} className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" required />
          <input name="amount" type="number" placeholder={t('amount', 'Amount')} className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" required />
          <input name="date" type="datetime-local" className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" defaultValue={new Date().toISOString().slice(0, 16)} />
          <select name="categoryId" className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5">
            <option value="">{t('select_category', 'Select Category')}</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className='grid grid-cols-4 gap-2'>
            <input id="receipt_file_input_field" name="receipt" type="file" className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5 col-span-3" />
            <button onClick={() => (document.getElementById("receipt_file_input_field") as HTMLInputElement).value = ''} type='button' className='bg-gray-100 dark:text-black rounded-lg'>Clear</button>
          </div>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2"><input type="radio" name="type" value="one-time" checked={typeValue === 'one-time'} onChange={() => setTypeValue('one-time')} /><span>{t('one_time', 'One-time')}</span></label>
            <label className="flex items-center space-x-2"><input type="radio" name="type" value="recurring" checked={typeValue === 'recurring'} onChange={() => setTypeValue('recurring')} /><span>{t('recurring', 'Recurring')}</span></label>
          </div>
          {typeValue === 'recurring' && (
            <div className="flex flex-col space-y-2">
              <input name="startDate" type="date" className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" required />
              <input name="endDate" type="date" className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" />
            </div>
          )}
          <div className="mt-2 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="rounded-lg bg-gray-200 dark:text-black px-5 py-2"> {t('cancel', 'Cancel')} </button>
            <button type="submit" className="rounded-lg bg-emerald-600 px-5 py-2 text-white"> {editingId ? t('update', 'Update') : t('add', 'Add')} </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
