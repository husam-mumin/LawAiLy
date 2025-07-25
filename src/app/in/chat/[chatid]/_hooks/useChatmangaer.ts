import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { chatType } from "@/models/Chat";
import { messageResponse } from "@/app/api/chat/[chatid]/messages/route";

/**
 * useChatManager
 * Fetches chat history, title, and manages chat status (loading, error, etc).
 * Usage:
 *   const { chat, messages, loading, error, refresh } = useChatManager(chatid);
 */
export function useChatManager(chatid: string) {
  const [chat, setChat] = useState<chatType | null>(null);
  const [messages, setMessages] = useState<messageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Track which messages are being processed to avoid duplicate POSTs
  const processingMessages = useRef<Set<string>>(new Set());

  const fetchMessages = async () => {
    setMessagesLoading(true);
    setError(null);
    try {
      const res = await axios.get<{ chat: messageResponse[] }>(
        `/api/chat/${chatid}/messages`
      );

      setMessages(res.data.chat || []);

      // Post new Response because the message has not Response
      res.data.chat.forEach((msg) => {
        if (!msg.response && !processingMessages.current.has(msg._id)) {
          processingMessages.current.add(msg._id);
          PostNewResponse(msg.message, res.data.chat, msg._id);
        }
      });
    } catch (err: unknown) {
      let msg = "فشل تحميل الرسائل.";
      if (err instanceof AxiosError) {
        msg = err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Only fetch chat, do not fetch messages here
  const fetchChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/chat/${chatid}`);
      setChat(res.data.chat || null);
      // Do NOT call fetchMessages here
    } catch (err: unknown) {
      let msg = "فشل تحميل المحادثة.";
      if (err instanceof AxiosError) {
        msg = err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const PostNewResponse = async (
    message: string,
    messages: messageResponse[],
    messageid: string
  ) => {
    setResponseLoading(true);
    setError(null);
    try {
      const res = await axios.post(`/api/chat/response`, {
        message,
        messages,
        messageid,
        chat: chatid,
      });
      setMessages((prev) => {
        const editArray = prev.map((msg) =>
          msg._id === messageid ? { ...msg, response: res.data.response } : msg
        );
        return [...editArray];
      });
    } catch (err: unknown) {
      let msg = "فشل إضافة الرد.";
      if (err instanceof AxiosError) {
        msg = err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setResponseLoading(false);
      // Remove from processing set so it can be retried if needed
      processingMessages.current.delete(messageid);
    }
  };

  // Fetch chat when chatid changes
  useEffect(() => {
    if (chatid) fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatid]);

  // Fetch messages only after chat is loaded
  useEffect(() => {
    if (chat) fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat]);

  return {
    chat,
    messages,
    loading,
    setMessages,
    error,
    messagesLoading,
    responseLoading,
    PostNewResponse,
    refresh: fetchChat,
  };
}
