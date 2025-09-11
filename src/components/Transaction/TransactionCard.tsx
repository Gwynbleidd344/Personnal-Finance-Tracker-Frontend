"use client"

import type React from "react"
import { useContext } from "react"
import { useTranslation } from "react-i18next"
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
    FaSyncAlt, 
} from "react-icons/fa"
import { CurrencyContext } from "../../context/CurrencyContext"
import { formatCurrency } from "../../utils/currency"
import formatName from "../../utils/FormatTransactionName"
import type { Transaction } from "./Types"
import useWindowDimensions from "../../hooks/useWindowDimensions"

type TransactionCardProps = {
  transaction: Transaction
  view: "grid" | "list"
  actions?: {
    onDownload?: () => void
    onChange?: () => void
    onDelete?: () => void
  }
}

const categoryIcons: Record<string, React.ReactNode> = {
  Food: <FaUtensils className="text-white" />,
  Entertainment: <FaFilm className="text-white" />,
  Transport: <FaTaxi className="text-white" />,
  Utilities: <FaBolt className="text-white" />,
  Coffee: <FaCoffee className="text-white" />,
  Doctor: <FaPlus className="text-white" />,
  Other: <FaTrash className="text-white" />,
}

const categoryColors: Record<string, string> = {
  Food: "bg-red-700",
  Entertainment: "bg-purple-700",
  Transport: "bg-green-700",
  Utilities: "bg-yellow-700",
  Coffee: "bg-orange-700",
  Doctor: "bg-green-700",
}

