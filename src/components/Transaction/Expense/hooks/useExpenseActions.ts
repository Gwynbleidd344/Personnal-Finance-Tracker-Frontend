// hooks/useExpenseActions.ts
import { useCallback } from "react";
import fileDownload from "js-file-download";
import { fetchExpenses } from "../../../../utils/fetch/Fetch";
import { getAccessToken } from "../../../../utils/getCookiesToken";

export function useExpenseActions({
  setTransactions,
  setIsModalOpen,
  setEditingId,
  setIsConfirmModalOpen,
  t,
}: {
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsConfirmModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  t: (key: string, fallback: string) => string;
}) {
  const token = getAccessToken();

  // CREATE
  const handleAddTransaction = useCallback(
    async (event: React.FormEvent<HTMLFormElement>, typeValue: string) => {
      event.preventDefault();
      if (!token) return;

      const target = event.target as typeof event.target & {
        description: { value: string };
        amount: { value: string };
        date: { value: string };
        startDate?: { value: string };
        endDate?: { value: string };
        type: { value: string };
        categoryId: { value: string };
        receipt?: { files: FileList };
      };

      const formData = new FormData();
      formData.append("description", target.description.value);
      formData.append("amount", target.amount.value);
      formData.append("date", target.date.value);
      formData.append("type", typeValue);
      formData.append("categoryId", target.categoryId.value);

      if (typeValue === "recurring") {
        if (target.startDate?.value) formData.append("startDate", target.startDate.value);
        if (target.endDate?.value) formData.append("endDate", target.endDate.value);
      }

      if (
        target.receipt?.files?.[0] &&
        target.receipt.files.length < 2 &&
        ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(target.receipt.files[0].type) &&
        target.receipt.files[0].size <= 2097152
      ) {
        formData.append("receipt", target.receipt.files[0]);
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses`, {
          mode: "cors",
          credentials: "include",
          headers: { Authorization: `${token}` },
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          await fetchExpenses(token, setTransactions, t);
          setIsModalOpen(false);
        } else {
          console.error("Create expense failed", res.status);
        }
      } catch (err) {
        console.error("Create expense exception", err);
      }
    },
    [token, setTransactions, setIsModalOpen, t]
  );

  // UPDATE
  const handleUpdateTransaction = useCallback(
    async (event: React.FormEvent<HTMLFormElement>, editingId: string | null) => {
      event.preventDefault();
      if (!editingId || !token) return;

      const target = event.target as typeof event.target & {
        description: { value: string };
        amount: { value: string };
        date: { value: string };
        type: { value: string };
        categoryId: { value: string };
        receipt?: { files: FileList };
      };

      const formData = new FormData();
      formData.append("description", target.description.value);
      formData.append("amount", target.amount.value);
      formData.append("date", target.date.value);
      formData.append("type", target.type.value);
      formData.append("categoryId", target.categoryId.value);

      if (
        target.receipt?.files?.[0] &&
        ["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(target.receipt.files[0].type) &&
        target.receipt.files[0].size <= 2097152
      ) {
        formData.append("receipt", target.receipt.files[0]);
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${editingId}`, {
          mode: "cors",
          credentials: "include",
          headers: { Authorization: `${token}` },
          method: "PUT",
          body: formData,
        });

        if (res.ok) {
          await fetchExpenses(token, setTransactions, t);
          setIsModalOpen(false);
          setEditingId(null);
        } else {
          console.error("Update expense failed", res.status);
        }
      } catch (err) {
        console.error("Update expense exception", err);
      }
    },
    [token, setTransactions, setIsModalOpen, setEditingId, t]
  );

  // DELETE
  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      if (!token) return;
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
          mode: "cors",
          credentials: "include",
          headers: { Authorization: `${token}` },
          method: "DELETE",
        });
        await fetchExpenses(token, setTransactions, t);
      } catch (err) {
        console.error(err);
      }
    },
    [token, setTransactions, t]
  );

  // DOWNLOAD
  const handleDownloadReceipt = useCallback(
    async (id: string) => {
      if (!token) return;
      try {
        return await fetch(`${import.meta.env.VITE_API_URL}/api/receipts/${id}`, {
          mode: "cors",
          credentials: "include",
          headers: { Authorization: `${token}` },
          method: "GET",
        }).then(async (res) =>
          res.ok
            ? fileDownload(await res.blob(), `${id}.${res.headers.get("content-type")?.split("/")[1]}`)
            : null
        );
      } catch (err) {
        console.error(err);
      }
    },
    [token]
  );

  return {
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    handleDownloadReceipt,
  };
}
