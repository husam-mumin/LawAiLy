import { useCallback, useState } from "react";
import axios from "axios";
import { chatType } from "@/models/Chat";

/**
 * useChatActions - Hook for chat actions (delete, etc)
 * @param chat Chat object
 * @returns { deleteChat, deleteStatus }
 */
export function useChatActions(chat: chatType | null) {
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const deleteChat = useCallback(async () => {
    if (!chat || !chat._id) return false;
    setDeleteStatus("loading");
    try {
      await axios.delete(`/api/chat/${chat._id}`);
      setDeleteStatus("success");
      return true;
    } catch {
      setDeleteStatus("error");
      return false;
    }
  }, [chat]);

  return {
    deleteChat,
    deleteStatus,
  };
}
