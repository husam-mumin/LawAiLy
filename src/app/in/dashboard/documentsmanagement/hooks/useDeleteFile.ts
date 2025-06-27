import { useState } from "react";
import axios from "axios";

export function useDeleteFile() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function deleteFile(url: string) {
    setDeleting(true);
    setError("");
    setSuccess(false);
    try {
      // You may want to extract fileId from the url if needed
      const res = await axios.delete("/api/dashboard/documents/delete", {
        data: { url },
      });
      if (!res.data || !res.data.success) {
        throw new Error("فشل في حذف الملف");
      }
      setSuccess(true);
      return true;
    } catch (err) {
      if (!axios.isAxiosError(err)) {
        setError("حدث خطأ غير معروف أثناء حذف الملف");
      }
      if (err instanceof Error) {
        setError(err?.message || "فشل في حذف الملف");
      }
      return false;
    } finally {
      setDeleting(false);
    }
  }

  return { deleting, error, success, deleteFile };
}
