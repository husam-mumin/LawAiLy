"use client";
import React from "react";
import { Card } from "@/components/ui/card";

export default function BanUserPage() {
  return (
    <div className="w-full  mx-auto  flex flex-col items-center justify-center min-h-[60vh] h-dvh">
      <Card className="p-8 flex flex-col items-center gap-4 bg-red-50 border-red-200 w-[21rem]">
        <span className="text-5xl text-red-400">🚫</span>
        <h1 className="text-2xl text-center w-full font-bold text-red-700 mb-2 mx-0 px-0">
          تم حظرك من استخدام التطبيق
        </h1>
        <p className="text-gray-700 text-center">
          لقد تم حظرك من استخدام هذا التطبيق. إذا كنت تعتقد أن هذا خطأ، يرجى
          التواصل مع الإدارة أو الدعم الفني.
        </p>
      </Card>
    </div>
  );
}
