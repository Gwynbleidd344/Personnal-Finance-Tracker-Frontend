import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getAccessToken } from "../../utils/getCookiesToken";

export default function DeleteData() {
  const { t } = useTranslation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const token = getAccessToken();
    if (!token) return;

    setIsConfirmOpen(false);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete-data`,
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

      setMessage(t("delete_success", "All your data has been deleted."));
    } catch {
      setMessage(t("delete_error", "Something went wrong. Please try again."));
    }
  };

  return (
    <>
      <h2 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mt-6 mb-2">
        {t("delete_data_title", "Data Managing")}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 ml-1">
        {t(
          "delete_data_description",
          "Deleting your data is not reversible."
        )}
      </p>
      {/* Delete button */}
      <button
        onClick={handleDeleteClick}
        className="flex items-center w-fit cursor-pointer active:scale-95 transition-all rounded-lg bg-orange-400 px-4 py-2 text-white shadow-lg mt-4"
      >
        <FaTrash className="mr-2 size-4" />
        <span className="text-sm">{t("confirm_delete", "Remove all data")}</span>
      </button>

      {/* Confirm Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              {t(
                "delete_confirm_message",
                "Are you sure you want to delete all your data?"
              )}
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
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
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
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
