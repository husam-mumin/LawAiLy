import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import axios from "axios";
import React from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { responseWithLoading } from "../page";
import { userType } from "@/models/Users";

export default function Response({
  chat,
  response,
  user,
}: {
  response: responseWithLoading;
  user: userType;
  chat: string;
  loading: boolean;
}) {
  async function handleCopy() {
    if (response.response) {
      try {
        console.log(response);
        await axios.post(`/api/chat/${chat}/${response._id}/isshared`, {
          userId: user._id,
        });
        await navigator.clipboard.writeText(response.response);
        toast.success("Copied to clipboard and share recorded!");
      } catch {
        toast.error("Failed to copy response to clipboard.");
      }
    }
  }

  async function handleShare() {
    if (response.response) {
      try {
        await axios.post(`/api/chat/${chat}/${response.id}/isshared`, {
          userId: user._id,
        });
        // Optionally, you can show a toast or notification here
      } catch {
        toast.error("Failed to record share.");
      }
    }
  }

  return (
    <div>
      <div className="relative">
        {response.isLoading ? (
          <div>Loading...</div>
        ) : response.response ? (
          <ContextMenu>
            <ContextMenuTrigger className="bg-amber-300">
              <div className="markdown prose">
                <ReactMarkdown>{response.response}</ReactMarkdown>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={handleCopy}>copy</ContextMenuItem>
              <ContextMenuItem asChild>
                {/* Share to WhatsApp and record share in DB */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    response.response || ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleShare}
                >
                  share
                </a>
              </ContextMenuItem>
              <ContextMenuItem>more</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ) : null}
      </div>
    </div>
  );
}
