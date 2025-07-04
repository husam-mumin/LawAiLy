import { useUser } from "@/app/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AvaterMenu() {
  const { setUser, user } = useUser();
  const router = useRouter();
  const handleLogout = async () => {
    // Handle logout logic here
    try {
      const response = await axios.post("/api/auth/logout");
      if (response.status === 200) {
        setUser(null); // Clear user state
        router.replace("/login");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        throw new Error("something go wrong: " + error.message);
      }
      throw new Error("something go wrong " + error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-blue-600 text-white">
            <span className="text-xs">A</span>
          </AvatarFallback>
          <AvatarImage src={user?.AvatarURL} alt="User Avatar" />
          {/* You can replace the src with a dynamic user image URL */}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <Link href={"/in/me"}>
          <DropdownMenuItem className="justify-end">ملفي</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout} className="justify-end">
          تسجيل خروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
