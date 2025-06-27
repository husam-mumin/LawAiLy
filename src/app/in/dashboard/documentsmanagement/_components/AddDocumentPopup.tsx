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
    addBy: string;
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
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [showup, setShowup] = React.useState(true);
  const [addBy, setAddBy] = React.useState("");
  React.useEffect(() => {
    console.log(user);

    if (!user) return;
    if (user.firstName && user.lastName) {
      setAddBy(user.firstName + " " + user.lastName);
      console.log(user);
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

    onAdd({ title, url: fileUrl, description, showup, addBy: user?._id });
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة مستند جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
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
          <div className="border p-2 rounded bg-gray-100 text-gray-700">
            {addBy ? `أضيف بواسطة: ${addBy}` : "جاري جلب المستخدم..."}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showup}
              onChange={(e) => setShowup(e.target.checked)}
            />
            ظهور
          </label>
          <textarea
            className="border p-2 rounded min-h-[80px]"
            placeholder="الوصف"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DialogFooter>
            <Button type="submit">إضافة</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
