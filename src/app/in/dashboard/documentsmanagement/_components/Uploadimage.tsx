"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface UploadImageProps {
  onUploaded?: (url: string) => void;
  uploadUrl?: string; // API endpoint to upload to
  initialImageUrl?: string | null; // Optional initial image URL
}

export default function UploadImage({
  onUploaded,
  uploadUrl = "/api/dashboard/documents/image",
  initialImageUrl = null,
}: UploadImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previousImageUrl, setPreviousImageUrl] = useState<string | null>(
    initialImageUrl
  );
  const inputRef = useRef<HTMLInputElement>(null);

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
    setUploading(true);
    const toastId = toast.loading("جاري رفع الصورة...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        validateStatus: () => true, // Accept all status codes
      });
      if (res.status === 409 && res.data?.url) {
        setPreviousImageUrl("");
        toast.success("الصورة موجودة بالفعل. تم استخدام الصورة الحالية.", {
          id: toastId,
        });

        setImageUrl(res.data.url);

        if (onUploaded) onUploaded(res.data.url);
      } else if (res.status === 200 && res.data?.url) {
        setPreviousImageUrl("");

        toast.success("تم رفع الصورة بنجاح!", { id: toastId });
        setImageUrl(res.data.url);
        if (onUploaded) onUploaded(res.data.url);
      } else {
        toast.error("فشل رفع الصورة", { id: toastId });
      }
    } catch {
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
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
