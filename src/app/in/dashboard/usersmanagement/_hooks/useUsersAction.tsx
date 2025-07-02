"use client";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { userType } from "@/models/Users";

export function useUsersAction() {
  const [users, setUsers] = useState<userType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);
  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/in/users");
      setUsers(res.data || []);
    } catch {
      setError("فشل في جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  }, []);

  // Edit user
  const edit = async (user: userType) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/api/in/users`, user);
      if (res.data && res.data.user) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? res.data.user : u))
        );
        return true;
      }
      setError("فشل في تعديل المستخدم");
      return false;
    } catch {
      setError("فشل في تعديل المستخدم");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove user
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`/api/in/users`, { data: { id } });
      if (res.data && res.data.user) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        return true;
      }
      setError("فشل في حذف المستخدم");
      return false;
    } catch {
      setError("فشل في حذف المستخدم");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    edit,
    remove,
    setUsers,
  };
}
