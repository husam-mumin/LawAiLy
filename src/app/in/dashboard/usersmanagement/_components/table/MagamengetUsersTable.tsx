"use client";
import React from "react";
import { DataTable2, userColumns, UserRow } from "./dataTable2";
import { useUser } from "@/app/context/UserContext";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";

interface MagamengetDocumentTableProps {
  rows: UserRow[];
  onEdit: (row: UserRow) => void;
  onDelete: (id: string) => void;
}

export default function MagamengetUsersTable({
  rows,
  onDelete,
  onEdit,
  loading = false,
}: MagamengetDocumentTableProps & { loading?: boolean }) {
  const [orderBy, setOrderBy] = React.useState<string>("email");
  const [orderDir, setOrderDir] = React.useState<"asc" | "desc">("asc");
  const [search, setSearch] = React.useState("");
  const columns = React.useMemo(() => userColumns, []);
  const { user } = useUser();

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
        let aValue: string | boolean | undefined;
        let bValue: string | boolean | undefined;
        switch (orderBy) {
          case "email":
            aValue = a.email;
            bValue = b.email;
            break;
          case "firstName":
            aValue = a.firstName;
            bValue = b.firstName;
            break;
          case "lastName":
            aValue = a.lastName;
            bValue = b.lastName;
            break;
          case "role":
            aValue = a.role;
            bValue = b.role;
            break;
          case "gender":
            aValue = a.gender;
            bValue = b.gender;
            break;
          case "isBaned":
            aValue = a.isBaned;
            bValue = b.isBaned;
            break;
          default:
            aValue =
              typeof a[orderBy as keyof typeof a] === "string" ||
              typeof a[orderBy as keyof typeof a] === "boolean"
                ? (a[orderBy as keyof typeof a] as string | boolean | undefined)
                : undefined;
            bValue =
              typeof b[orderBy as keyof typeof b] === "string" ||
              typeof b[orderBy as keyof typeof b] === "boolean"
                ? (b[orderBy as keyof typeof b] as string | boolean | undefined)
                : undefined;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
          if (aValue < bValue) return orderDir === "asc" ? -1 : 1;
          if (aValue > bValue) return orderDir === "asc" ? 1 : -1;
          return 0;
        }
        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return orderDir === "asc"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        }
        return 0;
      });
    }
    return filtered;
  }, [rows, search, orderBy, orderDir]);

  // Orderable columns
  const customColumns = React.useMemo(() => {
    const orderableKeys = [
      "email",
      "firstName",
      "lastName",
      "role",
      "gender",
      "isBaned",
    ];
    return columns(
      onEdit,
      onDelete,
      user
        ? user
        : {
            _id: "",
            email: "",
            gender: "",
            firstName: "",
            lastName: "",
            role: "user",
            isBaned: false,
          }
    ).map((col) => {
      const accessorKey = (col as { accessorKey?: string }).accessorKey;
      if (
        !col.header ||
        typeof col.header !== "string" ||
        !accessorKey ||
        !orderableKeys.includes(accessorKey)
      )
        return col;
      return {
        ...col,
        header: (
          <span
            className="cursor-pointer select-none"
            onClick={() => {
              setOrderBy(accessorKey);
              setOrderDir(
                orderBy === accessorKey && orderDir === "asc" ? "desc" : "asc"
              );
            }}
          >
            {col.header}
            {orderBy === accessorKey && (orderDir === "asc" ? " ▲" : " ▼")}
          </span>
        ),
      };
    }) as ColumnDef<UserRow, unknown>[];
  }, [columns, onEdit, onDelete, user, orderBy, orderDir]);

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
      <DataTable2
        columns={customColumns}
        data={filteredRows}
        loading={loading}
      />
    </div>
  );
}
