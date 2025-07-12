import { useState } from "react";
import axios from "axios";
import { PostNewChat } from "@/app/api/chat/route";

export interface AddMessageParams {
  message: string;
  userId: string;
  files?: { id: string }[];
}

export interface AddMessageResult {
  loading: boolean;
  error: string | null;
  addMessage: (params: AddMessageParams) => Promise<PostNewChat | null>;
  chat: PostNewChat | null;
}

export interface Message {
  id: string;
  chatId: string;
  username: string;
  message: string;
  createdAt: string;
  files?: string[];
}

export interface Chat {
  id: string;
  users: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function useAddMessage(): AddMessageResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<PostNewChat | null>(null);

  const addMessage = async ({ message, userId, files }: AddMessageParams) => {
    setLoading(true);
    setError(null);
    try {
      let data: FormData | object;
      let config = {};
      if (files && files.length > 0) {
        const formData = new FormData();
        const filesIds: string[] = [];
        files.forEach((file) => {
          if (file.id) {
            filesIds.push(file.id);
          }
        });
        formData.append("message", message);
        formData.append("username", userId);
        formData.append("FileId", JSON.stringify(filesIds));
        data = formData;
        config = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        data = { message, userId };
        config = { headers: { "Content-Type": "application/json" } };
      }
      const res = await axios.post("/api/chat", data, config);
      if (res.status != 201) throw new Error("فشل إرسال الرسالة");
      setChat(res.data as PostNewChat);
      return res.data as PostNewChat;
    } catch (e) {
      const err = e;
      if (axios.isAxiosError(err)) {
        setError(
          err?.response?.data?.message || err?.message || "حدث خطأ غير متوقع"
        );
      }
      if (e instanceof Error) {
        setError(e.message);
      }
      setError("حدث خطأ أثناء إرسال الرسالة");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addMessage, chat };
}
