import { useUser } from "@/app/context/UserContext";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LogoSection } from "./LogoSection";

export default function SidebarHeaderForChat() {
  const { user } = useUser();
  return (
    <>
      <div className="flex items-center justify-between h-10 px-4 ">
        <SidebarTrigger />
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoSection isAdmin={user?.role != "user" ? true : false} />
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </>
  );
}
