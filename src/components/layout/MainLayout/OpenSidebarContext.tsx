import { createContext, useContext } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const OpenSidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export function useOpenSidebar() {
  const context = useContext(OpenSidebarContext);
  if (!context) {
    throw new Error(
      "useOpenSidebar must be used within an OpenSidebarContext.Provider"
    );
  }
  return context;
}
