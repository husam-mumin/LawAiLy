import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DocumentRow } from "./document-columns";
import { documentType } from "@/models/Documents";
import { useUploadFile } from "../hooks/useUploadfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface EditPopOverProps {
  row: DocumentRow;
  onSave: (updated: documentType) => boolean;
}

export function EditPopOver({ row, onSave }: EditPopOverProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [documentURL, setDocumentURL] = useState("");
  const [showup, setShowup] = useState(false);
  const { uploading, error, uploadFile } = useUploadFile();

  useEffect(() => {
    if (open) {
      setTitle(row.title);
      setDescription(row.description);
      setDocumentURL(row.documentURL);
      setShowup(row.showUp);
    }
  }, [open, row]);

  const handleSave = () => {
    onSave({
      ...row,
      title,
      description,
      showUp: showup,
      documentURL: documentURL,
      addedBy: row.addedBy,
      createdAt:
        typeof row.createdAt === "string"
          ? new Date(row.createdAt)
          : row.createdAt,
    });
    setOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadFile(file);
      if (url) setDocumentURL(url);
    }
  };
  console.log("Document URL:", documentURL);
  console.log("rendering EditPopOver for row:", row);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          تعديل
        </Button>
      </DialogTrigger>
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
          <Input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="border rounded px-2 py-1"
            disabled={uploading}
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
            <Button onClick={handleSave} disabled={uploading}>
              حفظ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
