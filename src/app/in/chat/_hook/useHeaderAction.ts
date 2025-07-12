import { useCallback, useState } from "react";
import axios from "axios";
import { chatType } from "@/models/Chat";
import { chatPutResponse } from "@/app/api/chat/[chatid]/route";

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
    return `${window.location.origin}/in/chat/${chat._id}`;
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
