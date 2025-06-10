"use client";
import { ToggleFavoriteResponse } from "@/app/api/chat/[chatid]/favorite/route";
import { layoutContext } from "@/components/layout/MainLayout/MainLayout";
import { userType } from "@/models/Users";
import axios, { AxiosError } from "axios";
import { Heart } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    <div className="w-full h-20 flex gap-4 justify-center items-center">
      {favoriteLoading ? (
        <div className="animate-spin">
          <div className="fill-red-500 size-6 border-4 rounded-full border-b-0 border-l-0 border-solid border-black" />
        </div>
      ) : (
        <div className="cursor-pointer" onClick={handleFavoriteClick}>
          {isFavorite ? <Heart className="fill-red-500" /> : <Heart />}{" "}
        </div>
      )}
      <h1 className="text-xl font-bold text-black/85">{title}</h1>
    </div>
  );
}
