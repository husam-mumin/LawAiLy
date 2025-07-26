"use client";
import GuestLayout from "./components/GuestLayout";
import UserLayout from "./components/UserLayout";
import { useUser } from "@/app/context/UserContext";

type MainLayoutProps = { children: React.ReactNode };

export default function MainLayout({ children }: MainLayoutProps) {
  //check if the user login in
  const { user } = useUser();

  if (user && user.role === "guest") {
    return <GuestLayout>{children}</GuestLayout>;
  }

  return <UserLayout>{children}</UserLayout>;
}
