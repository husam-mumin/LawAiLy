import React from "react";
import Message from "./_Components/Message";
import Response from "./_Components/Response";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {
  return (
    <div>
      <div className="w-screen md:w-180 mx-auto bg-gray-500/5 h-[calc(100vh-120px)] md:h-[calc(100vh-60px)] relative">
        <div className="flex flex-col pt-10 px-2">
          <Message />
          <Response />
          <div className="h-70 w-full " />
          <div className="absolute bottom-4 right-1/2 translate-x-1/2">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
