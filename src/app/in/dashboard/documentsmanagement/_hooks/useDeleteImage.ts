import axios from "axios";
import { useState } from "react";

/**
 * React hook to delete an image from Google Cloud Storage by its public URL.
 * Usage: const { deleteImage, loading, error } = useDeleteImage();
 */
export function useDeleteImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteImage = async (url: string): Promise<boolean> => {
    if (!url) return false;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete("/api/dashboard/documents/image", {
        data: { url },
      });
      setLoading(false);
      return res.status === 200;
    } catch  {
      setLoading(false);
      setError("فشل حذف الصورة من الخادم");
      return false;
    }
  };

  return { deleteImage, loading, error };
}
