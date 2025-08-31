import React from "react";
import {
  FaBolt,
  FaCoffee,
  FaExchangeAlt,
  FaFilm,
  FaMoneyBillWave,
  FaPlus,
  FaTaxi,
  FaTrash,
  FaUtensils,
} from "react-icons/fa";
import type { Transaction } from "./Types";

type TransactionCardProps = {
  transaction: Transaction;
  view: "grid" | "list";
  actions?: {
    onChange?: () => void;
    onDelete?: () => void;
  };
};


const categoryIcons: Record<string, React.ReactNode> = {
  Food: <FaUtensils className="text-white" />,
  Entertainment: <FaFilm className="text-white" />,
  Transport: <FaTaxi className="text-white" />,
  Utilities: <FaBolt className="text-white" />,
  Coffee: <FaCoffee className="text-white" />,
  Doctor: <FaPlus className="text-white" />, 
  Other: <FaTrash className="text-white" />,
};


const categoryColors: Record<string, string> = {
  Food: "bg-red-700",
  Entertainment: "bg-purple-700",
  Transport: "bg-green-700",
  Utilities: "bg-yellow-700",
  Coffee: "bg-orange-700",
  Doctor: "bg-green-700",
};

export default function TransactionCard({
  transaction,
  view,
  actions,
}: TransactionCardProps) {
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  
  const icon: React.ReactNode =
    transaction.type === "income"
      ? <FaMoneyBillWave className="text-white" />
      : categoryIcons[transaction.category || ""] || (
          <FaUtensils className="text-white" />
        );

  const bgColor =
    transaction.type === "income"
      ? "bg-emerald-600"
      : categoryColors[transaction.category || ""] || "bg-gray-400";

  return (
    <div
      className={`group relative scale-99 rounded-xl border border-gray-300 bg-gray-50 p-4 transition-transform duration-200 hover:scale-100 hover:shadow-sm ${
        view === "list" ? "h-20" : "h-auto"
      }`}
    >
      {/* Badge icône */}
      <div
        className={`absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full ${bgColor}`}
      >
        {icon}
      </div>

      {/* Contenu */}
      <div className="ml-12 flex justify-between">
        <div className={view === "list" ? "flex items-center space-x-10" : ""}>
          <h2 className="text-2xl font-semibold text-gray-800">{transaction.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {transaction.type === "expense"
              ? transaction.category || "Uncategorized"
              : transaction.source || "Unknown"}
          </p>
          <p
            className={`mt-2 text-2xl font-bold ${
              transaction.type === "expense" ? "text-red-700" : "text-green-700"
            }`}
          >
            {transaction.type === "expense" ? "-" : "+"}${transaction.amount.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-400">{formattedDate}</p>
        </div>

        {/* Boutons */}
        <div
          className={`flex justify-around ${
            view === "grid" ? "flex-col space-y-2" : "flex-row space-x-5"
          }`}
        >
          <button
            className={`flex transform items-center gap-2 rounded bg-gray-300 text-black transition duration-100 ease-in-out hover:bg-gray-400 active:scale-95 ${
              view === "grid" ? "px-2 py-2 text-sm" : "px-3 py-3 text-base"
            }`}
            onClick={actions?.onChange}
          >
            <FaExchangeAlt />
            Change
          </button>

          <button
            className={`flex transform items-center gap-2 rounded bg-neutral-950/90 text-white transition duration-100 ease-in-out hover:bg-neutral-700 active:scale-95 ${
              view === "grid" ? "px-2 py-2 text-sm" : "px-3 py-3 text-base"
            }`}
            onClick={actions?.onDelete}
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
