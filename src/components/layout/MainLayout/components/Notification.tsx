import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import React from "react";
import { useNotificationContext } from "@/app/context/NotficationContext";
import { useOpenNot } from "@/app/context/UserContext";

export default function Notification() {
  const { setOpenNot } = useOpenNot();
  const { notifications } = useNotificationContext();
  return (
    <Button
      className="relative"
      variant={"ghost"}
      onClick={() => {
        setOpenNot(true);
      }}
    >
      <Bell className="size-5" />
      {notifications && notifications.filter((e) => !e.isRead).length > 0 && (
        <span className="absolute top-1 right-6 size-2 rounded-full bg-red-500" />
      )}
    </Button>
  );
}
