"use client";
import { useUser } from "@/app/context/UserContext";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FileText, Mail, MessageSquare, MessagesSquare } from "lucide-react";

interface UserType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  AvatarURL?: string;
  role?: string;
}

interface AnalysisData {
  documentCount: number;
  chatCount: number;
  messageCount: number;
}

export default function Page() {
  const { user } = useUser() as { user: UserType };
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id && (user.role === "admin" || user.role === "owner")) {
      setLoading(true);
      fetch(`/api/in/analysis?userId=${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setAnalysis(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="min-h-[calc(100dvh-5rem)] w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white/80 backdrop-blur-md shadow-none border border-gray-200 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full border-4 border-blue-100 bg-gray-100 flex items-center justify-center text-5xl mb-1 overflow-hidden">
          {user?.AvatarURL ? (
            <Image
              src={user.AvatarURL}
              alt="avatar"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              priority={false}
            />
          ) : (
            <span role="img" aria-label="avatar">
              👤
            </span>
          )}
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-0.5">
            {user?.firstName} {user?.lastName}
          </h1>
          <h3 className="text-gray-500 text-base flex items-center gap-1 mb-0.5">
            <Mail className="inline-block text-blue-400 w-4 h-4" />
            {user?.email}
          </h3>
          {user?.role && (
            <span className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-0.5 rounded-full">
              {user.role === "admin"
                ? "مشرف"
                : user.role === "user"
                ? "مستخدم"
                : user.role === "owner"
                ? "مالك"
                : user.role}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 tracking-wider mt-1 mb-1">
          ID: {user?._id}
        </span>
        {/* Analysis section for admin/owner only */}
        {(user?.role === "admin" || user?.role === "owner") && (
          <div className="w-full mt-1">
            <h2 className="text-base font-semibold mb-2 text-gray-800 text-center">
              تحليل استخدام التطبيق
            </h2>
            {loading ? (
              <div className="text-center text-gray-400 py-2">
                جاري التحميل...
              </div>
            ) : analysis ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center bg-blue-50 rounded-xl py-2 gap-0.5">
                  <FileText className="text-blue-400 w-5 h-5 mb-0.5" />
                  <span className="text-xs text-gray-500">الوثائق</span>
                  <span className="font-bold text-lg text-gray-800">
                    {analysis.documentCount}
                  </span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 rounded-xl py-2 gap-0.5">
                  <MessagesSquare className="text-blue-400 w-5 h-5 mb-0.5" />
                  <span className="text-xs text-gray-500">المحادثات</span>
                  <span className="font-bold text-lg text-gray-800">
                    {analysis.chatCount}
                  </span>
                </div>
                <div className="flex flex-col items-center bg-blue-50 rounded-xl py-2 gap-0.5">
                  <MessageSquare className="text-blue-400 w-5 h-5 mb-0.5" />
                  <span className="text-xs text-gray-500">الرسائل</span>
                  <span className="font-bold text-lg text-gray-800">
                    {analysis.messageCount}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-2">
                لا توجد بيانات تحليلية متاحة.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
