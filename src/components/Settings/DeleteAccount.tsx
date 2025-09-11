import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../utils/getCookiesToken";
import deleteCookies from "../../utils/deleteCookies";

export default function DeleteAccount() {
  const { t } = useTranslation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate()

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const token = getAccessToken();
    if (!token) return;

    setIsConfirmOpen(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/deleteAccount`,
        {
          mode: 'cors', credentials: 'include',
          headers: { Authorization: `${token}` },
          method: "DELETE",
        }
      );

      if (!res.ok) {
        setMessage(t("delete_error", "Something went wrong. Please try again."));
        return;
      }

      setMessage(t("account_delete_success", "Account deleted. You will be logged out."));
      deleteCookies()
      setTimeout(() => navigate("/login"), 3000)
    } catch {
      setMessage(t("delete_error", "Something went wrong. Please try again."));
    }
  };

  return (
    <>
      {/* Delete button */}
      <button
        onClick={handleDeleteClick}
        className="flex items-center w-fit cursor-pointer active:scale-95 transition-all rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg mt-4"
      >
        <FaTrash className="mr-2 size-4" />
        <span className="text-sm">{t("account_confirm_delete", "Remove all data")}</span>
      </button>

      {/* Confirm Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 max-sm:mx-1.5 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              {t(
                "account_delete_confirm_message",
                "Are you really sure to permanently delete your account ? All data will be unrecoverable"
              )}
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:text-black transition"
              >
                {t("cancel", "Cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                {t("delete", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 max-sm:mx-1.5 max-w-sm w-full">
            <p className="text-base">{message}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setMessage(null)}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {t("ok", "OK")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
