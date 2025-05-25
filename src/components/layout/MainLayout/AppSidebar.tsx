import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../../ui/sidebar";
import SidebarHeaderForChat from "./components/SidebarHeaderForChat";
import SidebarContentForChat from "./components/SidebarContentForChat";
import SidebarFooterForChat from "./components/SidebarFooterForChat";
import { ScrollArea } from "@/components/ui/scroll-area";
/*
 * AppSidebar.tsx
 * This component represents the sidebar of the application.
 * It includes a header, content and footer area.
 *
 * The Header contains the application Logo, Open Sidebar button in Desktop view
 * and the navigation between Chat and Dashboard.
 *
 * The Content area staring a new Chat Button show the chat list history, the current chat and Favorites Chats.
 *
 * in the Footer area of the sidebar, there is a button to report a bug or give feedback.
 * and a button to open the settings.
 */

export default function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarHeaderForChat />
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)] overflow-y-hidden">
          <SidebarContentForChat />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterForChat />
      </SidebarFooter>
    </Sidebar>
  );
}
