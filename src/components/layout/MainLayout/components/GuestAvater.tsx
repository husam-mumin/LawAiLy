import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/app/context/UserContext";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReportForm from "./ReportForm";

export default function GuestAvatar() {
  const { setUser } = useUser();
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    document.cookie =
      "guest_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    localStorage.removeItem("guest_id");
    setUser(null);
    window.location.href = "/login";
  };

  const handleSupport = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 p-4">
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Avatar className="w-12 h-12 cursor-pointer ">
              {/* You can use a guest image or fallback icon */}
              <AvatarFallback className="bg-gray-300 border-2 border-gray-400">
                <User />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={handleSupport}>
              الدعم الفني
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
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
    </>
  );
}
