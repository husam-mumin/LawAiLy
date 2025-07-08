/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { documentColumns, DocumentRow } from "./document-columns";
import { DataTable1 } from "@/components/tables/dataTable1";
import { Input } from "@/components/ui/input";

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
  const [orderBy, setOrderBy] = React.useState<string>("createdAt");
  const [orderDir, setOrderDir] = React.useState<"asc" | "desc">("desc");
  const [search, setSearch] = React.useState("");

  const columns = React.useMemo(() => documentColumns, []);

  // Filter and sort rows
  const filteredRows = React.useMemo(() => {
    let filtered = rows;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(s)
        )
      );
    }
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = (a as Record<string, any>)[orderBy];
        let bValue = (b as Record<string, any>)[orderBy];
        // Special handling for category (sort nulls last)

        // Special handling for createdAtt (date ordering)
        if (aValue instanceof Date) aValue = aValue.getTime();
        if (bValue instanceof Date) bValue = bValue.getTime();
        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";
        if (aValue < bValue) return orderDir === "asc" ? -1 : 1;
        if (aValue > bValue) return orderDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [rows, search, orderBy, orderDir]);

  // Custom header renderer to allow sorting only on orderable columns
  const customColumns = React.useMemo(() => {
    const orderableKeys = [
      "title",
      "createdAt",
      "description",
      "showup",
      "category",
    ];
    return columns(onEdit, onDelete).map((col) => {
      const accessorKey = (col as any).accessorKey as string | undefined;
      // Ensure every column has an id property
      const id =
        (col as any).id ??
        accessorKey ??
        (typeof col.header === "string" ? col.header : undefined);
      if (
        !col.header ||
        typeof col.header !== "string" ||
        !accessorKey ||
        !orderableKeys.includes(accessorKey)
      )
        return { ...col, id }; // Ensure id is set
      return {
        ...col,
        id,
        header: () => (
          <span
            className="cursor-pointer select-none"
            onClick={() => {
              setOrderBy(accessorKey);
              setOrderDir(
                orderBy === accessorKey && orderDir === "asc" ? "desc" : "asc"
              );
            }}
          >
            {typeof col.header === "function"
              ? col.header({} as any)
              : col.header}
            {orderBy === accessorKey && (orderDir === "asc" ? " ▲" : " ▼")}
          </span>
        ),
      };
    });
  }, [columns, onEdit, onDelete, orderBy, orderDir]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Input
          placeholder="بحث..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>
      <DataTable1 columns={customColumns} data={filteredRows} />
    </div>
  );
}
