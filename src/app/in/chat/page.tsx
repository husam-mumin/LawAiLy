"use client";
import ChatInput from "@/components/ChatInput";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const router = useRouter();

  const handleSend = () => {
    console.log("Message sent:", value);
    setLoading(true);
    setError(null);

    fetch("/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: value, attachFile }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log("Response data:", data);
            // Handle successful response data
            router.push(`/chat/${data.chatId}`); // Redirect to the chat page
            setValue(""); // Clear the input field
          });
          console.log("Message sent successfully");
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
          loading={loading}
          fileLoading={fileLoading}
        />
      </div>
    </div>
  );
}
