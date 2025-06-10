import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import React from "react";

export default function Notification() {
  return (
    <Button className="relative" variant={"ghost"}>
      <Bell className="size-5" />
      <span className="absolute top-1 right-6 size-2 rounded-full bg-red-500" />
    </Button>
  );
}
