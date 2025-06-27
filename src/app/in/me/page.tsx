"use client";
import { useUser } from "@/app/context/UserContext";
import React from "react";

export default function Page() {
  const { user } = useUser();
  return (
    <div className="h-[calc(100dvh-5rem)] w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Coming Soon! ^_^</h1>
      <h3 className="text-lg">{user?.email}</h3>
    </div>
  );
}
