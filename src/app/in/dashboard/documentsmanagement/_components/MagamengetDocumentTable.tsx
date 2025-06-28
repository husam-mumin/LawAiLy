"use client";
import React from "react";
import { documentColumns, DocumentRow } from "./document-columns";
import { DataTable1 } from "@/components/tables/dataTable1";

interface MagamengetDocumentTableProps {
  rows: DocumentRow[];
  onEdit: (row: DocumentRow) => void;
  onDelete: (id: string) => void;
}

export default function MagamengetDocumentTable({
  rows,
  onDelete,
  onEdit,
}: MagamengetDocumentTableProps) {
  const columns = React.useMemo(() => documentColumns, []);

  return <DataTable1 columns={columns(onEdit, onDelete)} data={rows} />;
}
