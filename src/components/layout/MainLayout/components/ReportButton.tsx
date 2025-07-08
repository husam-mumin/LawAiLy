"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Flag } from "lucide-react";
import React, { useState } from "react";
import ReportForm from "./ReportForm";

export default function ReportButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton className="w-full">
          <div className="w-full  flex  items-center justify-between gap-2">
            <Flag size={15} />
            <span className="text-sm">ابلاغ</span>
          </div>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader className="text-right sm:text-right">
          <DialogTitle>ابلاغ عن مشكلة</DialogTitle>
          <DialogDescription>
            انت سوف ترسل ايمال للمطورين لصلاح المشكلة
          </DialogDescription>
        </DialogHeader>
        <ReportForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
