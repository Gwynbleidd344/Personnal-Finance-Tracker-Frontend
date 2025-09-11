import type { FC } from 'react'; // type-only import
import TransactionCard from '../TransactionCard';
import type { Transaction } from '../Types';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  transactions: Transaction[];
  view: 'grid' | 'list';
  actions: {
    onDownload: (tx: Transaction) => void;
    onChange: (tx: Transaction) => void;
    onDelete: (tx: Transaction) => void;
  };
};

const ExpenseList: FC<Props> = ({ transactions, view, actions }) => {
  return (
    <div
      className={`mt-2 w-full overflow-y-auto px-4 pt-3 ${
        view === 'grid' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col space-y-0'
      }`}
      style={{ maxHeight: 'calc(100vh - 220px)' }}
    >
      <AnimatePresence>
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            layout
            initial={{ translateY: 10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TransactionCard
              key={tx.id}
              transaction={tx}
              view={view}
              actions={{
                onDownload: () => actions.onDownload(tx),
                onChange: () => actions.onChange(tx),
                onDelete: () => actions.onDelete(tx),
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseList;
