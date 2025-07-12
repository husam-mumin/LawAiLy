import { useState } from "react";
import axios from "axios";
import { messageResponse } from "@/app/api/chat/[chatid]/messages/route";
import { userType } from "@/models/Users";

/**
 * useSentAction - Hook to handle sending messages and updating message data
 * @param chatid - The chat id
 * @param setMessages - Setter from parent to update messages state
 * @returns { sendMessage, sending, error, updateMessage }
 */
export function useSentAction(
  chatid: string,
  setMessages: React.Dispatch<React.SetStateAction<messageResponse[]>>,
  postNewResponse: (
    message: string,
    messages: messageResponse[],
    messageId: string
  ) => void,
  messages: messageResponse[],
  user: userType
) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send a new message with optional files
  const sendMessage = async (
    content: string,
    files?: Array<{
      id: string;
      fileURL?: string;
      filename?: string;
      fileformat?: string;
    }>
  ) => {
    setSending(true);
    setError(null);
    try {
      // Prepare file IDs for API
      const fileIds = Array.isArray(files) ? files.map((f) => f.id) : [];
      const res = await axios.post<messageResponse>(
        `/api/chat/${chatid}/messages`,
        {
          mes: content,
          userid: user._id,
          files: fileIds,
        }
      );
      // Map files to filesType structure for local state
      const filesTypeList = Array.isArray(files)
        ? files.map((f) => ({
            fileURL: f.fileURL || "",
            filename: f.filename || "",
            filesize: "",
            fileformat: f.fileformat || "",
            filetext: "",
            message: res.data._id,
          }))
        : [];
      setMessages((prev) => [
        ...prev,
        {
          ...res.data,
          files: filesTypeList as unknown as typeof res.data.files,
        },
      ]);
      await postNewResponse(res.data.message, messages, res.data._id);
      return res.data;
    } catch (err) {
      if (err && typeof err === "object" && "message" in err) {
        setError((err as { message?: string }).message || "فشل إرسال الرسالة.");
      } else {
        setError("فشل إرسال الرسالة.");
      }
      return null;
    } finally {
      setSending(false);
    }
  };

  // Update a message in the state (e.g., after AI response or edit)
  const updateMessage = (id: string, data: Partial<messageResponse>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, ...data } : msg))
    );
  };

  return {
    sendMessage,
    updateMessage,
    sending,
    error,
  };
}
