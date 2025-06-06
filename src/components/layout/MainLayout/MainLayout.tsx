"use client";
import React, { useEffect } from "react";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ReactProps from "@/Types/ReactProps";
import { createContext } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { chatType } from "@/models/Chat";
import axios, { AxiosError } from "axios";
type MainLayoutProps = {} & ReactProps;

export interface SearchBarContext {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
export const SearchContext = createContext<SearchBarContext | null>({
  isActive: false,
  setIsActive: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
});

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [chats, setChats] = React.useState<chatType[]>([]);

  useEffect(() => {
    const getChat = async () => {
      try {
        const response = await axios("/api/chat");
        const data: chatType[] = response.data;
        setChats(data);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          if (err.status === 404) {
            return;
          }
          // todo complete this Catch
          console.error(err.message);
        }
      }
    };

    getChat();
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    // Check if the pathname is the root path
    if (pathname === "/in") {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  }, [pathname]);

  // ! fix the layout issue ( margin Spaces )
  return (
    <div className="relative">
      <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <AppSidebar chats={chats} />
        <SidebarInset className="w-full ">
          <div className="w-full ">
            <SearchContext.Provider
              value={{
                isActive: isSearchActive,
                setIsActive: (newValue: boolean) => {
                  setIsSearchActive(newValue);
                },
                searchQuery: searchQuery,
                setSearchQuery: (newValue: string) => {
                  setSearchQuery(newValue);
                },
              }}
            >
              <TopBar isSidebarOpen={isSidebarOpen} />
              {children}
            </SearchContext.Provider>
          </div>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
