import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { NewsUserType } from "@/models/NewsUser";
import { useUser } from "./UserContext";

export function useNotification() {
  const [notifications, setNotifications] = useState<NewsUserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const userId = user?._id;
  const fetchNotifications = useCallback(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    axios
      .get(`/api/in/user/notification?userid=${userId}`)
      .then((res) => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.error || err.message || "حدث خطأ غير متوقع"
        );
        setLoading(false);
      });
  }, [userId]);

  const markAllAsRead = async () => {
    try {
      await axios.patch(`/api/in/user/notification/readAll?userid=${userId}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle specific axios error
        console.error("Axios error:", err.response?.data || err.message);
      }
      console.error("Error marking all as read:", err);
    }
  };

  const toggleRead = async (_id: string) => {
    try {
      const notif = notifications.find((n) => n._id === _id);
      if (!notif) return;
      await axios.patch(`/api/in/user/notification?id=${_id}`, {
        read: !notif.isRead,
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === _id ? { ...n, isRead: !n.isRead } : n))
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle specific axios error
        console.error("Axios error:", err.response?.data || err.message);
      }
      console.error("Error toggling read status:", err);
      // Optionally show error to user
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`/api/in/user/notification?id=${_id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== _id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle specific axios error
        console.error("Axios error:", err.response?.data || err.message);
        await fetchNotifications();
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    handleDelete,
    toggleRead,
    markAllAsRead,
    loading,
    error,
    refresh: fetchNotifications,
  };
}

interface NotificationContextType {
  notifications: NewsUserType[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  markAllAsRead: () => Promise<void>;
  toggleRead: (_id: string) => Promise<void>;
  handleDelete: (_id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    notifications,
    loading,
    error,
    refresh,
    handleDelete,
    markAllAsRead,
    toggleRead,
  } = useNotification();

  return (
    <NotificationContext.Provider
      value={{
        handleDelete,
        markAllAsRead,
        toggleRead,
        notifications,
        loading,
        error,
        refresh,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
}
