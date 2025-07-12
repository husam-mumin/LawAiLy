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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import UploadFile from "./UploadFile";
import UploadImage from "./Uploadimage";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useCategoriesAction } from "@/app/in/dashboard/categoriesmanagement/_hooks/useCategoriesAction";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { categories, loading } = useCategoriesAction();
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(row.title);
      setDescription(row.description);
      setDocumentURL(row.documentURL);
      setShowup(row.showUp);
      setImage(row.image || "");
      setCategoryId(row.category ? String(row.category) : "");
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
    if (!categoryId) {
      toast.error("الرجاء اختيار التصنيف");
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
        category: categories?.find((cat) => cat._id === categoryId),
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
      <DialogContent
        dir="rtl"
        className="max-w-lg rounded-xl shadow-2xl border-0 p-0"
      >
        <ScrollArea dir="rtl" className="max-h-[90vh] px-0">
          <DialogHeader
            dir="rtl"
            className="bg-blue-50 rounded-t-xl px-6 pt-6 pb-2 sticky top-0 z-10"
          >
            <DialogTitle className="flex items-center gap-2 text-blue-700 text-xl font-bold">
              تعديل المستند
            </DialogTitle>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => setOpen(false)}
              className="absolute top-4  rtl:left-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 z-20"
              tabIndex={0}
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-blue-700"
              >
                <path
                  fillRule="evenodd"
                  d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414l4.95-4.95-4.95-4.95A1 1 0 015.05 3.636l4.95 4.95z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <DialogDescription className="text-blue-600 mt-1">
              قم بتعديل تفاصيل المستند هنا. تأكد من ملء جميع الحقول المطلوبة.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 px-6 py-8 bg-white"
          >
            {/* Title & Description */}
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">العنوان</Label>
              <Input
                className="border border-blue-200 focus:ring-2 focus:ring-blue-300 p-2 rounded w-full text-right placeholder:text-gray-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="العنوان"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">الوصف</Label>
              <Textarea
                className="border border-blue-200 focus:ring-2 focus:ring-blue-300 p-2 rounded min-h-[80px] text-right placeholder:text-gray-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="الوصف"
              />
            </div>

            {/* Media Section - Single Column */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">رفع ملف PDF جديد</Label>
                <UploadFile
                  onUploaded={(x) => setDocumentURL(x)}
                  handleUpload={handleFileChange}
                />
                {uploading && (
                  <span className="text-xs text-blue-600">
                    جاري رفع الملف...
                  </span>
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
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">الصورة</Label>
                <UploadImage
                  onUploaded={handleImageUploaded}
                  initialImageUrl={image}
                />
              </div>
            </div>

            {/* Category & Showup Row */}
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2 flex-1 w-full">
                <Label className="font-semibold whitespace-nowrap">
                  التصنيف
                </Label>
                <div className="flex-1 max-w-[180px]">
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger
                      disabled={loading}
                      className="border border-blue-200 focus:ring-2 focus:ring-blue-300 rounded w-full p-2 text-right bg-white min-w-[120px] max-w-[180px]"
                      style={{ minWidth: 120, maxWidth: 180 }}
                    >
                      {loading
                        ? "جاري تحميل التصنيفات..."
                        : categories && categoryId
                        ? categories.find((cat) => cat._id === categoryId)
                            ?.name || "اختر التصنيف"
                        : "اختر التصنيف"}
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      {categories &&
                        categories.map((cat) => (
                          <SelectItem
                            key={cat._id}
                            value={cat._id}
                            className="text-right"
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 mt-2 md:mt-0">
                <label
                  htmlFor="showup-switch"
                  className="font-semibold cursor-pointer select-none"
                >
                  أظهر
                </label>
                <Switch
                  id="showup-switch"
                  checked={showup}
                  onCheckedChange={setShowup}
                  className="data-[state=checked]:bg-blue-600"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-8 justify-end bg-gray-50 rounded-b-xl px-0 py-4 sticky bottom-0 z-10 border-t border-blue-100">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                className="min-w-[90px]"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={uploading || saveLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[90px]"
              >
                {saveLoading ? (
                  <span className="">جاري الحفظ...</span>
                ) : (
                  <span>حفظ</span>
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
