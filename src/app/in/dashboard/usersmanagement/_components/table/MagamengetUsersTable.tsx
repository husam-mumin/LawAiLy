"use client";
import React from "react";
import { DataTable2, userColumns, UserRow } from "./dataTable2";
import { useUser } from "@/app/context/UserContext";

interface MagamengetDocumentTableProps {
  rows: UserRow[];
  onEdit: (row: UserRow) => void;
  onDelete: (id: string) => void;
}

export default function MagamengetUsersTable({
  rows,
  onDelete,
  onEdit,
}: MagamengetDocumentTableProps) {
  const columns = React.useMemo(() => userColumns, []);
  const { user } = useUser();

  if (!user) {
    return (
      <div className="text-red-500">لا يمكن عرض الجدول بدون تسجيل الدخول</div>
    );
  }
  return <DataTable2 columns={columns(onEdit, onDelete, user)} data={rows} />;
}