export default function TransactionCard({ transaction, view, actions }: TransactionCardProps) {
  const { currency } = useContext(CurrencyContext)
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const formattedDate = new Date(transaction.date).toLocaleDateString(t("local_date_format", "en-US"), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const formattedEndDate = transaction.end_date
    ? new Date(transaction.end_date).toLocaleDateString(t("local_date_format", "en-US"), {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : t("unset", "Unset")

  const limitCategoryName = (name: string, maxWords = 15): string => {
    const words = name.split(" ")
    if (words.length <= maxWords) return name
    return words.slice(0, maxWords).join(" ") + "..."
  }

  const icon: React.ReactNode =
    transaction.type === "income" ? (
      <FaMoneyBillWave className="text-white" />
    ) : (
      categoryIcons[transaction.category || ""] || <FaUtensils className="text-white" />
    )

  const bgColor =
    transaction.type === "income" ? "bg-emerald-600" : categoryColors[transaction.category || ""] || "bg-gray-400"

  return (
    <div
      className={`group relative mb-2 max-md:h-fit scale-99 cursor-pointer rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-100 hover:shadow-md hover:before:opacity-100 dark:border-gray-600/55 dark:bg-gray-800 ${
        view === "list" ? "h-20" : "h-auto"
      }`}
    >
      {/* Badge icon */}
      <div
        className={`absolute -top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full ${bgColor} shadow`}
      >
        {icon}
      </div>

      {/* Main content */}
      {(view === "list" && width >= 768) ? (
        <div className="grid grid-cols-12 gap-2 items-center ml-12">
          {/* Colonne Nom - 3 colonnes */}
          <div className="col-span-3 flex items-center gap-1">
            <h2 className="text-sm sm:text-base font-semibold leading-tight text-gray-900 dark:text-gray-100 capitalize truncate">
              {formatName(transaction.name)}
            </h2>
            {transaction.is_recurrent && (
              <FaSyncAlt className="text-gray-400 text-xs" />
            )}
          </div>

          {/* Colonne Catégorie - 3 colonnes */}
          <div className="col-span-3">
            <span className="inline-block rounded-lg bg-gray-300 px-2 sm:px-3 py-1 sm:py-1.5 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs sm:text-sm truncate max-w-full">
              {limitCategoryName(
                formatName(
                  transaction.type === "expense"
                    ? transaction.category || "Uncategorized"
                    : transaction.source || "Unknown",
                ),
              )}
            </span>
          </div>

          {/* Colonne Date - 2 colonnes */}
          <div className="col-span-2">
            <div className="flex flex-col items-start">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formattedDate}</span>
              {transaction.start_date && (
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{formattedEndDate}</span>
              )}
            </div>
          </div>

          {/* Colonne Montant - 2 colonnes */}
          <div className="col-span-2 text-right">
            <div className="flex items-center justify-end gap-x-1">
              <p
                className={`text-base sm:text-lg font-bold tracking-tight whitespace-nowrap ${
                  transaction.type === "expense"
                    ? "text-red-600 dark:text-red-500/75"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {transaction.type === "expense" ? "-" : "+"}
                {formatCurrency(transaction.amount, currency, true)}
              </p>
            </div>
          </div>

          {/* Colonne Actions - 2 colonnes */}
          <div className="col-span-2 flex items-center justify-end gap-x-1 sm:gap-x-2">
            {transaction.receipt_id && (
              <button
                onClick={actions?.onDownload}
                className="group/btn flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-blue-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg active:scale-95"
              >
                <FaFileDownload className="text-xs sm:text-sm transition-transform duration-200 group-hover/btn:scale-110" />
              </button>
            )}
            <button
              onClick={actions?.onChange}
              className="group/btn flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-gray-300 text-gray-900 transition-all duration-200 hover:scale-105 hover:bg-gray-300 hover:shadow-lg active:scale-95 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <FaExchangeAlt className="text-xs sm:text-sm transition-transform duration-200 group-hover/btn:scale-110" />
            </button>
            <button
              onClick={actions?.onDelete}
              className="group/btn flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-red-700/90 text-gray-100 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95"
            >
              <FaTrash className="text-xs sm:text-sm transition-transform duration-200 group-hover/btn:scale-110" />
            </button>
          </div>
        </div>
      ) : (
        // Mode grid : structure originale conservée
        <div className="flex items-start justify-between">
          <div className="flex flex-col space-y-2">
            <div className="mt-4 flex w-fit items-center justify-between space-x-4 capitalize">
              <h2 className="pl-1.5 text-lg leading-tight font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                {formatName(transaction.name)}
                {transaction.is_recurrent && (
                  <FaSyncAlt className="text-gray-400 text-sm" /> 
                )}
              </h2>
              <p
                className={`text-xl font-bold tracking-tight ${
                  transaction.type === "expense"
                    ? "text-red-600 dark:text-red-500/75"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {transaction.type === "expense" ? "-" : "+"}
                {formatCurrency(transaction.amount, currency, true)}
              </p>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-block rounded-lg bg-gray-300 px-3 py-1.5 font-medium text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                {limitCategoryName(
                  formatName(
                    transaction.type === "expense"
                      ? transaction.category || "Uncategorized"
                      : transaction.source || "Unknown",
                  ),
                )}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
              {transaction.start_date && <span className="text-xs">{formattedEndDate}</span>}
            </div>
          </div>
          <div className="relative mt-2 ml-4 flex min-h-full space-x-2">
            {transaction.receipt_id && (
              <button
                onClick={actions?.onDownload}
                className="group/btn absolute top-0 -left-10 flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg active:scale-95"
              >
                <FaFileDownload className="text-sm transition-transform duration-200 group-hover/btn:scale-110" />
              </button>
            )}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={actions?.onChange}
                className="group/btn flex h-8 w-8 items-center justify-center rounded-md bg-gray-300 text-gray-900 transition-all duration-200 hover:scale-105 hover:bg-gray-300 hover:shadow-lg active:scale-95 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <FaExchangeAlt className="text-sm transition-transform duration-200 group-hover/btn:scale-110" />
              </button>
              <button
                onClick={actions?.onDelete}
                className="group/btn flex h-8 w-8 items-center justify-center rounded-md bg-red-700/90 text-gray-100 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-700 hover:shadow-lg active:scale-95"
              >
                <FaTrash className="text-sm transition-transform duration-200 group-hover/btn:scale-110" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
