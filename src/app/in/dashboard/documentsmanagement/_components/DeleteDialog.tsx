import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DocumentRow } from "./document-columns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  row: DocumentRow;
  title?: string;
  description?: string;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  row,
  title = "تأكيد الحذف",
  description = "هل أنت متأكد أنك تريد حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء.",
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 my-4">
          <Label className="font-semibold">العنوان</Label>
          <Input
            value={row.title}
            readOnly
            className="border rounded px-2 py-1 bg-gray-100"
          />
          <Label className="font-semibold">الوصف</Label>
          <Textarea
            value={row.description}
            readOnly
            className="border rounded px-2 py-1 bg-gray-100"
          />
          <Label className="font-semibold">الرابط</Label>
          <Input
            value={row.documentURL}
            readOnly
            className="border rounded px-2 py-1 bg-gray-100"
          />
          <Label className="font-semibold">تاريخ الإضافة</Label>
          <Input
            value={new Date(row.createdAt).toLocaleString()}
            readOnly
            className="border rounded px-2 py-1 bg-gray-100"
          />
          <Label className="font-semibold">اضف بواسطة</Label>
          <Input
            value={
              row.addedBy.firstName || row.addedBy.lastName
                ? `${row.addedBy.firstName || ""} ${
                    row.addedBy.lastName || ""
                  }`.trim()
                : row.addedBy.email || "غير معروف"
            }
            readOnly
            className="border rounded px-2 py-1 bg-gray-100"
          />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            إلغاء
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? "جاري الحذف..." : "حذف"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
