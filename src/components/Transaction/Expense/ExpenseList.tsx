import type { FC } from 'react'; // type-only import
import TransactionCard from '../TransactionCard';
import type { Transaction } from '../Types';

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
        view === 'grid' ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col space-y-4'
      }`}
      style={{ maxHeight: 'calc(100vh - 220px)' }}
    >
      {transactions.map((tx) => (
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
      ))}
    </div>
  );
};

export default ExpenseList;
