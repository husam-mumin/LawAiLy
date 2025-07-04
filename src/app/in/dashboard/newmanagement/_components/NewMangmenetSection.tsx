"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Check, X, RefreshCcw } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const fetchNewsHistory = async (): Promise<NewsItem[]> => {
  const res = await fetch("/api/news");
  if (!res.ok) return [];
  return res.json();
};

const postNews = async (title: string, content: string) => {
  await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
};

const requestNotificationPermission = async () => {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }
};

const showBrowserNotification = (title: string, content: string) => {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body: content });
    }
  }
};

const NewMangmenetSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchNewsHistory().then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleAddNews = () => {
    setAdding(true);
    setTitle("");
    setContent("");
  };

  const handleCancelAdd = () => {
    setAdding(false);
    setTitle("");
    setContent("");
  };

  const handleSaveAdd = async () => {
    if (!title || !content) return;
    setPosting(true);
    try {
      await postNews(title, content);
      toast.success("تمت إضافة الخبر بنجاح");
      showBrowserNotification(title, content);
      setAdding(false);
      setTitle("");
      setContent("");
      setLoading(true);
      fetchNewsHistory().then((data) => {
        setNews(data);
        setLoading(false);
      });
    } catch {
      toast.error("حدث خطأ أثناء إضافة الخبر");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="p-4 text-right">
      <div dir="rtl" className="flex  gap-4">
        <Button
          onClick={() => {
            setLoading(true);
            fetchNewsHistory().then((data) => {
              setNews(data);
              setLoading(false);
            });
          }}
          className="mb-4 flex gap-2"
          variant="outline"
        >
          تجديد الأخبار
          <RefreshCcw size={18} />
        </Button>
        <Button
          onClick={handleAddNews}
          className="mb-4 flex gap-2"
          variant="outline"
        >
          إضافة خبر جديد
          <Plus size={18} />
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-4 w-full">
        <div className="w-full">
          <div className="flex items-center justify-end gap-6 mb-4"></div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            {loading ? (
              <div className="py-10 text-center text-gray-500 text-lg">
                جاري التحميل...
              </div>
            ) : (
              <table dir="rtl" className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المحتوى
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adding && (
                    <tr className="bg-green-50 animate-fade-in">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input
                          name="title"
                          value={title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setTitle(e.target.value)
                          }
                          className="border border-green-400 focus:ring-2 focus:ring-green-300 rounded px-2 py-1 w-full outline-none transition"
                          placeholder="عنوان الخبر"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          name="content"
                          value={content}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setContent(e.target.value)
                          }
                          className="border border-green-400 focus:ring-2 focus:ring-green-300 rounded px-2 py-1 w-full outline-none transition"
                          placeholder="محتوى الخبر"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center">
                        —
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 justify-end w-1"
                        style={{ width: "1%", minWidth: "120px" }}
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          aria-label="حفظ الخبر الجديد"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={handleSaveAdd}
                          disabled={posting || !title || !content}
                        >
                          {posting ? (
                            <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                          ) : (
                            <Check size={16} />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="إلغاء"
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                          onClick={handleCancelAdd}
                          disabled={posting}
                        >
                          <X size={16} />
                        </Button>
                      </td>
                    </tr>
                  )}
                  {news && news.length > 0 ? (
                    news.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.content}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 text-center">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : !adding ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-400 text-lg"
                      >
                        لا توجد أخبار
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMangmenetSection;
