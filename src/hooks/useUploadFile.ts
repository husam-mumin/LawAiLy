"use client";
import axios, { CancelTokenSource } from "axios";
import { useState } from "react";

interface UseUploadFileResult {
  uploadFile: (
    file: File
  ) => Promise<{ fileUrl: string; filename: string } | null>;
  uploading: boolean;
  error: string | null;
  cancelUpload: () => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

function generateUniqueFileName(originalName: string): string {
  const ext = originalName.includes(".")
    ? "." + originalName.split(".").pop()
    : "";
  // Use browser crypto API for random UUID
  return `${Date.now()}-${window.crypto.randomUUID()}${ext}`;
}

/**
 * useUploadFile hook uploads a file to Google Cloud Storage using a signed URL.
 * @param getSignedUrl - async function that takes a file and returns a signed URL string
 */
export function useUploadFile(): UseUploadFileResult {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelSourceRef = useState<CancelTokenSource | null>(null);

  const uploadFile = (
    file: File
  ): Promise<{ fileUrl: string; filename: string } | null> => {
    setUploading(true);
    setError(null);
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    cancelSourceRef[1](source);

    const newFileName = generateUniqueFileName(file.name);
    const renamedFile = new File([file], newFileName, {
      type: file.type,
    });

    return axios
      .post("/api/gcs-upload-url", {
        filename: renamedFile.name,
        contentType: renamedFile.type,
      })
      .then((data) => {
        const signedUrl = data.data.url;
        return axios.put(signedUrl, renamedFile, {
          headers: {
            "Content-Type": renamedFile.type,
          },
          cancelToken: source.token,
        });
      })
      .then(async (response) => {
        if (!response.status || response.status !== 200) {
          throw new Error("Upload failed");
        }

        setUploading(false);
        cancelSourceRef[1](null);
        // Return the public URL (without query params)
        const fileUrl = response.config.url;
        if (!fileUrl) {
          throw new Error("File URL not found in response");
        }
        return { fileUrl: fileUrl.split("?")[0], filename: renamedFile.name };
      })
      .catch((err) => {
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
      });
  };

  const cancelUpload = () => {
    if (cancelSourceRef[0]) {
      cancelSourceRef[0].cancel("Upload cancelled by user.");
      cancelSourceRef[1](null);
    }
  };

  return { uploadFile, uploading, error, cancelUpload, setError };
}
