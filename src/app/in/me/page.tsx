"use client";
import { useUser } from "@/app/context/UserContext";
import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  Mail,
  MessageSquare,
  MessagesSquare,
  Pen,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  useGsapProfileAnimation,
  profileCardVariants,
} from "./useProfileAnimation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useMeAction } from "./useMeAction";
import { userType } from "@/models/Users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AnalysisData {
  documentCount: number;
  chatCount: number;
  messageCount: number;
}

export default function Page() {
  const { user } = useUser() as { user: userType };
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // Add edit mode state
  const [tempFirstName, setTempFirstName] = useState("");
  const [tempLastName, setTempLastName] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    firstName,
    lastName,
    photoUrl,
    updateName,
    updatePhoto,
    loading: NameUpdatedLoading,
    photoLoading,
    error,
  } = useMeAction(user);

  useGsapProfileAnimation(cardRef as React.RefObject<HTMLDivElement>);

  useEffect(() => {
    if (user?._id) {
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

  useEffect(() => {
    if (editMode) {
      setTempFirstName(firstName || "");
      setTempLastName(lastName || "");
    }
  }, [editMode, firstName, lastName]);

  return (
    <div
      dir="rtl"
      className="min-h-[calc(100dvh-5rem)] w-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white"
    >
      <motion.div
        ref={cardRef}
        className="bg-white/80 backdrop-blur-md shadow-none border border-gray-200 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center gap-4"
        variants={profileCardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-24 h-24 rounded-full border-4 border-blue-100 bg-gray-100 flex items-center justify-center text-5xl mb-1 overflow-hidden relative group">
          <Avatar className="w-full h-full ">
            <AvatarImage
              src={photoUrl}
              alt="avatar"
              className="w-full h-full object-cover"
              width={96}
              height={96}
            />
            <AvatarFallback className="w-full h-full flex items-center justify-center">
              {firstName ? firstName?.charAt(0).toUpperCase() : "?"}
              {lastName ? lastName?.charAt(0).toUpperCase() : ""}
            </AvatarFallback>
          </Avatar>
          {/* Loading spinner while photo is being updated */}
          {photoLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-full">
              <svg
                className="animate-spin h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            </div>
          )}
          {/* Hover panel with file input */}

          <label className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                updatePhoto(e.target.files?.[0] as File);
              }}
            />
            <span className="text-white text-base font-bold flex items-center gap-1">
              <Pen />
            </span>
          </label>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center justify-center w-full relative">
            {editMode ? (
              <form
                className="flex flex-col gap-2 w-full"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await updateName({
                    firstName: tempFirstName,
                    lastName: tempLastName,
                  });
                  setEditMode(false);
                }}
              >
                <div className="flex justify-center items-center gap-2 w-full">
                  <Input
                    className="border rounded px-2 py-1 text-base w-24"
                    value={tempFirstName}
                    onChange={(e) => setTempFirstName(e.target.value)}
                    placeholder="الاسم الأول"
                    disabled={NameUpdatedLoading}
                    required
                  />
                  <Input
                    className="border rounded px-2 py-1 text-base w-24"
                    value={tempLastName}
                    onChange={(e) => setTempLastName(e.target.value)}
                    placeholder="اسم العائلة"
                    disabled={NameUpdatedLoading}
                    required
                  />
                </div>
                <div className="flex justify-center items-center w-full gap-2 mt-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="ml-2"
                    disabled={NameUpdatedLoading}
                  >
                    حفظ
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditMode(false)}
                    disabled={NameUpdatedLoading}
                  >
                    إلغاء
                  </Button>
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center mt-2">
                    {typeof error === "string"
                      ? error
                      : "حدث خطأ أثناء تحديث الاسم."}
                  </div>
                )}
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-0.5">
                  {firstName ? firstName : ""} {lastName ? lastName : ""}
                </h1>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-blue-500 absolute right-0 top-0 hover:bg-blue-50"
                  onClick={() => setEditMode(true)}
                >
                  <Pen className="inline-block w-4 h-4 mr-1" />
                </Button>
              </>
            )}
          </div>
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
        {/* Analysis section for admin/owner only */}
        <div className="w-full mt-2  ">
          <h2 className="text-base font-semibold mb-2 text-gray-800 text-center">
            تحليل استخدام التطبيق
          </h2>
          {loading ? (
            <div className="text-center text-gray-400 py-2">
              جاري التحميل...
            </div>
          ) : analysis ? (
            <div
              className={`grid ${
                user.role === "user" ? "grid-cols-2" : "grid-cols-3"
              } gap-2  text-center mt-4`}
            >
              {(user.role === "owner" || user.role === "admin") && (
                <div className="flex flex-col items-center bg-blue-50 rounded-xl py-2 gap-0.5">
                  <FileText className="text-blue-400 w-5 h-5 mb-0.5" />
                  <span className="text-xs text-gray-500">الوثائق</span>
                  <span className="font-bold text-lg text-gray-800">
                    {analysis.documentCount}
                  </span>
                </div>
              )}
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
      </motion.div>
    </div>
  );
}
