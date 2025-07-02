import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { chatType } from "@/models/Chat";
import {  messageResponse } from "@/app/api/chat/[chatid]/messages/route";

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

  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setMessagesLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/chat/${chatid}/messages`);
      console.log("Fetched messages:", res.data.chat);
      
      setMessages(res.data.chat || []);
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
  }


  const fetchChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/chat/${chatid}`);
      setChat(res.data.chat || null);
      console.log("Fetched chat:", res.data.chat);
      
      fetchMessages(); // Fetch messages after chat is loaded
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

  useEffect(() => {
    if (chatid) fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatid]);

  return { chat, messages, loading, error, messagesLoading, refresh: fetchChat };
}
