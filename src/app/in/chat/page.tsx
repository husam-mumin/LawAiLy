"use client";
import ChatInput from "@/components/ChatInput";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [sendError, setError] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const router = useRouter();
  const user = useUser();

  const handleSend = () => {
    setLoading(true);
    setError(null);

    if (!user) {
      return;
    }

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
        attachFile,
        userId: user._id,
        title: value,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // Handle successful response data
            router.push(`/in/chat/${data.chatId}`); // Redirect to the chat page
            setValue(""); // Clear the input field
          });
        } else {
          console.error("Failed to send message");
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleAttachFile = (file: File) => {
    setAttachFile(file);
    setFileLoading(true);
    // Simulate file upload
    setTimeout(() => {
      setFileLoading(false);
    }, 2000); // Simulate a 2-second file upload
  };
  const handleChange = (value: string) => {
    setValue(value);
  };
  const [value, setValue] = useState("");
  const [attachFile, setAttachFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col gap-10 h-[calc(100vh-5rem)] justify-center items-center">
      {sendError ? <div className="text-red-500">{sendError}</div> : ""}
      <div className="size-35 bg-gray-500 rounded-full "></div>
      <div className="flex justify-center items-center ">
        <ChatInput
          value={value}
          attachFile={attachFile}
          onChange={handleChange}
          onSend={handleSend}
          onAttachFile={handleAttachFile}
          loading={loading}
          fileLoading={fileLoading}
        />
      </div>
    </div>
  );
}
