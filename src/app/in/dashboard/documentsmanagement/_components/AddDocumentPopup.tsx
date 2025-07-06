import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import UploadFile from "./UploadFile";
import { useUser } from "@/app/context/UserContext";
import { toast } from "sonner";
import UploadImage from "./Uploadimage";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useCategoriesAction } from "@/app/in/dashboard/categoriesmanagement/_hooks/useCategoriesAction";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AddDocumentPopupProps {
  open: boolean;
  onClose: () => void;
  setFileUrl: (url: string) => void;
  fileUrl: string;
  onAdd: (doc: {
    title: string;
    url: string;
    description: string;
    showup: boolean;
    image: string;
    addBy: string;
    category?: string;
  }) => void;
}

export function AddDocumentPopup({
  open,
  onClose,
  setFileUrl,
  fileUrl,
  onAdd,
}: AddDocumentPopupProps) {
  const { user } = useUser();
  const { categories, loading } = useCategoriesAction();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [showup, setShowup] = React.useState(true);
  const [addBy, setAddBy] = React.useState("");
  const [image, setImage] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");

  React.useEffect(() => {
    if (!user) return;
    if (user.firstName && user.lastName) {
      setAddBy(user.firstName + " " + user.lastName);
    }
    if (user) {
      setAddBy(user.email || "");
    }
  }, [user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !fileUrl.trim()) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    if (!fileUrl.startsWith("http")) {
      toast.error("الرجاء رفع ملف PDF قبل الإضافة");
      return;
    }
    if (fileUrl.length > 500) {
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
    if (addBy.length > 100) {
      toast.error("اسم المضاف طويل جداً");
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
    if (!addBy.trim()) {
      toast.error("الرجاء ملء اسم المضاف");
      return;
    }
    if (user?._id === undefined || user?._id === null) {
      toast.error("المستخدم غير معروف");
      return;
    }
    if (addBy.length < 3) {
      toast.error("اسم المضاف قصير جداً");
      return;
    }
    if (!categoryId) {
      toast.error("الرجاء اختيار التصنيف");
      return;
    }

    // Handle exists file (409) toast
    if (fileUrl === "EXISTS_FILE_URL") {
      toast.error(
        "الملف موجود بالفعل بنفس الاسم. يرجى تغيير اسم الملف أو اختيار ملف آخر."
      );
      return;
    }

    onAdd({
      title,
      url: fileUrl,
      description,
      showup,
      image: image,
      addBy: user?._id,
      category: categoryId,
    });
    setTitle("");
    setFileUrl("");
    setDescription("");
    setShowup(true);
    if (user?.firstName && user.lastName) {
      setAddBy(user.firstName + " " + user.lastName);
    } else {
      setAddBy(user?.email || "");
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-xl shadow-2xl border-0 p-0">
        <DialogHeader className="bg-blue-50 rounded-t-xl px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-blue-700 text-xl font-bold">
            إضافة مستند جديد
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <input
            className="border border-blue-200 focus:ring-2 focus:ring-blue-300 p-2 rounded w-full text-right placeholder:text-gray-400"
            placeholder="العنوان"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <UploadFile
            onUploaded={(x) => {
              setFileUrl(x);
            }}
          />
          <UploadImage
            onUploaded={(x) => {
              setImage(x);
            }}
          />
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger
              disabled={loading}
              className="border border-blue-200 focus:ring-2 focus:ring-blue-300 rounded w-full p-2 text-right bg-white"
            >
              {loading
                ? "جاري تحميل التصنيفات..."
                : categories && categoryId
                ? categories.find((cat) => cat._id === categoryId)?.name ||
                  "اختر التصنيف"
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
          <Textarea
            className="border border-blue-200 focus:ring-2 focus:ring-blue-300 p-2 rounded min-h-[80px] text-right placeholder:text-gray-400"
            placeholder="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="border p-2 rounded bg-gray-100 text-gray-700 text-right">
            {addBy ? `أضيف بواسطة: ${addBy}` : "جاري جلب المستخدم..."}
          </div>
          <div className="flex items-center gap-2 text-right">
            <Label
              htmlFor="showup-switch"
              className="cursor-pointer select-none"
            >
              ظهور
            </Label>
            <Switch
              checked={showup}
              onCheckedChange={setShowup}
              className="data-[state=checked]:bg-blue-600"
              dir="rtl"
              id="showup-switch"
            />
          </div>
          <DialogFooter className="flex gap-2 justify-end mt-4 bg-gray-50 rounded-b-xl px-0 py-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[90px]"
            >
              إضافة
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-[90px]"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
