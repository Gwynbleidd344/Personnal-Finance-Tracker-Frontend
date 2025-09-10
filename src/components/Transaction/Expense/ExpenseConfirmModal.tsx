
import { motion } from 'framer-motion';

type Props = {
  t: any;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ExpenseConfirmModal({ t, isOpen, onCancel, onConfirm }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ scale: 0, opacity: 0 }} exit={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.15 }} className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-3 text-2xl font-bold">{t('expense_confirm_delete','Are you sure to delete this expense ?')}</h2>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg bg-gray-200 px-5 py-2">{t('cancel','Cancel')}</button>
          <button type="button" className="rounded-lg bg-red-700 px-5 py-2 text-white" onClick={onConfirm}>{t('delete','Delete')}</button>
        </div>
      </motion.div>
    </div>
  );
}
