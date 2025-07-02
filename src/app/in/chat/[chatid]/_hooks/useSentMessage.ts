import { useState } from "react";
import { messageType } from "@/models/Messages";
import axios, { AxiosError } from "axios";

export function useSentMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<messageType | null>(null);

  const send = async (message: string, chatid: string, user: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const sentData = {
      message, // use 'message' key for backend compatibility
      userid: user,
    };
    try {
      // Use the correct endpoint for sending messages
      const response = await axios.post<messageType>(
        "/api/chat/send",
        { ...sentData, chatid }
      );
      setResult(response.data);
      return response.data;
    } catch (err: unknown) {
      let msg = "حدث خطأ أثناء إرسال الرسالة.";
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          msg = "غير مصرح. يرجى تسجيل الدخول مجددًا.";
        } else {
          msg = err.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error, result };
}