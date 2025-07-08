import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { userType } from "@/models/Users";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";

export type UserRow = userType;

export const userColumns = (
  onEdit: (row: UserRow) => void,
  onDelete: (id: string) => void,
  currentUser?: userType
): ColumnDef<UserRow>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  if (!currentUser) {
    return [];
  }
  return [
    {
      accessorKey: "AvatarURL",
      header: "الصورة الشخصية",
      cell: ({ row }) =>
        row.original.AvatarURL ? (
          <Image
            src={row.original.AvatarURL}
            alt="Avatar"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full border"
          />
        ) : (
          <span className="text-gray-400">لا يوجد</span>
        ),
    },
    {
      accessorKey: "email",
      header: "البريد الإلكتروني",
    },
    {
      accessorKey: "firstName",
      header: "الاسم الأول",
    },
    {
      accessorKey: "lastName",
      header: "اسم العائلة",
    },
    {
      accessorKey: "gender",
      header: "الجنس",
      cell: ({ row }) => {
        if (row.original.gender === "male") return "ذكر";
        if (row.original.gender === "female") return "أنثى";
        return row.original.gender || "-";
      },
    },
    {
      accessorKey: "role",
      header: "الوظيفة",
      cell: ({ row }) => {
        const text =
          row.original.role == "user"
            ? "مستخدم"
            : row.original.role === "admin"
            ? "مشرف"
            : "مالك";
        return text;
      },
    },
    {
      accessorKey: "isBaned",
      header: "محظور؟",
      cell: ({ row }) => (row.original.isBaned ? "نعم" : "لا"),
    },
    {
      id: "actions",
      header: "إجراءات",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"sm"}>
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem
                disabled={
                  row.original.email === currentUser?.email ||
                  row.original.role === "owner" ||
                  (row.original.role === "admin" &&
                    currentUser?.role === "admin") ||
                  (currentUser?.role === "admin" &&
                    row.original.role === "admin")
                } // Disable if user is admin
                onClick={() => {
                  if (row.original.email === currentUser?.email) return;
                  if (currentUser?.role === "user") return;
                  if (row.original.role === "owner") return;
                  if (
                    currentUser?.role === "admin" &&
                    row.original.role === "admin"
                  )
                    return;
                  onDelete(row.original._id);
                }}
                className="justify-end text-red-600"
              >
                حذف
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (row.original.email === currentUser?.email) return;
                  if (currentUser?.role === "user") return;
                  if (row.original.role === "owner") return;
                  if (
                    currentUser?.role === "admin" &&
                    row.original.role === "admin"
                  )
                    return;
                  onEdit({
                    ...row.original,
                    isBaned: !row.original.isBaned,
                  });
                }}
                disabled={
                  row.original.email == currentUser?.email ||
                  row.original.role === "owner" ||
                  (row.original.role === "admin" &&
                    currentUser?.role === "admin") ||
                  (currentUser?.role === "admin" &&
                    row.original.role === "admin")
                } // Disable if user is admin
                className="justify-end"
              >
                {row.original.isBaned ? "إلغاء الحظر" : "حظر المستخدم"}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={
                  row.original.email === currentUser?.email ||
                  currentUser.role === "admin" ||
                  currentUser.role === "user"
                } // Disable if user is admin
                onClick={() => {
                  if (row.original.email === currentUser?.email) return;
                  if (currentUser?.role === "user") return;

                  if (row.original.role === "owner") return;
                  if (currentUser?.role === "admin") return;
                  onEdit({
                    ...row.original,
                    role: row.original.role === "user" ? "admin" : "user",
                  });
                }}
                className="justify-end"
              >
                {row.original.role == "admin"
                  ? "إزالة صلاحية المدير"
                  : "تعيين كمدير"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
};

export interface UserDataTableProps {
  rows: UserRow[];
  onEdit: (row: UserRow) => void;
  onDelete: (id: string) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
}

export function DataTable2<TData, TValue>({
  columns,
  data,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-full" dir="rtl">
      <Table>
        <TableHeader className="text-right">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-right">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span className="animate-pulse text-gray-400">
                  جاري التحميل...
                </span>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                لا توجد نتائج.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
