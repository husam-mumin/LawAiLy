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
];

const NotificationDialog = () => {
  const { setOpenNot, openNot } = React.useContext(DocumentContext);
  const [notifications, setNotifications] =
    React.useState<Notification[]>(initialNotifications);

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
              <ul className="space-y-3 max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
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
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
