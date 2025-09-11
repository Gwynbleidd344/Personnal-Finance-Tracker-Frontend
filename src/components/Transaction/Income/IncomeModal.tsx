
import { motion } from 'framer-motion';

type Props = {
  t: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isDeleting?: boolean;
};

export default function IncomeModal({ t, isOpen, onClose, onSubmit, isDeleting=false }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <motion.div initial={{scale:0,opacity:0}} exit={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.15}} className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 dark:text-gray-200 max-sm:m-1.5 p-6 shadow-lg">
        <h2 className="mb-3 text-2xl font-bold">{isDeleting ? t('delete','Delete') : t('add_new','Add New')} {t('income','Income')}</h2>
        <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
          {!isDeleting && <>
            <input name="name" type="text" placeholder={t('name','Name')} className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" required />
            <input name="amount" type="number" placeholder={t('amount','Amount')} className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" required />
            <input name="date" type="date" className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" required />
            <input name="source" type="text" placeholder={t('source','Source')} className="rounded-lg border border-gray-300 p-3 max-sm:p-1.5" required />
          </>}
          <div className="mt-2 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="rounded-lg bg-gray-200 dark:text-black px-5 py-2">{t('cancel','Cancel')}</button>
            <button type="submit" className={`rounded-lg px-5 py-2 text-white ${isDeleting ? 'bg-red-700' : 'bg-emerald-600'}`}>{isDeleting ? t('delete','Delete') : t('add','Add')}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
