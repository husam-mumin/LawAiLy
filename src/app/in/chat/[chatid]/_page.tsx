"use client";
import React, { useEffect, useState } from "react";

import Message from "./_Components/Message";
import Response from "./_Components/Response";
import ChatInput from "@/components/ChatInput";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { IResponse } from "@/models/Responses";
import { messageResponse } from "@/app/api/chat/[chatid]/route";
import { IMessage } from "@/models/Messages";

export type responseChatType = {
  chat: { title: string; isfavorite: boolean };
  messages: messagesWithResponse[];
};

export type messagesWithResponse = IMessage & {
  responses: IResponse[];
};

export default function ChatPage() {

  const handleFavireButton = async () => {
    fetch(`/api/chat/${chatid}/favorites`, {
      method: "POST",
    }).then((data) => {
      if (data.ok) {
        setChatfa(!chatfa);
      }
    });
  };

  useEffect(() => {
    // Fetch the Chat data title, messages and response

    setFirstChatLoading(true);
    const getChatData = async () => {

      const aiResponses = await sendtoAI(chats.chat._id as string, {
        message: chats.messages[0].message,
        _id: chats.messages[0]._id,
      });
      const s = chats.messages;
      compantResponseWithMessages(s, aiResponses);

      setFirstChatLoading(false);
    };

    getChatData();
  }, [chatid]);

  const compantResponseWithMessages = (
    messages: messagesWithResponse[],
    response: IResponse
  ) => {
    messages.map((e) => {
      if (response.message == e._id) return { ...e, response };
      return e;
    });
    const newarray = [...messages];
    return newarray;
  };

  const handleChatInputChange = (value: string) => {
    setChatInputValue(value);
  };

  const sendtoAI = async (
    chatid: string,
    message: { message: string; _id: string }
  ) => {
    const body = {
      chat: chatid,
      message: message.message,
      messageid: message._id,
    };
    const responsesJson = await fetch("/api/chat/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!responsesJson.ok) {
      throw new Error("Failed to create response");
    }

    const responses = await responsesJson.json();

    console.log("response return value:", responses);
    return responses;
  };

  const user = useUser();
  const handleChatInputSend = async () => {
    try {
      if (!chatInputValue.trim()) return; // Prevent sending empty messages

      setChatSendLoading(true);

      const usera = await user;

      if (!usera) return;
      // Logic to send the chat input
      const response = await fetch(`/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatid: chatid,
          userid: usera._id,
          message: chatInputValue,
        }),
      });
      // if we get error message

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const messages = await response.json();

      const fetchResponseBody = {
        chat: chatid,
        message: messages[0].message,
        messageid: messages[0]._id,
      };

      const airesponses = await sendtoAI(fetchResponseBody.chat, {
        _id: fetchResponseBody.messageid,
        message: fetchResponseBody.message,
      });

      setMessages((prev) => {
        if (!prev || prev.length !== 1) return prev;
        // Clone the messages array and the responses array
        const newMessages = [...prev];
        const newResponses = [
          ...newMessages[0].responses,
          airesponses.response,
        ];
        newMessages[0] = {
          ...newMessages[0],
          responses: newResponses,
        };
        return newMessages;
      });
      setChatSendLoading(false);
      setChatInputValue(""); // Clear input after sending
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    setChatFileUploadLoading(true);
    // Simulate file upload
    setTimeout(() => {
      setChatFileUploadLoading(false);
      setChatInputFiles(file); // Store the uploaded file
    }, 1000); // Simulate a delay for file upload
  };

  return (
  );
}
