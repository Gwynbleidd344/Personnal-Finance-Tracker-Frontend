
import { FaFilter, FaList, FaPlus, FaThLarge } from 'react-icons/fa';
import SearchButton from '../SearchButton';

type Props = {
  t: any;
  view: 'grid' | 'list';
  toggleView: () => void;
  setIsModalOpen: (b: boolean) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  isFilterVisible: boolean;
  setIsFilterVisible: (b: boolean) => void;
};

export default function ExpenseHeader({
  t, view, toggleView, setIsModalOpen, searchTerm, setSearchTerm, isFilterVisible, setIsFilterVisible
}: Props) {
  return (
    <div className="flex flex-col border-gray-300 px-5 pt-5 text-3xl font-bold md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col md:flex-row md:items-center w-full justify-between border-b border-gray-300 dark:border-gray-700">
        <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 p-2 mb-3">
          {t('expenses', 'Expenses')}
        </h3>
        <div className="flex flex-row md:items-center space-y-2 md:space-y-0 space-x-2">
          <button onClick={() => setIsModalOpen(true)} className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-lg font-medium text-gray-800 shadow-sm transition-all duration-200 hover:bg-gray-300 hover:shadow-md active:scale-95">
            <FaPlus className="text-lg text-gray-600" />
            <span>{t('add', 'Add')}</span>
          </button>
          <div className="relative flex items-center">
            <SearchButton value={searchTerm} onChange={setSearchTerm} placeholder={t('search','Search')} />
          </div>
          <div className="flex space-x-2">
            <button onClick={toggleView} className="hidden md:flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-gray-200 text-gray-800 transition hover:bg-gray-300 active:scale-95">
              {view === 'grid' ? <FaList /> : <FaThLarge />}
            </button>
            <button onClick={() => setIsFilterVisible(!isFilterVisible)} className="flex md:hidden h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-gray-200 text-gray-800 transition hover:bg-gray-300 active:scale-95">
              <FaFilter />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
