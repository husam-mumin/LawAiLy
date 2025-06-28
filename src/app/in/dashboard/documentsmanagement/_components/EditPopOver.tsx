import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DocumentRow } from "./document-columns";
import { documentType } from "@/models/Documents";
import { useUploadFile } from "../_hooks/useUploadfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import UploadFile from "./UploadFile";
import UploadImage from "./Uploadimage";

interface EditPopOverProps {
  row: DocumentRow;
  onSave: (updated: documentType) => Promise<boolean>;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDeleteFile: (url: string) => void; // Optional prop for deleting file
}

export function EditPopOver({
  row,
  onSave,
  open,
  setOpen,
  handleDeleteFile,
}: EditPopOverProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentURL, setDocumentURL] = useState("");
  const [image, setImage] = useState("");
  const [showup, setShowup] = useState(false);
  const { uploading, error, uploadFile } = useUploadFile();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(row.title);
      setDescription(row.description);
      setDocumentURL(row.documentURL);
      setShowup(row.showUp);
      setImage(row.image || "");
    }
  }, [open, row]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !documentURL.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    if (!documentURL.startsWith("http")) {
      toast.error("الرجاء رفع ملف PDF قبل الإضافة");
      return;
    }
    if (documentURL.length > 500) {
      toast.error("رابط الملف طويل جداً");
      return;
    }
    if (title.length > 100) {
      toast.error("العنوان طويل جداً");
      return;
    }
    if (description.length > 500) {
      toast.error("الوصف طويل جداً");
      return;
    }
    if (title.length < 3) {
      toast.error("العنوان قصير جداً");
      return;
    }
    if (description.length < 3) {
      toast.error("الوصف قصير جداً");
      return;
    }

    handleSave();
    setTitle("");
    setDocumentURL("");
    setDescription("");
    setShowup(true);
    setOpen(false);
  }

  const handleImageUploaded = (newUrl: string) => {
    if (image && image !== newUrl) {
      handleDeleteFile(image);
    }
    setImage(newUrl);
  };

  const handleSave = async () => {
    if (!title.trim() || !documentURL.trim()) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    setSaveLoading(true);
    try {
      const result = await onSave({
        ...row,
        title,
        description,
        showUp: showup,
        documentURL: documentURL,
        addedBy: row.addedBy,
        image: image || "",
        createdAt:
          typeof row.createdAt === "string"
            ? new Date(row.createdAt)
            : row.createdAt,
      });
      if (result) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      alert("حدث خطأ أثناء حفظ المستند. يرجى المحاولة مرة أخرى.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleFileChange = async (e: File) => {
    const file = e;
    if (file) {
      const url = await uploadFile(file);
      if (!url) {
        toast.error("فشل في رفع الملف. يرجى المحاولة مرة أخرى.");
        return;
      }
      // If the upload was successful, set the document URL

      if (url) {
        handleDeleteFile(documentURL); // Call delete handler if provided
        setDocumentURL(url);
        return url;
      } else {
        toast.error("فشل في رفع الملف. يرجى المحاولة مرة أخرى.");
        return;
      }
    }
    return;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>تعديل المستند</DialogTitle>
          <DialogDescription>
            قم بتعديل تفاصيل المستند هنا. تأكد من ملء جميع الحقول المطلوبة.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label className="font-semibold">العنوان</Label>
          <Input
            className="border rounded px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Label className="font-semibold">الوصف</Label>
          <Textarea
            className="border rounded px-2 py-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Label className="font-semibold">رفع ملف PDF جديد</Label>
          <UploadFile
            onUploaded={(x) => setDocumentURL(x)}
            handleUpload={handleFileChange}
          />
          {uploading && (
            <span className="text-xs text-blue-600">جاري رفع الملف...</span>
          )}
          {error && <span className="text-xs text-red-600">{error}</span>}
          {documentURL && (
            <a
              href={documentURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-700 underline"
            >
              عرض الملف الحالي
            </a>
          )}
          <div>
            <Label className="font-semibold">الصورة</Label>
            <UploadImage
              onUploaded={handleImageUploaded}
              initialImageUrl={image}
            />
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="font-semibold">أظهر</label>
            <Select
              value={showup ? "yes" : "no"}
              onValueChange={(e) => setShowup(e === "yes")}
            >
              <SelectTrigger className="border rounded px-2 py-1">
                {" "}
                {showup ? "نعم" : "لا"}{" "}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">نعم</SelectItem>
                <SelectItem value="no">لا</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              disabled={uploading || saveLoading}
            >
              {saveLoading ? (
                <span className="">جاري الحفظ...</span>
              ) : (
                <span>حفظ</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
