"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ClipboardIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type messageprops = {
  value: string;
  loading?: boolean;
};

export default function Message({ value, loading = false }: messageprops) {
  const [isCoped, setIsCoped] = useState<boolean>(false);
  // This component displays a message with a user avatar and a clipboard icon.
  // The message value is displayed in a styled div, and the avatar shows a placeholder image.
  // The clipboard icon is wrapped in a button for potential copy functionality.
  // The loading prop indicates whether the message is currently being loaded.
  // If loading is true, it displays "loading..." instead of the actual value.
  function handleCopy() {
    // This function handles the copy action when the clipboard icon is clicked.
    // It copies the message value to the clipboard.
    if (!navigator.clipboard) {
      toast.error("Clipboard API not supported in this browser.");
      return;
    }
    if (!value) {
      toast.error("Nothing to copy!");
      return;
    }
    // Attempt to write the value to the clipboard
    // add To Share
    // If successful, show a success toast message
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success("Copied to clipboard!", {
          description: "The message has been copied successfully.",
        });
      })
      .catch((err) => {
        toast.error("Failed to copy: ", err);
      });
    setIsCoped(true);
    setTimeout(() => {
      setIsCoped(false);
    }, 2000); // Reset the copy state after 2 seconds
  }
  return (
    <div className="flex flex-col ms-auto w-fit ">
      <div className="flex gap-3">
        <div className="ms-auto w-fit bg-primary/5 px-5 py-2 rounded-full text-black/85">
          {!loading ? value : "loading..."}
        </div>
        {/* // todo replace the src with a dynamic  user image URL */}
        <Avatar className="w-9 h-9">
          <AvatarFallback className="bg-blue-600 text-white">
            <span className="text-xs">A</span>
          </AvatarFallback>
          <AvatarImage
            src="https://avatars.githubusercontent.com/u/12345678?v=4"
            alt="User Avatar"
          />
        </Avatar>
      </div>
      <div className="flex justify-end me-14">
        <Button variant={"ghost"} onClick={handleCopy} className="p-2">
          {isCoped ? <ClipboardCheck /> : <ClipboardIcon />}
        </Button>
      </div>
    </div>
  );
}
