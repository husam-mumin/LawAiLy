import { Button } from "@/components/ui/button";
import React, { useMemo } from "react";
import MagamengetDocumentTable from "./MagamengetDocumentTable";
import { documentType } from "@/models/Documents";
import { EditPopOver } from "./EditPopOver";
import { useDocumentActions } from "../_hooks/useDocumentActions";
import { toast } from "sonner";
import DeleteDialog from "./DeleteDialog";
import { AddDocumentPopup } from "./AddDocumentPopup";
import { useUser } from "@/app/context/UserContext";
import { useDeleteFile } from "../_hooks/useDeleteFile";
import { useDeleteImage } from "../_hooks/useDeleteImage";
import { Plus, RefreshCcw } from "lucide-react";
import { categoryType } from "@/models/Category";

export default function MagmengetDocumentSection() {
  const { documents, error, loading, add, edit, refresh, remove } =
    useDocumentActions();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState<documentType | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [deleteRow, setDeleteRow] = React.useState<documentType | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const { user } = useUser();

  // add to Document

  const handleAddButton = () => {
    setAddOpen(true);
  };

  const hanldeCloseAddPopup = () => {
    if (fileUrl || !saved) {
      setFileUrl("");
    }
    setAddOpen(false);
  };

  const handleAddAction = async (doc: {
    title: string;
    url: string;
    description: string;
    showup: boolean;
    image: string;
    addBy: string;
    category?: string;
  }) => {
    try {
      if (!user) {
        toast.error("لا يمكن إضافة المستند بدون مستخدم مسجل الدخول");
        return false;
      }
      const success = await add({
        title: doc.title,
        documentURL: doc.url,
        description: doc.description,
        image: doc.image,
        showUp: doc.showup,
        category: doc.category as categoryType | undefined,
        addedBy: user,
      });
      if (success) {
        setSaved(true);
        setAddOpen(false);
        toast.success("تم إضافة المستند بنجاح");
      } else {
        toast.error("فشل في إضافة المستند");
      }
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("حدث خطأ أثناء إضافة المستند");
    }
  };

  // Accept DocumentRow (image: string | undefined), convert to documentType (image: string)
  const onEdit = (row: documentType): void => {
    setEditRow({
      ...row,
      image: row.image ?? "",
    });
    setEditOpen(true);
  };
  const onDelete = (id: string) => {
    setDeleteRow(documents.find((doc) => doc._id === id) || null);
    setDeleteOpen(true);
    // Implement delete logic here
  };
  const { deleteFile, success: suc } = useDeleteFile();
  const { deleteImage, loading: deleteLoading } = useDeleteImage();
  const onDeleteComfarm = async (id: string): Promise<boolean> => {
    try {
      const success = await remove(id);
      // image delete
      const deleteRow = documents.find((doc) => doc._id === id);
      if (success) {
        await deleteFile(deleteRow?.documentURL || "");
        if (deleteRow?.image) {
          const imageDeleteSuccess = await deleteImage(deleteRow.image);
          if (!imageDeleteSuccess) {
            console.error("Failed to delete image from server");
            toast.error("فشل في حذف الصورة من الخادم");
            setDeleteOpen(false);
            return false;
          }
        }

        if (!suc) {
          console.error("Failed to delete file from server");
          toast.error("فشل في حذف الملف من الخادم");
          return false;
        }
        setDeleteOpen(false);
        toast.success("تم حذف المستند بنجاح");
      } else {
        toast.error("فشل في حذف المستند");
      }
      return success;
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("حدث خطأ أثناء حذف المستند");
      return false;
    }
  };

  const onEditSave = async (updatedDoc: documentType): Promise<boolean> => {
    // Implement save logic here
    const success = await edit(updatedDoc);
    if (success) {
      setEditOpen(false);
      setEditRow(null);
      toast.success("تم تعديل المستند بنجاح");
    }
    return true;
  };

  const rows = useMemo(() => {
    if (loading || error) return [];

    return documents.map((doc) => ({
      _id: doc._id,
      title: doc.title,
      documentURL: doc.documentURL,
      createdAt: doc.createdAt,
      description: doc.description,
      image: doc.image,
      showUp: doc.showUp,
      addedBy: doc.addedBy,
      category: doc.category,
    }));
  }, [documents, loading, error]);

  return (
    <>
      <div className="flex flex-col   w-full">
        <div className="flex items-center justify-end gap-6 mb-4 ">
          <Button
            onClick={() => {
              refresh(); // Fetch categories from the server
            }}
            className="mb-4 flex gap-2 "
            variant="outline"
          >
            <RefreshCcw size={18} /> تجديد المستندات
          </Button>
          <Button
            onClick={() => {
              handleAddButton();
            }}
            className="mb-4 flex gap-2 "
            variant="outline"
          >
            <Plus size={18} /> إضافة مستند جديد
          </Button>
        </div>
        <div className="overflow-x-auto w-full">
          <MagamengetDocumentTable
            rows={rows}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </div>

      {editRow && (
        <EditPopOver
          row={editRow}
          open={editOpen}
          setOpen={setEditOpen}
          handleDeleteFile={async (url: string) => {
            if (url) {
              await deleteImage(url);
            }
          }}
          onSave={onEditSave}
        />
      )}
      {deleteRow && (
        <DeleteDialog
          row={deleteRow}
          open={deleteOpen}
          loading={deleteLoading || loading}
          onOpenChange={setDeleteOpen}
          title={deleteRow.title || "تأكيد الحذف"}
          description={
            deleteRow.description ||
            "هل أنت متأكد أنك تريد حذف هذا المستند؟ لا يمكن التراجع عن هذا الإجراء."
          }
          key={deleteRow._id}
          onConfirm={() => onDeleteComfarm(deleteRow?._id || "")}
        />
      )}
      <AddDocumentPopup
        open={addOpen}
        onClose={() => {
          hanldeCloseAddPopup();
        }}
        onAdd={handleAddAction}
        fileUrl={fileUrl}
        setFileUrl={setFileUrl}
      />
    </>
  );
}
