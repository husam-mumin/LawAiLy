"use client";
import axios, { CancelTokenSource } from "axios";
import { useState } from "react";

interface UseUploadFileResult {
  uploadFile: (file: File) => Promise<string | null>;
  uploading: boolean;
  error: string | null;
  cancelUpload: () => void;
}

/**
 * useUploadFile hook uploads a file to Google Cloud Storage using a signed URL.
 * @param getSignedUrl - async function that takes a file and returns a signed URL string
 */
export function useUploadFile(): UseUploadFileResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelSourceRef = useState<CancelTokenSource | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    cancelSourceRef[1](source);
    try {
      // Get signed URL from backend
      const data = await axios.post("/api/gcs-upload-url", {
        filename: file.name,
        contentType: file.type,
      });

      const signedUrl = data.data.url;

      // Upload file to GCS using the signed URL
      const response = await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        cancelToken: source.token,
      });

      if (!response.status || response.status !== 200) {
        throw new Error("Upload failed");
      }

      setUploading(false);
      cancelSourceRef[1](null);
      return signedUrl.split("?")[0]; // Return the public URL (without query params)
    } catch (err) {
      if (axios.isCancel(err)) {
        setError("Upload cancelled");
      } else if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Upload failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
      setUploading(false);
      cancelSourceRef[1](null);
      return null;
    }
  };

  const cancelUpload = () => {
    if (cancelSourceRef[0]) {
      cancelSourceRef[0].cancel("Upload cancelled by user.");
      cancelSourceRef[1](null);
    }
  };

  return { uploadFile, uploading, error, cancelUpload };
}
