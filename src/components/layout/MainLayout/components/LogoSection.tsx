import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import ReactProps from "@/Types/ReactProps";
import Image from "next/image";
import Link from "next/link";

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
                src={"/MainLogo.png"}
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
export function LogoSectionGuest() {
  return (
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
  );
}
