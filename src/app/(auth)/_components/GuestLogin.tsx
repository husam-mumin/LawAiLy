"use client";

import { useUser } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";

export default function GuestLogin() {
  const { setUser } = useUser();
  const handleGuestLogin = async () => {
    try {
      const res = await fetch("/api/auth/GustLogin", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Guest login failed");
      const data = await res.json();
      // Store guest_id in localStorage for client-side use (optional)
      if (data.guestId) {
        localStorage.setItem("guest_id", data.guestId);
      }
      // Redirect to /in
      setUser({
        _id: data.guestId,
        role: "guest",
        firstName: "مستخدم",
        lastName: "تجريبي",
        email: data.guestId + "@email.com", // Assuming guest ID is used as email
        gender: "other",
        AvatarURL: "",
        isBaned: false,
      });
      window.location.href = "/in";
    } catch {
      alert("Guest login failed. Please try again.");
    }
  };

  return (
    <div>
      <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
        <span className="text-sm">الدخول كضيف</span>
      </Button>
      <p className="mt-2 text-xs text-gray-500 text-center">
        يمكنك استخدام هذا الخيار لتجربة المنصة دون إنشاء حساب.
      </p>
    </div>
  );
}
