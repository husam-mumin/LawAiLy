import { useUploadFile } from "@/hooks/useUploadFile";
import axios from "axios";
import { useState } from "react";

export function useUploadFileDocuments() {
  const { cancelUpload, error, uploadFile, uploading, setError } =
    useUploadFile();
  const [url, setUrl] = useState("");

  // file: File object
  async function UploadFileDocuments(file: File) {
    // Check if file is a PDF
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("الملف يجب أن يكون بصيغة PDF فقط");
      return "";
    }
    setError("");
    setUrl("");
    try {
      const res = await uploadFile(file);
      if (!res) {
        throw new Error("فشل في رفع الملف");
      }
      const { fileUrl } = res;
      setUrl(fileUrl);
      return fileUrl;
    } catch (err) {
      console.error("Upload error:", err);
      if (axios.isAxiosError(err) && err.response) {
        if (err.status == 409) {
          setUrl(err.response.data.url);
        }
      }
      if (!axios.isAxiosError(err)) {
        setError("حدث خطأ غير معروف أثناء رفع الملف");
      }
      if (err instanceof Error) {
        setError(err?.message || "فشل في رفع الملف");
      }
      return "";
    }
  }

  return {
    uploading: uploading,
    error: error,
    url,
    uploadFile: UploadFileDocuments,
    cancelUpload,
  };
}
