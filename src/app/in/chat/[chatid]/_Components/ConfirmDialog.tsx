import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

type CamfirmDalilogProps = {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  deleteChat: () => void;
};

export default function ConfirmDialog({
  openDialog,
  setOpenDialog,
  deleteChat,
}: CamfirmDalilogProps) {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="max-w-[21rem] sm:max-w-max mx-auto text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center justify-center gap-2">
            <Trash2 className="h-6 w-6 text-red-600" /> تأكيد حذف المحادثة
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="my-4 text-base text-gray-700">
          هل أنت متأكد أنك تريد{" "}
          <span className="font-semibold text-red-600">حذف هذه المحادثة؟</span>
          <br />
          <span className="text-sm text-gray-500">
            لا يمكن التراجع عن هذا الإجراء.
          </span>
        </DialogDescription>
        <DialogFooter className="flex flex-row gap-2 justify-center mt-6">
          <DialogClose asChild>
            <Button variant="secondary" className="w-32">
              إلغاء
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="w-32 font-bold"
            onClick={() => {
              deleteChat();
              setOpenDialog(false);
            }}
          >
            نعم، حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
