import React, { useRef } from "react";
import { useUploadFile } from "../hooks/useUploadfile";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadFileProps {
  onUploaded: (url: string) => void;
}

export default function UploadFile({ onUploaded }: UploadFileProps) {
  const { uploading, error, url, uploadFile } = useUploadFile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type || !file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("الملف يجب أن يكون بصيغة PDF فقط");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10 MB limit
        toast.error("حجم الملف يجب أن يكون أقل من 10 ميجابايت");
        return;
      }

      const toastId = toast.loading("جاري رفع الملف...");

      try {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          toast.success("تم رفع الملف بنجاح!", { id: toastId });
          onUploaded(uploadedUrl);
        } else {
          toast.error("حدث خطأ أثناء رفع الملف", { id: toastId });
        }
      } catch {
        toast.error("حدث خطأ أثناء رفع الملف", { id: toastId });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "جاري الرفع..." : "رفع ملف"}
      </Button>
      {url && (
        <div className="text-green-600 text-xs break-all">تم الرفع: {url}</div>
      )}
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
}
