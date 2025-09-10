
import { AnimatePresence, motion } from 'framer-motion';
import TransactionCard from '../TransactionCard';
import type { Transaction } from '../Types';

type Props = {
  transactions: Transaction[];
  view: 'grid' | 'list';
  actions: (t: Transaction) => {
    onDownload?: () => void;
    onChange?: () => void;
    onDelete?: () => void;
  };
};

export default function ExpenseList({ transactions, view, actions }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        layout
        className={`mt-2 w-full overflow-y-auto px-4 pt-3 ${
          view === 'grid'
            ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col space-y-4'
        }`}
        style={{ maxHeight: 'calc(100vh - 220px)' }}
      >
        {transactions.map((t) => (
          <motion.div
            layout
            key={t.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <TransactionCard
              transaction={t}
              view={view}
              actions={actions(t)}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
