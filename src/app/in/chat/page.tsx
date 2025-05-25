"use client";
import ChatInput from "@/components/ChatInput";
import React, { useState } from "react";

export default function Chat() {
  const handleSend = () => {
    console.log("Message sent");
  };
  const handleAttachFile = (file: File) => {
    setAttachFile(file);
    console.log("File attached:", file);
  };
  const handleChange = (value: string) => {
    setValue(value);
    console.log("Input changed:", value);
  };
  const [value, setValue] = useState("");
  const [attachFile, setAttachFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-10 h-[calc(100vh-5rem)] justify-center items-center">
      <div className="size-35 bg-gray-500 rounded-full "></div>
      <div className="flex justify-center items-center ">
        <ChatInput
          value={value}
          attachFile={attachFile}
          onChange={handleChange}
          onSend={handleSend}
          onAttachFile={handleAttachFile}
        />
      </div>
    </div>
  );
}
