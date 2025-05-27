import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

export default function Message() {
  return (
    <div className="flex gap-3">
      <div className="ms-auto w-fit bg-primary/10 px-5 py-2 rounded-full">
        what is this
      </div>
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
    </div>
  );
}
