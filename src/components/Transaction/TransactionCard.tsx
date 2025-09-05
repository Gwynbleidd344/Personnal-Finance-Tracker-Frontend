import React, { useContext } from "react";
import {
  FaBolt,
  FaCoffee,
  FaExchangeAlt,
  FaFileDownload,
  FaFilm,
  FaMoneyBillWave,
  FaPlus,
  FaTaxi,
  FaTrash,
  FaUtensils,
} from "react-icons/fa";
import type { Transaction } from "./Types";
import { useTranslation } from "react-i18next";
import { CurrencyContext } from "../../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

type TransactionCardProps = {
  transaction: Transaction;
  view: "grid" | "list";
  actions?: {
    onDownload?: () => void;
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
  const { t } = useTranslation()
  const { currency } = useContext(CurrencyContext);
  const formattedDate = new Date(transaction.date).toLocaleDateString(t("local_date_format", "en-US"), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedEndDate = transaction.end_date ?
    new Date(transaction.end_date).toLocaleDateString(t("local_date_format", "en-US"),
      {
        day: "2-digit"
        , month: "short",
        year: "numeric"
      }) : t('unset', 'Unset')

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
      className={`group relative scale-99  rounded-xl cursor-pointer border border-gray-300 bg-gray-100 p-4 shadow-sm transition-transform duration-200 hover:scale-100 hover:shadow-md ${view === "list" ? "h-24" : "h-auto"
        }`}
    >
      {/* Badge icon */}
      <div
        className={`absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full ${bgColor} shadow`}
      >
        {icon}
      </div>

      {/* Main content */}
      <div className="flex justify-between items-start">
        <div className={view === "list" ? "flex flex-col justify-between ml-12" : ""}>
          {/* Name & Amount */}
          <div className="flex items-center justify-between mt-5 space-x-4 w-fit">
            <h2 className="text-lg font-semibold text-gray-800">{transaction.name}</h2>
            <p
              className={`text-lg font-bold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"
                }`}
            >
              {transaction.type === "expense" ? "-" : "+"}{formatCurrency(transaction.amount, currency)}
            </p>
            {(transaction.is_recurrent == true) && (<i className='bxr bx-rotate-square-ccw text-xl text-gray-500' />)}
          </div>

          {/* Category / Source & Date */}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>
              {transaction.type === "expense"
                ? transaction.category || "Uncategorized"
                : transaction.source || "Unknown"}
            </span>
            <span className="text-gray-400">{formattedDate}</span>
            {transaction.start_date && (<>
              <span>-</span>
              <span className="text-gray-400">{formattedEndDate}</span>
            </>)}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center items-start gap-2">
          {transaction.receipt_id && (<button
            onClick={actions?.onDownload}
            className='flex items-center justify-center p-2 text-white bg-blue-500 rounded transition hover:bg-blue-600 active:scale-95'>

            <FaFileDownload />
          </button>)}
          <div
            className={`flex ${view === "grid" ? "flex-col space-y-2" : "flex-row space-x-3"
              } items-center`}
          >
            <button
              className={`flex items-center justify-center gap-2 rounded bg-gray-300 text-gray-800 p-2 transition hover:bg-gray-400 active:scale-95`}
              onClick={actions?.onChange}
            >
              <FaExchangeAlt />
            </button>

            <button
              className={`flex items-center justify-center gap-2 rounded bg-red-600 text-white p-2 transition hover:bg-red-700 active:scale-95`}
              onClick={actions?.onDelete}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div >
  );
}