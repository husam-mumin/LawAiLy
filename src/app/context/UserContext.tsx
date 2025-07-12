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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<userType | null>(null);
  const [loading, setLoading] = useState(true);
  const [openNot, setOpenNot] = useState(false);

  useEffect(() => {
    const localUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (localUser) {
      setUser(JSON.parse(localUser));
      setLoading(false);
    } else {
      async function fetchUser() {
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
      value={{ user, setUser, loading, openNot, setOpenNot }}
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
    return { user: null, loading: true, setUser: () => {} };
  }
  return { user: context.user, setUser: context.setUser };
}

export function useOpenNot() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useOpenNot must be used within a UserProvider");
  }
  return { openNot: context.openNot, setOpenNot: context.setOpenNot };
}
