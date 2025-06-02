import { Heart } from "lucide-react";
import React from "react";

type ChatHeaderprops = {
  title?: string;
  isFavorite?: boolean;
};

export default function ChatHeader({
  title = "untitle",
  isFavorite = false,
}: ChatHeaderprops) {
  return (
    <div className="w-full h-20 flex justify-center items-center">
      <h1>{title}</h1>
      <div>{isFavorite ? <Heart className="fill-red-500" /> : <Heart />} </div>
    </div>
  );
}
