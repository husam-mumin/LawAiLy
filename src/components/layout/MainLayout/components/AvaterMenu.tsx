import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AvaterMenu() {
  const router = useRouter();
  const handleLogout = async () => {
    // Handle logout logic here
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then((data) => {
        if (data.status == 200) {
          router.replace("/login");
        }
      })
      .catch((error) => {
        throw new Error("something go wrong", error);
      });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-blue-600 text-white">
            <span className="text-xs">A</span>
          </AvatarFallback>
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/12345678?v=4"
            alt="User Avatar"
          />
          {/* You can replace the src with a dynamic user image URL */}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href={"/in/me"}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout}>logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
