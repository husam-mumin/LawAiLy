import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon } from "lucide-react";
import { EditPopOver } from "./EditPopOver";
import { documentType } from "@/models/Documents";
import { userType } from "@/models/Users";

export type DocumentRow = {
  _id: string;
  title: string;
  documentURL: string;
  createdAt: Date;
  description: string;
  showUp: boolean;
  addedBy: userType;
  onEdit?: (row: documentType) => boolean;
  onDelete?: (id: string) => void;
};

export const documentColumns: ColumnDef<DocumentRow>[] = [
  {
    accessorKey: "title",
    header: "العنوان",
  },
  {
    accessorKey: "url",
    header: "الرابط",
    cell: ({ row }) => (
      <a
        href={row.original.documentURL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        الربط
      </a>
    ),
  },
  {
    accessorKey: "createAt",
    header: "تاريخ الإضافة",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    accessorKey: "description",
    header: "الوصف",
  },
  {
    accessorKey: "showup",
    header: "ظهور",
    cell: ({ row }) => (row.original.showUp ? "نعم" : "لا"),
  },
  {
    accessorKey: "addBy",
    header: "أضيف بواسطة",
  },
  {
    id: "actions",
    header: "إجراءات",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"sm"}>
            <EllipsisIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem asChild className="justify-end">
            <EditPopOver
              row={row.original}
              onSave={row.original.onEdit || (() => false)}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => row.original.onDelete?.(row.original._id)}
            className="justify-end text-red-600"
          >
            حذف
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              row.original.showUp = !row.original.showUp;
              row.original.onEdit?.({
                _id: row.original._id,
                title: row.original.title,
                description: row.original.description,
                showUp: row.original.showUp,
                addedBy: row.original.addedBy,
                documentURL: row.original.documentURL,
                createdAt: row.original.createdAt,
              });
            }}
            className="justify-end"
          >
            {row.original.showUp ? "اخفاء" : "اظهار"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
