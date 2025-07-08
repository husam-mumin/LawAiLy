// components/TokenRefresher.tsx
"use client";
import { useEffect } from "react";
import { silentRefresh } from "@/utils/refresh";
import { useRouter } from "next/navigation";

export default function TokenRefresher() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      const ok = await silentRefresh();
      if (!ok) {
        console.warn("Token refresh failed — logging out");
        router.push("/login");
      }
    }, 12 * 60 * 1000); // Every 12 minutes

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
