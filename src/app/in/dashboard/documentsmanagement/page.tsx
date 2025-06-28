"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import MagmengetDocumentSection from "./_components/MagmengetDocumentSection";

/**
 * Documents Management Page
 * This page is responsible for managing documents within the dashboard.
 * It includes functionalities such as viewing, editing, and deleting documents.
 *
 */

export default function DocumentsManagement() {
  return (
    <div className="p-4 text-right ">
      <div className="flex  justify-between gap-4">
        <Button variant={"ghost"} size={"lg"} className="">
          <Link
            href={"/in/dashboard"}
            className="w-full h-full flex justify-center items-center"
          >
            <ChevronLeft className="inline mr-2 " />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">إدارة المستندات</h1>
      </div>
      <div className="flex flex-col gap-4 mt-4 w-full">
        <div className="ms-auto w-full">
          <MagmengetDocumentSection />
        </div>
      </div>
    </div>
  );
}
