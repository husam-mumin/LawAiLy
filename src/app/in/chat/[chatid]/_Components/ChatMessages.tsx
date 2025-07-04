import { messageResponse } from "@/app/api/chat/[chatid]/messages/route";
import React, { useEffect, useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RobotAvatar } from "@/app/in/_components/newChatPop";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/app/context/UserContext";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

type ChatMessagesProps = {
  Messages: messageResponse[];
  responseLoading: boolean;
  sendingError: string | null;
};

export default function ChatMessages({
  Messages,
  responseLoading,
  sendingError,
}: ChatMessagesProps) {
  const { user } = useUser();
  const scrollRef = useRef<HTMLDivElement>(null);
  // Scroll instantly on mount or enter
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      // GSAP fade-in for all messages on mount
      gsap.fromTo(
        scrollRef.current.querySelectorAll(".chat-msg-anim"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }
  }, []);
  // Smooth scroll when new message is sent
  useEffect(() => {
    console.log("scroll ref", scrollRef.current);

    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [Messages.length]);
  // Animate new message with GSAP
  useEffect(() => {
    if (scrollRef.current && Messages.length > 0) {
      const lastMsg = scrollRef.current.querySelectorAll(".chat-msg-anim");
      const el = lastMsg[lastMsg.length - 1];
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
        );
      }
    }
  }, [Messages.length]);

  if (!Messages || Messages.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">لا توجد رسائل بعد.</div>
    );
  }

  return (
    <div className="space-y-6">
      <ScrollArea
        className="h-[calc(100dvh-12rem)] overflow-auto pr-2 w-full"
        dir="rtl"
        ref={scrollRef}
      >
        <div className=" md:w-[36rem] mx-4 md:mx-auto">
          {Messages.map((msg, index) => (
            <AnimatePresence key={msg._id}>
              <motion.div
                className={`chat-msg-anim p-4 mb-8 rounded-lg shadow-sm bg-white border flex flex-col gap-2 relative ${
                  msg.response ? "border-blue-200" : "border-gray-200"
                }`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {/* User Info */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    <Avatar className="text-blue-500 w-6 h-6">
                      <AvatarImage src={user?.AvatarURL} alt="user Image" />
                      <AvatarFallback>
                        {user?.firstName
                          ? user.firstName + " " + user.lastName
                          : user?.email.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-blue-700">
                      {user?.firstName
                        ? user.firstName + " " + user.lastName
                        : user?.email}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    {msg.createAt
                      ? new Date(msg.createAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                {/* Message Content */}
                <div className="mb-2 text-gray-800 whitespace-pre-line break-words text-base">
                  {msg.message}
                </div>

                {/* Files */}
                {msg.files && msg.files.fileURL && (
                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href={msg.files.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline font-medium"
                    >
                      <span className="inline-block align-middle mr-1">📎</span>
                      {msg.files.filename || "تحميل الملف"}
                    </a>
                    <div className="text-xs text-gray-400">
                      {msg.files.filesize} | {msg.files.fileformat}
                    </div>
                  </div>
                )}

                {/* AI Response or Sending Error */}
                {sendingError && (
                  <div className="flex flex-col mt-3 p-3 bg-red-50 rounded-lg border border-red-200 flex gap-3 items-center">
                    <span className="text-red-600 font-bold">
                      حدث خطأ أثناء إرسال الرسالة: {sendingError}
                    </span>
                    <Button
                      className="ml-4 px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition"
                      onClick={() => window.location.reload()}
                    >
                      إعادة المحاولة
                      <RefreshCcw />
                    </Button>
                  </div>
                )}
                {!sendingError && msg.response && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3 items-start">
                    <Avatar className="shadow-lg border-2 size-[34px] border-blue-400 bg-white">
                      <RobotAvatar size={34} />
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-blue-700 mb-1">
                        رد الذكاء الاصطناعي:
                      </div>
                      <div className="text-gray-800 whitespace-pre-line break-words text-base">
                        <ReactMarkdown>{msg.response.response}</ReactMarkdown>
                      </div>
                      {msg.response.isGood !== null && (
                        <div className="text-xs mt-2">
                          التقييم:{" "}
                          {msg.response.isGood ? (
                            <span className="text-green-600 font-bold">
                              جيد
                            </span>
                          ) : (
                            <span className="text-red-600 font-bold">
                              غير جيد
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Loading AI Response */}
                {index === Messages.length - 1 &&
                  responseLoading &&
                  !msg.response && (
                    <div className="flex items-center gap-2 mt-2 text-blue-500 animate-pulse">
                      <Avatar className="shadow-lg border-2 size-[34px] border-blue-400 bg-white">
                        <RobotAvatar size={34} />
                      </Avatar>
                      <span>جاري توليد الرد...</span>
                    </div>
                  )}
              </motion.div>
            </AnimatePresence>
          ))}
          <div className="h-20 w-full" />
        </div>
      </ScrollArea>
    </div>
  );
}
