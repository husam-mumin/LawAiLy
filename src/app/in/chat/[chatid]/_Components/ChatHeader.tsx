"use client";
import { ToggleFavoriteResponse } from "@/app/api/chat/[chatid]/favorite/route";
import { layoutContext } from "@/components/layout/MainLayout/MainLayout";
import { userType } from "@/models/Users";
import axios, { AxiosError } from "axios";
import { Heart, TimerIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderMenu from "./HeaderMenu";
import { Button } from "@/components/ui/button";

type ChatHeaderprops = {
  title?: string;
  isFavorite?: boolean;
  user: userType;
};

export default function ChatHeader({
  title,
  isFavorite: isFavoriteProps,
  user,
}: ChatHeaderprops) {
  const params: { chatid: string } = useParams();
  const chatid = params.chatid;
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const context = React.useContext(layoutContext);

  useEffect(() => {
    setIsFavorite(isFavoriteProps || false);
    setFavoriteLoading(false);
  }, [isFavoriteProps]);
  async function handleFavoriteClick() {
    if (!user) return;
    try {
      setFavoriteLoading(true);
      const response = await axios.patch<ToggleFavoriteResponse>(
        `/api/chat/${chatid}/favorite`,
        {
          userId: user._id,
        }
      );
      if (response.status == 200) {
        const data = response.data;
        if (data.isFavorite === undefined) {
          console.error("isFavorite is undefined in response");
          setFavoriteLoading(false);
          return;
        }
        // Update the chat in the context
        if (context && context.setChats) {
          context.setChats((prevChats) => {
            prevChats.map((prevChat) => {
              if (prevChat && prevChat._id === chatid) {
                return { ...prevChat, isFavorite: data.isFavorite };
              }
              return prevChat;
            });

            return [...prevChats];
          });
          setIsFavorite(data.isFavorite);
          setFavoriteLoading(false);
        }
      } else {
        console.error("Failed to toggle favorite status");
        setFavoriteLoading(false);
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.message);
      }
      setFavoriteLoading(false);
    }
  }

  return (
    <div
      className="w-full h-20 flex justify-between items-center px-4 
    bg-gray-100 border-b border-gray-300"
    >
      <HeaderMenu chatid={chatid} />
      <div className="h-20 flex gap-4 items-center">
        {favoriteLoading ? (
          <div className="">
            <TimerIcon className="w-5 h-5" />
          </div>
        ) : (
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={handleFavoriteClick}
          >
            {isFavorite ? <Heart className="fill-red-500" /> : <Heart />}{" "}
          </Button>
        )}
        <h1 className="text-xl font-bold text-black/85">{title}</h1>
      </div>
    </div>
  );
}
