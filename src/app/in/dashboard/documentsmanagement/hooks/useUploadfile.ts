import axios from "axios";
import { useState } from "react";

export function useUploadFile() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  // file: File object
  async function uploadFile(file: File) {
    // Check if file is a PDF
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("الملف يجب أن يكون بصيغة PDF فقط");
      return "";
    }
    setUploading(true);
    setError("");
    setUrl("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post("/api/dashboard/documents/upload", formData)
        console.log(res.data.url);
        
      
      if (!res.data || !res.data.url) {
        throw new Error("فشل في رفع الملف");
      }
      setUrl(res.data.url); // The backend should return { url: "https://drive.google.com/..." }
      return res.data.url;
    } catch (err) {
      console.log("Upload error:", err);
      
      if(!axios.isAxiosError(err)) {
        setError("حدث خطأ غير معروف أثناء رفع الملف");
      }
      if(err instanceof Error) {
        setError(err?.message || "فشل في رفع الملف");
      }
      return "";
    } finally {
      setUploading(false);
    }
  } catch (err) {
    console.error("Error uploading file:", err);
    
  }
  }
  return { uploading, error, url, uploadFile };
}
