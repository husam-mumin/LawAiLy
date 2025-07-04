"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DocumentContext } from "./DocumentProvider";
import { Circle } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date?: string;
  read?: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "مرحبًا!",
    message: "شكرًا لانضمامك إلى منصتنا.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "2",
    title: "تمت الموافقة على المستند",
    message: "تمت الموافقة على مستندك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "3",
    title: "تم رفض المستند",
    message: "يرجى مراجعة المستند المرفوض.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "4",
    title: "تم تحديث الملف الشخصي",
    message: "تم تحديث بياناتك الشخصية بنجاح.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "5",
    title: "رسالة جديدة من الدعم",
    message: "لديك رسالة جديدة من فريق الدعم.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "6",
    title: "تمت إضافة مستند جديد",
    message: "تمت إضافة مستند جديد إلى حسابك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "7",
    title: "تمت مشاركة مستند معك",
    message: "قام أحد المستخدمين بمشاركة مستند معك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "8",
    title: "تم تغيير كلمة المرور",
    message: "تم تغيير كلمة المرور الخاصة بك بنجاح.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "9",
    title: "تنبيه أمني",
    message: "تم تسجيل دخول جديد إلى حسابك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "10",
    title: "تم حذف مستند",
    message: "تم حذف أحد مستنداتك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "11",
    title: "تم تحديث سياسة الخصوصية",
    message: "يرجى مراجعة سياسة الخصوصية الجديدة.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "12",
    title: "تمت إضافة مستخدم جديد",
    message: "تمت إضافة مستخدم جديد إلى فريقك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "13",
    title: "تم تعليق حسابك مؤقتًا",
    message: "يرجى التواصل مع الدعم لمزيد من التفاصيل.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "14",
    title: "تمت جدولة اجتماع جديد",
    message: "لديك اجتماع مجدول غدًا في الساعة 10 صباحًا.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "15",
    title: "تمت إضافة مهمة جديدة",
    message: "تمت إضافة مهمة جديدة إلى قائمة مهامك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "16",
    title: "تم تحديث مستند مشترك",
    message: "تم تحديث مستند مشترك من قبل أحد الأعضاء.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "17",
    title: "تمت الموافقة على طلبك",
    message: "تمت الموافقة على طلبك الأخير.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "18",
    title: "تم رفض طلبك",
    message: "تم رفض طلبك الأخير. يرجى المحاولة مرة أخرى.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "19",
    title: "تمت إضافة تعليق جديد",
    message: "تمت إضافة تعليق جديد على مستندك.",
    date: new Date().toLocaleString(),
    read: false,
  },
  {
    id: "20",
    title: "تمت إزالة مستخدم من الفريق",
    message: "تمت إزالة أحد الأعضاء من فريقك.",
    date: new Date().toLocaleString(),
    read: false,
  },
];

const NotificationDialog = () => {
  const { setOpenNot, openNot } = React.useContext(DocumentContext);
  const [notifications, setNotifications] =
    React.useState<Notification[]>(initialNotifications);
  const [page, setPage] = React.useState(1);
  const pageSize = 4;
  const totalPages = Math.ceil(notifications.length / pageSize);
  const paginatedNotifications = notifications.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <Dialog open={openNot} onOpenChange={setOpenNot}>
      <DialogContent
        className="max-w-md rounded-2xl p-0 bg-white shadow-xl"
        dir="rtl"
      >
        <div className="flex flex-col px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            الإشعارات
          </DialogTitle>
          <div className="flex items-center gap-2">
            <button
              className="text-xs text-blue-600 hover:underline px-2 py-1 rounded transition-colors disabled:text-gray-300"
              onClick={markAllAsRead}
              disabled={notifications.every((n) => n.read)}
            >
              تعليم الكل كمقروء
            </button>
          </div>
        </div>
        <DialogDescription asChild>
          <div className="px-6 pb-6">
            {notifications.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                لا توجد إشعارات.
              </div>
            ) : (
              <>
                <ul className="space-y-3 max-h-80 ">
                  {paginatedNotifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-1 cursor-pointer group border border-transparent hover:border-blue-200 transition-all relative ${
                        notif.read ? "opacity-60" : "bg-blue-50"
                      }`}
                      onClick={() => toggleRead(notif.id)}
                      title={notif.read ? "تعليم كغير مقروء" : "تعليم كمقروء"}
                    >
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <Circle
                            className="w-3 h-3 text-blue-500"
                            fill="#3b82f6"
                          />
                        )}
                        <span
                          className={`font-medium ${
                            notif.read ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          {notif.title}
                        </span>
                        <span className="flex-1" />
                        {/* Delete button on the left */}
                        <button
                          className="p-1 rounded hover:bg-red-50 transition-colors"
                          title="حذف الإشعار"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications((prev) =>
                              prev.filter((n) => n.id !== notif.id)
                            );
                          }}
                          style={{ marginLeft: "0", marginRight: "auto" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
                            />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm text-gray-600">
                        {notif.message}
                      </span>
                      {notif.date && (
                        <span className="text-xs text-gray-400 mt-1">
                          {notif.date}
                        </span>
                      )}
                      <span className="absolute top-2 right-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {notif.read ? "مقروء" : "غير مقروء"}
                      </span>
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      className="px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      السابق
                    </button>
                    <span className="text-xs text-gray-500">
                      صفحة {page} من {totalPages}
                    </span>
                    <button
                      className="px-2 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
