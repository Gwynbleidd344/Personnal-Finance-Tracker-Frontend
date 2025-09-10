
import { FaSearch } from 'react-icons/fa';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchButton({ value, onChange, placeholder = 'Search', className = '' }: Props) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 ${className}`}>
      <FaSearch className="text-gray-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-sm text-gray-700"
      />
    </div>
  );
}