import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import React from "react";
import ReportButton from "./ReportButton";
import { ThemeToggleButton } from "./ThemeToggleButton";

export default function SidebarFooterForChat() {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <ReportButton />
        </SidebarMenuItem>
      </SidebarMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
            Setting <Settings className="ml-auto h-4 w-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          className="w-[--radix-popper-anchor-width]"
        >
          <DropdownMenuItem>
            <span>Language</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {
              // ! fix the theme button issue
              // when theme the theme all the button and links with there action stop working.
              // still don't know why this happen.
            }
            <ThemeToggleButton />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Notifications</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Privacy</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
