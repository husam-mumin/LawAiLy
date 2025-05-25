import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SidebarContentForChat() {
  return (
    <>
      <Link href="/chat" className="cursor-pointer">
        <SidebarMenuButton className="cursor-pointer bg-blue-500 mx-auto w-full py-6 flex justify-center items-center text-white hover:text-white hover:bg-blue-600 focus:bg-blue-600">
          New Chat <MessageCirclePlus className="" />
        </SidebarMenuButton>
      </Link>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-semibold text-gray-700">
          Chat
        </SidebarGroupLabel>
        {/* Here you can map through chat history items */}
        <ScrollArea className="h-[8rem] overflow-y-auto">
          <SidebarMenu>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              Chat 1
            </SidebarMenuItem>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100">
              Chat 2
            </SidebarMenuItem>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100">
              Chat 3
            </SidebarMenuItem>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100">
              Chat 4
            </SidebarMenuItem>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100">
              Chat 5
            </SidebarMenuItem>
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-semibold text-gray-700">
          Favorites
        </SidebarGroupLabel>
        <ScrollArea className="h-[6rem] overflow-y-auto">
          <SidebarMenu>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
              Favorite Chat 1
            </SidebarMenuItem>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100">
              Favorite Chat 2
            </SidebarMenuItem>
            <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100">
              Favorite Chat 3
            </SidebarMenuItem>
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>
    </>
  );
}
