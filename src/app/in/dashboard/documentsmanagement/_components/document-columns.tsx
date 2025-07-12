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
import { categoryType } from "@/models/Category";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DocumentRow = {
  _id: string;
  title: string;
  documentURL: string;
  createdAt: Date;
  description: string;
  showUp: boolean;
  addedBy: userType;
  image: string;
  category?: categoryType; // Added category field
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
    accessorKey: "createdAt",
    header: "تاريخ الإضافة",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      // Format: YYYY/MM/DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    },
    sortingFn: (a, b) => {
      // Sort by createdAt (date)
      const aDate = a.original.createdAt
        ? new Date(a.original.createdAt).getTime()
        : 0;
      const bDate = b.original.createdAt
        ? new Date(b.original.createdAt).getTime()
        : 0;
      return aDate - bDate;
    },
  },
  {
    accessorKey: "description",
    header: "الوصف",
    cell: ({ row }) => {
      const description = row.original.description || "لا يوجد وصف";
      return (
        <span className="text-sm text-gray-600">
          <Tooltip>
            <TooltipTrigger className="cursor-pointer">
              {description.length > 20 ? (
                <span className="line-clamp-2">
                  {description.slice(0, 20)}...
                </span>
              ) : (
                description
              )}
            </TooltipTrigger>
            <TooltipContent>
              <span>{description}</span>
            </TooltipContent>
          </Tooltip>
        </span>
      );
    },
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
      return (
        <span>
          {addedBy?.firstName || addedBy?.lastName
            ? `${addedBy.firstName || ""} ${addedBy.lastName || ""}`.trim()
            : addedBy?.email || "غير معروف"}
        </span>
      );
    },
    header: "أضيف بواسطة",
    sortingFn: (a, b) => {
      // Sort by firstName + lastName or email
      const getName = (user: {
        firstName?: string;
        lastName?: string;
        email?: string;
      }) =>
        user?.firstName || user?.lastName
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : user?.email || "";
      const aName = getName(a.original.addedBy).toLowerCase();
      const bName = getName(b.original.addedBy).toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    },
  },
  {
    accessorKey: "category",
    header: "التصنيف",
    cell: ({ row }) => {
      return <span>{row.original.category?.name || "غير مصنف"}</span>;
    },
    sortingFn: (a, b) => {
      // Sort by category name, nulls last

      const aName = a.original.category?.name || "";
      const bName = b.original.category?.name || "";

      if (!aName && bName) return 1;
      if (aName && !bName) return -1;
      if (!aName && !bName) return 0;
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    },
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
