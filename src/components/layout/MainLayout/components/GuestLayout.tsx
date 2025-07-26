import React from "react";
import GuestTopBar from "./GuestTopBar";
import { Toaster } from "sonner";
import NewChatPop from "@/app/in/_components/newChatPop";

type GuestLayoutProps = {
  children: React.ReactNode;
};

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div>
      <GuestTopBar />
      {children}
      <Toaster />
      <NewChatPop />
    </div>
  );
}
