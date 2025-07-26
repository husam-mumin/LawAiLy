"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { userType } from "@/models/Users";

interface UserContextType {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  loading: boolean;
  openNot: boolean;
  setOpenNot: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNot, setOpenNot] = useState(false);

  async function fetchUser() {
    const guestId = localStorage.getItem("guest_id");
    if (guestId) {
      setUser({
        email: guestId + "@email.com",
        _id: guestId,
        role: "user",
        isBaned: false,
        firstName: "Guest",
        lastName: "User",
        gender: "other",
      });
      return;
    }
    try {
      const res = await axios.get("/api/auth/currentUser");
      setUser(res.data.user || null);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const localUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (localUser) {
      setUser(JSON.parse(localUser));
      setLoading(false);
    } else {
      fetchUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, openNot, setOpenNot, fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  if (context.loading) {
    return {
      user: null,
      loading: true,
      setUser: () => {},
      fetchUser: () => Promise.resolve(),
    };
  }
  return {
    user: context.user,
    setUser: context.setUser,
    fetchUser: context.fetchUser,
  };
}

export function useOpenNot() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useOpenNot must be used within a UserProvider");
  }
  return {
    openNot: context.openNot,
    setOpenNot: context.setOpenNot,
    fetchUser: context.fetchUser,
  };
}
