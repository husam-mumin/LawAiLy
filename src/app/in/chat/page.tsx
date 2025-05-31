"use client";
import ChatInput from "@/components/ChatInput";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAddMessage } from "./[chatid]/_hooks/useAddMessage";

const suggestion: string[] = [
  "first you need to change something",
  "second slug",
  "third now you can do slug slug slug slug",
];

export default function Chat() {
  const {
    chatInputFiles,
    chatInputValue,
    chatfileUploadLoading,
    chatsendLoading,
    handleChatInputChange,
    handleFileInputChange,
    handleSentButton,
    error,
  } = useAddMessage();
  const [currentSuggestion, setCurrentSuggesion] = useState("");

  useEffect(() => {
    setCurrentSuggesion(suggestion[0]);
    let index = 1;
    const sugguestToggle = setInterval(() => {
      setCurrentSuggesion(suggestion[index]);
      index = index + 1 < suggestion.length ? index + 1 : 0;
    }, 4000);

    return () => {
      clearInterval(sugguestToggle);
    };
  }, [suggestion]);

  return (
    <div className="container  mx-auto  overflow-hidden">
      <div className="flex flex-col gap-10 h-[calc(100dvh-5rem)] justify-center items-center relative ">
        {error ? <div className="text-red-500">{error}</div> : ""}
        <div className="absolute top-5 right-1/2 translate-x-1/2 w-80 md:w-max min-w-fit ">
          <div
            className={`max-w-max w-full px-7 animate-pulse py-2 border-2 border-destructive rounded-full text-destructive flex gap-4 items-center
          `}
          >
            <Info className="stroke-destructive size-10 md:size-5 " /> The model
            is under testing don&apos;t trust the answers
          </div>
        </div>
        <div className="size-35 bg-gray-500 rounded-full"></div>
        <div className="flex justify-center items-center ">
          <ChatInput
            value={chatInputValue}
            attachFile={chatInputFiles}
            onChange={handleChatInputChange}
            onSend={handleSentButton}
            onAttachFile={handleFileInputChange}
            loading={chatsendLoading}
            fileLoading={chatfileUploadLoading}
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-80">
          {currentSuggestion && (
            <div className="w-max border-2 px-5 py-2 bg-secondary text-secondary-foreground rounded-2xl">
              {currentSuggestion}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
