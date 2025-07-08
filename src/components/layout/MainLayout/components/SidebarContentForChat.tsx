import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { chatType } from "@/models/Chat";
import { MessageCirclePlus, MessageCircleX, StarOff } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { format, isToday, isYesterday } from "date-fns";

/**
 *
 * todo edit the News Desion
 * make the News in top bar or some where with icon that help to
 * show it
 */

// Arabic month names
const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

function getArabicDateLabel(dateString: string) {
  const dateObj = new Date(dateString);
  if (isToday(dateObj)) return "اليوم";
  if (isYesterday(dateObj)) return "أمس";
  // Format: 28 يونيو 2025
  const day = dateObj.getDate();
  const month = arabicMonths[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function SidebarContentForChat({
  chats,
}: {
  chats: chatType[];
}) {
  // Use useMemo to filter favorites efficiently
  const chatFavorites = React.useMemo(
    () => chats.filter((chat) => chat.isFavorite),
    [chats]
  );

  // Group chats by date (day)
  const chatsByDate = React.useMemo(() => {
    if (!chats) return {};
    return chats.reduce((acc: Record<string, chatType[]>, chat) => {
      // Use chat.createdAt or fallback to today if missing
      const date = chat.createdAt
        ? format(new Date(chat.createdAt), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = [];
      acc[date].push(chat);
      return acc;
    }, {});
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
        <ScrollArea className="h-[8rem] text-right overflow-y-auto relative">
          <SidebarMenu className="">
            <Suspense
              fallback={
                <div className="absolute top-1/2 left-1/2 -translate-1/2">
                  <div className="stroke-primary/40 size-8 border-2 border-l-0 animate-spin" />
                </div>
              }
            >
              {chats.length !== 0 ? (
                Object.entries(chatsByDate).map(([date, chatsOnDate]) => (
                  <div dir="rtl" key={date}>
                    <div className="px-2 py-1 text-xs text-gray-500 font-bold border-b ">
                      {getArabicDateLabel(date)}
                    </div>
                    {chatsOnDate.map((chat) => (
                      <Link
                        key={chat._id && chat._id}
                        href={`/in/chat/${chat._id}`}
                        className="cursor-pointer"
                      >
                        <SidebarMenuItem className="p-2 text-gray-600 border-black/3  hover:bg-gray-100 cursor-pointer">
                          {chat.title.length > 15
                            ? chat.title.slice(0, 15) + "..."
                            : chat.title}
                        </SidebarMenuItem>
                      </Link>
                    ))}
                  </div>
                ))
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
        <ScrollArea className="h-[8rem] text-right overflow-y-auto relative">
          <SidebarMenu>
            <Suspense fallback={"loading..."}>
              {chatFavorites.length > 0 ? (
                chatFavorites.map((chat) => (
                  <Link
                    key={chat._id as string}
                    href={`/in/chat/${chat._id}`}
                    className="cursor-pointer"
                  >
                    <SidebarMenuItem className="p-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
                      {chat.title}
                    </SidebarMenuItem>
                  </Link>
                ))
              ) : (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-1/2">
                    <StarOff className="stroke-primary/40 size-8" />
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
