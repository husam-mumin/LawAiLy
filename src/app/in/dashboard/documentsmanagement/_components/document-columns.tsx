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
import { userType } from "@/models/Users";
import Image from "next/image";

export type DocumentRow = {
  _id: string;
  title: string;
  documentURL: string;
  createdAt: Date;
  description: string;
  showUp: boolean;
  addedBy: userType;
  image: string;
  category?: string; // Added category field
};

export const documentColumns = (
  onEdit: (row: DocumentRow) => void,
  onDelete: (id: string) => void
): ColumnDef<DocumentRow>[] => [
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
    accessorKey: "image",
    header: "الصورة",
    cell: ({ row }) => {
      return row.original.image ? (
        <div className="group relative inline-block">
          <Image
            src={row.original.image}
            alt="صورة المستند"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded border cursor-pointer"
          />
        </div>
      ) : (
        <span className="text-gray-400">لا يوجد</span>
      );
    },
  },
  {
    accessorKey: "createAt",
    header: "تاريخ الإضافة",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      // Format: YYYY/MM/DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    },
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
    accessorKey: "addedBy",
    cell: ({ row }) => {
      const addedBy = row.original.addedBy;
      console.log("added by:", addedBy);

      return (
        <span>
          {addedBy?.firstName || addedBy?.lastName
            ? `${addedBy.firstName || ""} ${addedBy.lastName || ""}`.trim()
            : addedBy?.email || "غير معروف"}
        </span>
      );
    },
    header: "أضيف بواسطة",
  },
  {
    accessorKey: "category",
    header: "التصنيف",
    cell: ({ row }) => <span>{row.original.category || "غير مصنف"}</span>,
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
          <DropdownMenuItem
            onClick={() => onEdit(row.original)}
            className="justify-end"
          >
            تعديل
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(row.original._id)}
            className="justify-end text-red-600"
          >
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
