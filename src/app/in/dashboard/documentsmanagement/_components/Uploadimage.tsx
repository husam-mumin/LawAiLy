"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUploadFile } from "@/hooks/useUploadFile";

interface UploadImageProps {
  onUploaded?: (url: string) => void;
  uploadUrl?: string; // API endpoint to upload to
  initialImageUrl?: string | null; // Optional initial image URL
}

export default function UploadImage({
  onUploaded,
  initialImageUrl = null,
}: UploadImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(
    initialImageUrl
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading, setError } = useUploadFile();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("الملف يجب أن يكون صورة فقط");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }
    setError("");
    const toastId = toast.loading("جاري رفع الصورة...");
    try {
      const result = await uploadFile(file);
      if (result && result.fileUrl) {
        setPreviousImageUrl("");
        toast.success("تم رفع الصورة بنجاح!", { id: toastId });
        setImageUrl(result.fileUrl);
        if (onUploaded) onUploaded(result.fileUrl);
      } else {
        toast.error("فشل رفع الصورة", { id: toastId });
      }
    } catch {
      toast.error("حدث خطأ أثناء رفع الصورة");
    }
  };

  return (
    <div className="flex flex-row-reverse gap-2 items-end justify-end">
      {(imageUrl || previousImageUrl) && (
        <div
          className="relative"
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <a
            href={imageUrl || previousImageUrl || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline cursor-pointer"
          >
            رابط الصورة
          </a>
          <div
            className={`absolute ${
              showPreview ? "block" : "hidden"
            }  bottom-full mb-2 right-0 z-50 bg-white border rounded shadow-lg p-2`}
          >
            <Image
              src={imageUrl || previousImageUrl || ""}
              alt="Preview"
              className="w-96  object-cover rounded border"
              width={128}
              height={128}
            />
          </div>
        </div>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        variant="outline"
      >
        {uploading ? "جاري الرفع..." : "رفع صورة"}
      </Button>
    </div>
  );
}
