import { useCallback, useState } from "react";
import axios from "axios";
import { chatType } from "@/models/Chat";
import { chatPutResponse } from "@/app/api/chat/[chatid]/route";
import { toast } from "sonner";

/**
 * Hook for chat header actions: rename, delete, share, copy link, favorite.
 * Returns action handlers for use in ChatHeader or its dropdown menu.
 */
export function useHeaderAction(chat: chatType | null, onSuccess?: () => void) {
  // Rename chat title
  const renameChat = useCallback(
    async (newTitle: string) => {
      if (!chat || !chat._id) return;
      await axios.put(`/api/chat/${chat._id}`, { ...chat, title: newTitle });
      if (onSuccess) onSuccess();
    },
    [chat, onSuccess]
  );

  // Delete chat
  const deleteChat = useCallback(
    async () => {
      try {
        if (!chat || !chat._id) return;
        const res = await axios.delete(`/api/chat/${chat._id}`);
        if (res.status !== 200) {
          throw new Error("Failed to delete chat");
        }
        return true;
      } catch {
        return false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chat, onSuccess]
  );

  // Share chat (returns shareable URL)
  const shareChat = useCallback(() => {
    if (!chat || !chat._id) return "";
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/in/chat/${chat._id}?isShare=true`;
    // Try Web Share API for mobile
    if (navigator.share) {
      navigator
        .share({
          title: "محادثة مشتركة",
          text: chat.title || "محادثة من Lawaily",
          url,
        })
        .then(() => {
          toast("تمت مشاركة رابط المحادثة!", {
            icon: "🔗",
            duration: 2000,
            style: {
              background: "#e0f2fe",
              color: "#1e3a8a",
              left: "10%",
              width: "90dvw",
              maxWidth: 400,
              fontWeight: "bold",
              fontSize: "1.1rem",
            },
          });
        })
        .catch(() => {
          navigator.clipboard.writeText(url);
          toast("تم نسخ رابط المحادثة!", {
            description: "يمكنك الآن مشاركة هذه المحادثة مع أي شخص.",
            icon: "🔗",
            duration: 2500,
            style: {
              background: "#e0f2fe",
              color: "#1e3a8a",
              left: "10%",
              width: "90dvw",
              maxWidth: 400,
              fontWeight: "bold",
              fontSize: "1.1rem",
            },
          });
        });
    } else {
      navigator.clipboard.writeText(url);
      toast("تم نسخ رابط المحادثة!", {
        description: "يمكنك الآن مشاركة هذه المحادثة مع أي شخص.",
        icon: "🔗",
        duration: 2500,
        style: {
          background: "#e0f2fe",
          color: "#1e3a8a",
          fontWeight: "bold",
          fontSize: "1.1rem",
        },
      });
    }
    return url;
  }, [chat]);

  // Copy chat link to clipboard
  const copyLink = useCallback(() => {
    const url = shareChat();
    if (url) navigator.clipboard.writeText(url);
  }, [shareChat]);

  // Toggle favorite with status
  const [favoriteStatus, setFavoriteStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const toggleFavorite = useCallback(
    async (isFavorite: boolean) => {
      if (!chat || !chat._id) return;
      setFavoriteStatus("loading");
      try {
        const res = (await axios.put<chatPutResponse>(`/api/chat/${chat._id}`, {
          ...chat,
          isFavorite: !isFavorite,
        })) as import("axios").AxiosResponse<chatPutResponse>;
        if (onSuccess) onSuccess();
        const { chat: updatedChat } = res.data;
        return updatedChat.isFavorite;
      } catch {
        return;
      }
    },
    [chat, onSuccess]
  );

  return {
    renameChat,
    deleteChat,
    shareChat,
    copyLink,
    toggleFavorite,
    favoriteStatus,
  };
}
