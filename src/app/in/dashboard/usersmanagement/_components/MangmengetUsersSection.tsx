"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import MagamengetUsersTable from "./table/MagamengetUsersTable";
import { useUsersAction } from "../_hooks/useUsersAction";
import { userType } from "@/models/Users";
import { toast } from "sonner";
import DeleteDialog from "./DeleteDialog";

export default function MangmengetUsersSection() {
  const { edit, error, fetchUsers, loading, remove, users } = useUsersAction();
  const [deleteRow, setDeleteRow] = React.useState<userType | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    if (loading || error) return [];
    return users.map((user) => ({
      ...user,
    }));
  }, [users, loading, error]);

  const onDelete = (id: string) => {
    setDeleteRow(users.find((user) => user._id === id) || null);
    setDeleteOpen(true);
  };

  const onDeleteComfarm = async (id: string): Promise<boolean> => {
    if (!id) {
      toast.error("معرف المستخدم غير موجود");
      return false;
    }
    try {
      const success = await remove(id);
      if (success) {
        toast.success("تم حذف المستخدم بنجاح");
        setDeleteOpen(false);
        setDeleteRow(null);
        return true;
      } else {
        toast.error("فشل في حذف المستخدم");
        return false;
      }
    } catch {
      toast.error("حدث خطأ أثناء حذف المستخدم");
      return false;
    }
  };

  const onEdit = (row: userType) => {
    edit(row)
      .then((success) => {
        if (success) {
          toast.success("تم تعديل المستخدم بنجاح");
        } else {
          toast.error("فشل في تعديل المستخدم");
        }
      })
      .catch(() => {
        toast.error("حدث خطأ أثناء تعديل المستخدم");
      });
  };

  return (
    <>
      <div className="flex flex-col   w-full">
        <div className="flex items-center gap-4 justify-end mb-4 mt-4">
          <Button variant={"default"} onClick={() => fetchUsers()}>
            تجديد
          </Button>
        </div>
        <div className="overflow-x-auto w-full">
          <MagamengetUsersTable
            rows={rows}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      </div>

      {deleteRow && (
        <DeleteDialog
          userEmail={deleteRow.email}
          open={deleteOpen}
          loading={loading}
          onOpenChange={setDeleteOpen}
          key={deleteRow._id}
          onConfirm={() => onDeleteComfarm(deleteRow?._id || "")}
        />
      )}
    </>
  );
}
