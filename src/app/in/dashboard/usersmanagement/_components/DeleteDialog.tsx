import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
  userEmail?: string;
  onConfirm: () => void;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  loading = false,
  userEmail = "",
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تأكيد حذف المستخدم</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          هل أنت متأكد أنك تريد حذف المستخدم؟
          <br />
          <span className="text-sm text-gray-600">{userEmail}</span>
        </div>
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
