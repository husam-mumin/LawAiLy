"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Circle, RefreshCcw } from "lucide-react";
import { useNotificationContext } from "@/app/context/NotficationContext";
import { useOpenNot } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";

const NotificationDialog = () => {
  const { setOpenNot, openNot } = useOpenNot();
  const {
    refresh,
    handleDelete,
    markAllAsRead,
    toggleRead,
    loading,
    notifications,
    error,
  } = useNotificationContext();

  const [page, setPage] = React.useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const pageSize = 3;
  const totalPages = Math.ceil(notifications.length / pageSize);
  const paginatedNotifications = notifications.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // You may want to call your notification fetch logic here
      if (refresh) {
        await refresh();
      }
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Dialog open={openNot} onOpenChange={setOpenNot}>
      <DialogContent
        className="max-w-md rounded-2xl h-max p-0 bg-white shadow-xl"
        dir="rtl"
      >
        <div className="flex flex-col px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            الإشعارات
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-xs cursor-pointer hover:bg-transparent hover:text-blue-600 text-blue-600 hover:underline px-2 py-1 rounded transition-colors disabled:text-gray-300"
              onClick={markAllAsRead}
              disabled={notifications.every((n) => n.isRead)}
            >
              تعليم الكل كمقروء
            </Button>
            <Button
              variant="ghost"
              className="text-xs cursor-pointer hover:bg-transparent hover:text-blue-600 text-blue-600 hover:underline px-2 py-1 rounded transition-colors disabled:text-gray-300 flex items-center gap-1"
              onClick={handleRefresh}
              disabled={refreshing}
              title="تحديث الإشعارات"
            >
              {refreshing ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full">
                  <RefreshCcw className="w-4 h-4" />
                </span>
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
              تحديث
            </Button>
          </div>
        </div>
        <DialogDescription asChild>
          <div className="px-6 pb-6">
            {loading ? (
              <div className="text-gray-400 text-center py-8">
                جاري التحميل...
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                لا توجد إشعارات.
              </div>
            ) : (
              <>
                <ul className="space-y-3 max-h-80 mb-5">
                  {paginatedNotifications.map((notif) => (
                    <li
                      key={notif._id}
                      className={`rounded-xl p-4 shadow-sm flex flex-col gap-1 cursor-pointer group border transition-all relative ${
                        notif.isRead
                          ? "bg-gray-50 opacity-60"
                          : "bg-blue-50 border-blue-200"
                      }`}
                      onClick={() => toggleRead(notif._id)}
                      title={notif.isRead ? "تعليم كغير مقروء" : "تعليم كمقروء"}
                    >
                      <div className="flex items-center gap-2">
                        {!notif.isRead && (
                          <Circle
                            className="w-3 h-3 text-blue-500"
                            fill="#3b82f6"
                          />
                        )}
                        <span
                          className={`font-medium ${
                            notif.isRead ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          {notif.new.title}
                        </span>
                        <span className="flex-1" />
                        {/* Delete button on the left (RTL) */}
                        <Button
                          variant={"ghost"}
                          className="p-1 cursor-pointer rounded-full hover:bg-red-100 transition-colors ms-auto"
                          title="حذف الإشعار"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const isDeleted = await handleDelete(notif._id);
                            if (isDeleted) {
                              // Optionally show a success message
                              const theLeftInThePage =
                                notifications.length % pageSize;
                              if (theLeftInThePage === 1 && page > 1) {
                                setPage((p) => p - 1);
                              }
                            }
                          }}
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
                        </Button>
                      </div>
                      <span className="text-sm text-gray-600">
                        {notif.new.content}
                      </span>
                      {notif.createdAt && (
                        <span className="text-xs text-gray-400 mt-1">
                          {notif.createdAt}
                        </span>
                      )}
                      <span className="absolute top-2 start-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {notif.isRead ? "مقروء" : "غير مقروء"}
                      </span>
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <div className="flex  justify-center items-center gap-2 mt-20">
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
