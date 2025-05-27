"use client";
import React, { useState } from "react";

import Message from "./_Components/Message";
import Response from "./_Components/Response";
import ChatInput from "@/components/ChatInput";

export default function ChatPage() {
  // const [chatId, setChatId] = useState<string | null>(null);
  // const [chatTitle, setChatTitle] = useState<string | null>(null);
  const [chatInputValue, setChatInputValue] = useState<string>("");
  const [chatInputFiles, setChatInputFiles] = useState<File | null>(null);
  const [chatsendLoading, setChatSendLoading] = useState<boolean>(false);
  const [chatfileUploadLoading, setChatFileUploadLoading] =
    useState<boolean>(false);

  const handleChatInputChange = (value: string) => {
    setChatInputValue(value);
  };

  const handleChatInputSend = () => {
    if (!chatInputValue.trim()) {
      return; // Prevent sending empty messages
    }
    setChatSendLoading(true);
    setTimeout(() => {
      setChatSendLoading(false);
    }, 1000); // Simulate a delay for sending the message
    // Logic to send the chat input
    console.log("Sending message:", chatInputValue);
    setChatInputValue(""); // Clear input after sending
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setChatFileUploadLoading(true);
    // Simulate file upload
    setTimeout(() => {
      setChatFileUploadLoading(false);
      console.log("File uploaded:", file.name);
      setChatInputFiles(file); // Store the uploaded file
    }, 1000); // Simulate a delay for file upload
  };

  return (
    <div>
      <div className="w-screen md:w-180 mx-auto bg-gray-500/5 h-[calc(100vh-120px)] md:h-[calc(100vh-60px)] relative">
        <div className="flex flex-col pt-10 px-2">
          <Message />
          <Response />
          <div className="h-70 w-full " />
          <div className="absolute bottom-4 right-1/2 translate-x-1/2">
            <ChatInput
              value={chatInputValue}
              onChange={handleChatInputChange}
              onSend={handleChatInputSend}
              onAttachFile={handleFileUpload}
              attachFile={chatInputFiles}
              loading={chatsendLoading}
              fileLoading={chatfileUploadLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
