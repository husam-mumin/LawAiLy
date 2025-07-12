"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ReactProps from "@/Types/ReactProps";
import React, { useContext } from "react";
import AvaterMenu from "../MainLayout/components/AvaterMenu";
import { Input } from "@/components/ui/input";
import { layoutContext } from "../MainLayout/MainLayout";
import Notification from "./components/Notification";
import { Search } from "lucide-react";
import { LogoSection } from "./components/SidebarHeaderForChat";
import { useUser } from "@/app/context/UserContext";
import { useIsMobile } from "@/hooks/use-mobile";
type TopBarProps = {
  isSidebarOpen?: boolean;
} & ReactProps;

export default function TopBar({ isSidebarOpen = false }: TopBarProps) {
  const { user } = useUser();
  const searchContext = useContext(layoutContext);
  const { isActive, searchQuery, setSearchQuery } = searchContext || {};
  const isMobile = useIsMobile();

  if (!user) {
    return null; // or handle the case when user is not available
  }
  return (
    <div className="w-full h-16 bg-white print:hidden border border-b-2 border-r-0   sticky top-0  z-50  dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full h-full flex items-center justify-between container mx-auto px-10 ">
        <div className="flex gap-2 sm:ps-12">
          <AvaterMenu />
          <Notification />
        </div>
        {isActive && !isMobile && (
          <div
            className={`flex   items-center justify-center ${
              isSidebarOpen ? "w-fit mx-auto" : ""
            }  max-w-md `}
          >
            <Input
              type="text"
              placeholder="بحث"
              icon={<Search className="size-4 text-gray-500" />}
              value={searchQuery}
              className="mx-2 w-54 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <div
          className={`flex gap-4  items-center ${
            isSidebarOpen ? "md:hidden" : "md:flex"
          }`}
        >
          <LogoSection isAdmin={["admin", "owner"].includes(user.role)} />
          {<SidebarTrigger className="" />}
        </div>
      </div>
    </div>
  );
}
