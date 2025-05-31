import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import React from "react";
import ReportButton from "./ReportButton";

export default function SidebarFooterForChat() {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <ReportButton />
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
