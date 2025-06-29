"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ReactProps from "@/Types/ReactProps";
import React, { useContext } from "react";
import AvaterMenu from "../MainLayout/components/AvaterMenu";
import { Input } from "@/components/ui/input";
import { layoutContext } from "../MainLayout/MainLayout";
import Notification from "./components/Notification";
type TopBarProps = {
  isSidebarOpen?: boolean;
} & ReactProps;

export default function TopBar({ isSidebarOpen = false }: TopBarProps) {
  const searchContext = useContext(layoutContext);
  const { isActive, searchQuery, setSearchQuery } = searchContext || {};

  return (
    <div className="w-full h-13 bg-white shadow-md print:hidden   sticky top-0  z-50  dark:bg-gray-800 dark:border-gray-700">
      <div className="w-full h-full flex items-center container mx-auto px-10 ">
        <div className="flex gap-2 sm:ps-12">
          <AvaterMenu />
          <Notification />
        </div>
        {isActive && (
          <div className="flex items-center  max-w-md ms-auto">
            <Input
              type="text"
              placeholder="بحث"
              value={searchQuery}
              className="mx-2 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <div
          className={`block ms-auto ${
            isSidebarOpen ? "md:hidden" : "md:block"
          }`}
        >
          {<SidebarTrigger />}
        </div>
      </div>
    </div>
  );
}
