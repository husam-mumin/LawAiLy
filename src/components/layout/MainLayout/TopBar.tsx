"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ReactProps from "@/Types/ReactProps";
import React, { useContext } from "react";
import AvaterMenu from "../MainLayout/components/AvaterMenu";
import { Input } from "@/components/ui/input";
import { SearchContext } from "../MainLayout/MainLayout";
type TopBarProps = {
  isSidebarOpen?: boolean;
} & ReactProps;

export default function TopBar({ isSidebarOpen = false }: TopBarProps) {
  const searchContext = useContext(SearchContext);
  const { isActive, searchQuery, setSearchQuery } = searchContext || {};

  return (
    <div className="w-full h-13  flex items-center  container mx-auto px-10 sticky top-0  z-50  dark:bg-gray-800 dark:border-gray-700">
      {isSidebarOpen || <SidebarTrigger />}
      {isActive && (
        <div className="flex items-center  max-w-md ">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            className="mx-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          />
        </div>
      )}
      <div className="ms-auto ">
        <AvaterMenu />
      </div>
    </div>
  );
}
