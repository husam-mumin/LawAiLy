import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import MangmengetUsersSection from "./_components/MangmengetUsersSection";

export default function UserManagement() {
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
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
      </div>
      <div className="flex flex-col gap-4 mt-4 w-full">
        <div className="ms-auto w-full">
          <React.Suspense fallback={<div className="text-center py-8 text-lg text-blue-600">جاري تحميل بيانات المستخدمين...</div>}>
            <MangmengetUsersSection />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
