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
  return (
    <>
      <div className="flex items-center justify-between h-16 px-4 ">
        <SidebarMenu>
          <LogoSection isAdmin />
        </SidebarMenu>
        <SidebarTrigger />
      </div>
    </>
  );
}

type LogoSectionProps = {
  isAdmin?: boolean;
} & ReactProps;

function LogoSection({ isAdmin = false, className }: LogoSectionProps) {
  if (isAdmin) {
    return (
      <SidebarMenuItem className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton asChild>
              <div className="w-full h-12 flex items-center ">
                <Image
                  src={"/MainLogo.png"}
                  width={97}
                  height={40}
                  alt="logo"
                />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={"/in"} className="w-full">
              <DropdownMenuItem>Chat</DropdownMenuItem>
            </Link>
            <Link href={"/in/dashboard"} className="w-full">
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    );
  }
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
      >
        <div className="w-full h-12 flex items-center ">
          <Link href="/" className="cursor-pointer flex items-center gap-2">
            <div className="size-10 bg-gray-500 rounded-full" /> Logo
          </Link>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
