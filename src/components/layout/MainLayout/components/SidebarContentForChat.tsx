import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IChat } from "@/models/Chat";
import { MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function SidebarContentForChat() {
  const [chats, setChats] = useState<IChat[] | null>(null);
  useEffect(() => {
    fetch("/api/chat")
      .then((data) => {
        if (data.ok) {
          return data.json();
        }
      })
      .then((chats) => {
        setChats(chats.chats);
      });
  }, []);
  return (
    <>
      <Link href="/in/chat" className="cursor-pointer">
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
            {chats
              ? chats.map((chat) => {
                  return (
                    <Link
                      key={chat._id && chat.id}
                      href={`/in/chat/${chat._id}`}
                      className="cursor-pointer"
                    >
                      <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
                        {chat.title}
                      </SidebarMenuItem>
                    </Link>
                  );
                })
              : "there no chats"}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm font-semibold text-gray-700">
          Favorites
        </SidebarGroupLabel>
        <ScrollArea className="h-[6rem] overflow-y-auto">
          <SidebarMenu>
            {chats
              ? chats.map((chat) => {
                  if (!chat.isFavorite) return;
                  return (
                    <Link
                      key={chat._id as string}
                      href={`/in/chat/${chat._id}`}
                      className="cursor-pointer"
                    >
                      <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
                        {chat.title}
                      </SidebarMenuItem>
                    </Link>
                  );
                })
              : "there no chats"}
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>
    </>
  );
}
