import { useState } from "react";
import axios, { AxiosError } from "axios";
import { responseType } from "@/models/Responses";

/**
 * useResponseReceive
 * Hook to request and receive an AI response for a chat message.
 * Handles loading, error, and result states.
 *
 * Usage:
 *   const { receive, loading, error, result } = useResponseReceive();
 *   await receive({ chatid, message, messageid });
 */
export function useResponseReceive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<responseType | null>(null);

  /**
   * Request an AI response for a message in a chat.
   * @param params { chatid: string, message: string, messageid: string }
   */
  const receive = async ({ chatid, message, messageid }: { chatid: string; message: string; messageid: string }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await axios.post<responseType>("/api/chat/response", {
        chat: chatid,
        message,
        messageid,
      });
      setResult(res.data);
      return res.data;
    } catch (err: unknown) {
      let msg = "حدث خطأ أثناء استقبال الرد.";
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

  return { receive, loading, error, result };
}
