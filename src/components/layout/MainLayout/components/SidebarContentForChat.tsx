import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { chatType } from "@/models/Chat";
import { HeartOff, MessageCirclePlus, MessageCircleX } from "lucide-react";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

/**
 *
 * todo edit the News Desion
 * make the News in top bar or some where with icon that help to
 * show it
 */

export default function SidebarContentForChat({
  chats,
}: {
  chats: chatType[];
}) {
  const [chatFavorites, setChatFavorites] = useState<chatType[] | null>(null);

  useEffect(() => {
    if (!chats) return;
    const chatF: chatType[] = [];
    for (let index = 0; index < chats.length; index++) {
      if (chats[index].isFavorite) {
        chatF.push(chats[index]);
      }
    }

    setChatFavorites(chatF.length > 0 ? chatF : null);
  }, [chats]);

  return (
    <>
      <Link href="/in/chat" className="cursor-pointer w-full px-4">
        <SidebarMenuButton className="cursor-pointer bg-blue-500 box-border  w-[calc(100%-20px)]   mx-auto py-6 flex justify-center items-center text-white hover:text-white hover:bg-blue-600 focus:bg-blue-600">
          <MessageCirclePlus className="" />
          محادثة جديد
        </SidebarMenuButton>
      </Link>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm ms-auto font-semibold text-gray-700">
          سجل المحدثات
        </SidebarGroupLabel>
        {/* Here you can map through chat history items */}
        <ScrollArea className="h-[8rem] text-right overflow-y-auto border-2 border-black/3 rounded-2xl relative">
          <SidebarMenu className="">
            <Suspense
              fallback={
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                  <div className="stroke-primary/40 size-8 border-2 border-l-0 animate-spin" />
                </div>
              }
            >
              {chats.length != 0 ? (
                chats.map((chat) => {
                  return (
                    <Link
                      key={chat._id && chat._id}
                      href={`/in/chat/${chat._id}`}
                      className="cursor-pointer"
                    >
                      <SidebarMenuItem className="p-2 text-gray-600 border-black/3  hover:bg-gray-100 cursor-pointer">
                        {chat.title}
                      </SidebarMenuItem>
                    </Link>
                  );
                })
              ) : (
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                  <MessageCircleX className="stroke-primary/40 size-8" />
                </div>
              )}
            </Suspense>
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-sm ms-auto font-semibold text-gray-700">
          الفضلة
        </SidebarGroupLabel>
        <ScrollArea className="h-[6rem] text-right overflow-y-auto h-[8rem] overflow-y-auto border-2 rounded-2xl relative">
          <SidebarMenu>
            <Suspense fallback={"loading..."}>
              {chatFavorites ? (
                chatFavorites.map((chat) => {
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
              ) : (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-1/2">
                    <HeartOff className="stroke-primary/40 size-8" />
                  </div>
                </>
              )}
            </Suspense>
          </SidebarMenu>
        </ScrollArea>
      </SidebarGroup>
    </>
  );
}
