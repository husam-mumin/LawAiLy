import { useState } from "react";
import axios from "axios";

interface UseResponseActionOptions {
  chatId: string;
  userId: string;
}

export function useResponseAction({ chatId,  userId }: UseResponseActionOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGood, setIsGood] = useState<boolean | null>(null);

  // Share response
  const shareResponse = async (responseId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(`/api/chat/${chatId}/${responseId}/isshared`, { userId });
      if(res.status !== 201) {
        throw new Error(res.data.error || "حدث خطأ أثناء المشاركة");
      }
      setSuccess("تمت مشاركة الرد بنجاح");
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "حدث خطأ أثناء المشاركة");
      } else if (err instanceof Error) {
        setError(err.message || "حدث خطأ أثناء المشاركة");
      } else {
        setError("حدث خطأ غير متوقع أثناء المشاركة");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mark response as good/bad/none
  const setGoodStatus = async (responseId : string ,isGood: boolean | null) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.patch(`/api/chat/${chatId}/${responseId}/isgood/${isGood}`);
      if (res.status !== 200) {
        throw new Error(res.data.error || "حدث خطأ في التقييم");
      }
      setIsGood(isGood);
      setSuccess("تم تحديث التقييم بنجاح");
      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "حدث خطأ في التقييم");
      } else if (err instanceof Error) {
        setError(err.message || "حدث خطأ في التقييم");
      } else {
        setError("حدث خطأ غير متوقع في التقييم");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    isGood,
    shareResponse,
    setGoodStatus,
    setError,
    setSuccess,
  };
}
