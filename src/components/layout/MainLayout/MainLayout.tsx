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
import { useUser } from "@/app/context/UserContext";
import NewChatPop from "@/app/in/_components/newChatPop";
import { OpenSidebarContext } from "./OpenSidebarContext";
import { NotificationProvider } from "@/app/context/NotficationContext";
type MainLayoutProps = {} & ReactProps;

export interface SearchBarContext {
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setChats: React.Dispatch<React.SetStateAction<chatType[]>>;
}
export const layoutContext = createContext<SearchBarContext | null>({
  isActive: false,
  setIsActive: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  setChats: () => {},
});

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [chats, setChats] = React.useState<chatType[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const getChat = async () => {
      // todo handle the error here

      if (!user) return;
      try {
        const response = await axios.get("/api/chat", {
          headers: { userid: String(user._id) },
        });
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
  }, [user]);

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
    <div className="relative ">
      <OpenSidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
        <NotificationProvider>
          <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SidebarInset className="w-full ">
              <div className="w-full ">
                <layoutContext.Provider
                  value={{
                    isActive: isSearchActive,
                    setIsActive: (newValue: boolean) => {
                      setIsSearchActive(newValue);
                    },
                    searchQuery: searchQuery,
                    setSearchQuery: (newValue: string) => {
                      setSearchQuery(newValue);
                    },
                    setChats,
                  }}
                >
                  <TopBar isSidebarOpen={isSidebarOpen} />
                  {children}
                </layoutContext.Provider>
              </div>
              <Toaster />
            </SidebarInset>
            <AppSidebar chats={chats} />
          </SidebarProvider>
        </NotificationProvider>
      </OpenSidebarContext.Provider>
      <NewChatPop />
    </div>
  );
}
