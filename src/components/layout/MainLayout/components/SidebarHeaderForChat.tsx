import { useUser } from "@/app/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ReactProps from "@/Types/ReactProps";
import Image from "next/image";
import Link from "next/link";

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

type LogoSectionProps = {
  isAdmin?: boolean;
} & ReactProps;

export function LogoSection({ isAdmin = false }: LogoSectionProps) {
  if (isAdmin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton asChild>
            <div className="w-full h-full flex items-center justify-center ">
              <Image
                src={"/mainLogo.png"}
                width={120}
                height={51}
                alt="logo"
                style={{ height: "auto" }}
              />
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link href={"/in"} className="w-full">
            <DropdownMenuItem className="justify-end">
              شاشة الرئيسية
            </DropdownMenuItem>
          </Link>
          <Link href={"/in/dashboard"} className="w-full">
            <DropdownMenuItem className="justify-end">
              لوحة التحكم
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <SidebarMenuButton
      asChild
      className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
    >
      <div className="w-full h-12 flex items-center ">
        <Link href="/in" className="cursor-pointer flex items-center gap-2">
          <div className="w-full h-12 flex items-center ">
            <Image
              src={"/MainLogo.png"}
              width={120}
              height={40}
              alt="logo"
              style={{ height: "auto" }}
            />
          </div>
        </Link>
      </div>
    </SidebarMenuButton>
  );
}
