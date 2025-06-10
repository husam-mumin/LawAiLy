import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClipboardIcon } from "lucide-react";
import React from "react";

type messageprops = {
  value: string;
  loading?: boolean;
};

export default function Message({ value, loading = false }: messageprops) {
  return (
    <div className="flex flex-col ms-auto w-fit ">
      <div className="flex gap-3">
        <div className="ms-auto w-fit bg-primary/5 px-5 py-2 rounded-full text-black/85">
          {!loading ? value : "loading..."}
        </div>
        {/* // todo replace the src with a dynamic  user image URL */}
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-blue-600 text-white">
            <span className="text-xs">A</span>
          </AvatarFallback>
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/12345678?v=4"
            alt="User Avatar"
          />
        </Avatar>
      </div>
      <div className="flex justify-end me-14">
        <Button variant={"ghost"}>
          <ClipboardIcon />
        </Button>
      </div>
    </div>
  );
}
