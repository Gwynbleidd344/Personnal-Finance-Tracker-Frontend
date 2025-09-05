import React from "react";
import { FaSearch } from "react-icons/fa";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative flex items-center w-full md:w-64">
      <FaSearch className="pointer-events-none absolute left-3 text-gray-600 text-lg" />
      <input
        type="text"
        className="h-12 w-full rounded-lg bg-gray-200 pl-10 pr-4 text-lg text-gray-800 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
