"use client";
import {
  AIResponseType,
  messageResponse,
} from "@/app/api/chat/[chatid]/messages/route";
import remarkGfm from "remark-gfm";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RobotAvatar } from "@/app/in/_components/newChatPop";
import ReactMarkdown from "react-markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/app/context/UserContext";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { CopyCheck, CopyIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useResponseAction } from "../_hooks/useResponseAction";
import { chatType } from "@/models/Chat";
import { File as FileIcon } from "lucide-react";
import Image from "next/image";

type ChatMessagesProps = {
  Messages: messageResponse[];
  responseLoading: boolean;
  sendingError: string | null;
  chat?: chatType;
  setMessages: React.Dispatch<React.SetStateAction<messageResponse[]>>;
};

export default function ChatMessages({
  chat,
  Messages,
  responseLoading,
  sendingError,
  setMessages,
}: ChatMessagesProps) {
  const { user } = useUser();
  const [copyed, setCopyed] = useState(false);
  const { shareResponse, setGoodStatus } = useResponseAction({
    chatId: chat?._id || "",
    userId: user?._id || "",
  });
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

  function handleShare(responseId: string) {
    // add to share count in the database
    // This function can be used to share the message or perform any action
    shareResponse(responseId);
  }

  async function handleGoodStatus(
    response: AIResponseType,
    isGood: boolean | null
  ) {
    if (response.isGood === isGood) {
      await setGoodStatus(response._id, null);
      const messages = Messages.map((msg) => {
        if (msg.response && msg.response._id === response._id) {
          msg.response.isGood = null;
        }

        return msg;
      });
      setMessages([...messages]);
      return;
    }
    setGoodStatus(response._id, isGood)
      .then((res) => {
        if (res) {
          const messages = Messages.map((msg) => {
            if (msg.response && msg.response._id === response._id) {
              msg.response.isGood = res.isGood;
            }
            return msg;
          });
          setMessages([...messages]);
        } else {
          console.error("Failed to update response status");
        }
      })
      .catch((err) => {
        console.error("Error updating response status:", err);
      });
  }

  if (!Messages || Messages.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">لا توجد رسائل بعد.</div>
    );
  }

  return (
    <div className="space-y-6">
      <ScrollArea
        className="h-[calc(100dvh-12rem)] overflow-auto pr-2 "
        dir="rtl"
        ref={scrollRef}
      >
        <div className=" md:w-[36rem] mx-4 md:mx-auto">
          {Messages.map((msg, index) => {
            let formattedDate = "-";
            if (msg.createdAt) {
              const dateObj =
                typeof msg.createdAt === "string" ||
                typeof msg.createdAt === "number"
                  ? new Date(msg.createdAt)
                  : msg.createdAt;
              if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleString("ar");
              }
            }
            return (
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
                      <Avatar className="text-blue-500 bg-blue-100 flex justify-center items-center text-xs w-6 h-6">
                        <AvatarImage
                          src={msg.user.AvatarURL}
                          alt="user Image"
                        />
                        <AvatarFallback>
                          {msg.user.firstName
                            ? msg.user.firstName[0] +
                              (msg.user.lastName ? msg.user.lastName[0] : "")
                            : msg.user.email.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-blue-700">
                        {user?.firstName
                          ? user.firstName + " " + user.lastName
                          : user?.email}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 ml-2">
                      {formattedDate}
                    </span>
                  </div>

                  <div dir="rtl">
                    {/* Files */}
                    {Array.isArray(msg.files) && msg.files.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 justify-start items-center">
                        {msg.files.map((file, idx) => {
                          // Support both legacy and new file object shapes
                          type FileObj = {
                            fileformat?: string;
                            type?: string;
                            filename?: string;
                            name?: string;
                            id?: string;
                            fileURL?: string;
                            url?: string;
                            path?: string;
                          };
                          let type = "other";
                          let name = "ملف";
                          let url: string | undefined = undefined;
                          if (typeof file === "object" && file !== null) {
                            const f = file as FileObj;
                            type = f.fileformat ?? f.type ?? "other";
                            name = f.filename ?? f.name ?? f.id ?? "ملف";
                            url = f.fileURL ?? f.url ?? f.path ?? undefined;
                          } else {
                            name = String(file);
                          }
                          if (type.startsWith("image/") && url) {
                            // Show only the image preview, no name or type
                            return (
                              <div
                                key={name + idx}
                                className="flex flex-col items-center justify-center rounded-xl px-2 py-2  max-w-[10rem] min-w-[7rem]"
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group block"
                                >
                                  <Image
                                    width={128}
                                    height={128}
                                    src={url}
                                    alt={name}
                                    className="rounded-xl object-cover max-h-32 max-w-[8rem] transition-transform duration-200 group-hover:scale-105 group-hover:shadow-lg"
                                    style={{ background: "#f3f4f6" }}
                                  />
                                </a>
                              </div>
                            );
                          } else if (type === "application/pdf") {
                            // Show PDF box with icon centered
                            return (
                              <div
                                key={name + idx}
                                className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-4 shadow-sm max-w-[10rem] min-w-[7rem]"
                              >
                                <FileIcon
                                  size={36}
                                  className="text-red-500 mb-2"
                                  aria-hidden="true"
                                />
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline font-semibold truncate max-w-[8rem]"
                                    title={name}
                                  >
                                    {name}
                                  </a>
                                ) : (
                                  <span
                                    className="truncate block max-w-[8rem] text-xs text-gray-700 font-semibold"
                                    title={name}
                                  >
                                    {name}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400 mt-1">
                                  PDF
                                </span>
                              </div>
                            );
                          } else {
                            // Other file types
                            return (
                              <div
                                key={name + idx}
                                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 shadow-sm max-w-[14rem] min-w-[7rem]"
                              >
                                <FileIcon
                                  size={20}
                                  className="text-gray-400"
                                  aria-hidden="true"
                                />
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline font-semibold truncate max-w-[8rem]"
                                    title={name}
                                  >
                                    {name}
                                  </a>
                                ) : (
                                  <span
                                    className="truncate block max-w-[8rem] text-xs text-gray-700 font-semibold"
                                    title={name}
                                  >
                                    {name}
                                  </span>
                                )}
                                <span className="text-xs text-gray-400 ml-2">
                                  ملف
                                </span>
                              </div>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                  {/* Message Content */}
                  <div className="mb-2 text-gray-800 font-cairo whitespace-pre-line break-words text-base">
                    {msg.message}
                  </div>

                  {/* AI Response or Sending Error */}
                  {sendingError && (
                    <div className="flex flex-col mt-3 p-3 font-cairo bg-red-50 rounded-lg border border-red-200 gap-3 items-center">
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
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border max-w-full border-blue-100 flex gap-3 items-start">
                      <Avatar className="shadow-lg border-2 size-[34px] border-blue-400 bg-white">
                        <RobotAvatar size={34} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium font-cairo text-blue-700 mb-1">
                          رد مستشاري:{" "}
                        </div>
                        <div className="prose font-cairo text-[18px] text-gray-800  max-w-full whitespace-pre-line break-words text-base">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.response.response}
                          </ReactMarkdown>
                        </div>
                        <div className="text-xs mt-2">
                          التقييم:
                          {msg.response.isGood !== null ? (
                            <>
                              {msg.response.isGood ? (
                                <span className="text-green-600 font-bold ms-1">
                                  جيد
                                </span>
                              ) : (
                                <span className="text-red-600 font-bold ms-1">
                                  غير جيد
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="font-bold ms-1">غير مقيم</span>
                          )}
                        </div>
                        <div className="mt-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={() => {
                                  handleShare(msg._id);
                                  navigator.clipboard.writeText(
                                    msg.response.response
                                  );
                                  setCopyed(true);
                                  setTimeout(() => {
                                    setCopyed(false);
                                  }, 2000);
                                }}
                              >
                                {!copyed ? <CopyIcon /> : <CopyCheck />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {copyed ? "تم النسخ بنجاح!" : "نسخ الرد"}
                            </TooltipContent>
                          </Tooltip>
                          {/* share to whatsapp */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"ghost"}
                                size={"sm"}
                                className="ml-2"
                                onClick={() => {
                                  handleShare(msg._id);
                                  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                                    msg.response.response
                                  )}`;
                                  window.open(whatsappUrl, "_blank");
                                }}
                              >
                                <svg
                                  width="29px"
                                  height="29px"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  color="#000000"
                                >
                                  <path
                                    d="M22 12C22 17.5228 17.5228 22 12 22C10.1786 22 8.47087 21.513 7 20.6622L2 21.5L2.83209 16C2.29689 14.7751 2 13.4222 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M12.9604 13.8683L15.0399 13.4624L17 14.2149V16.0385C17 16.6449 16.4783 17.1073 15.8901 16.9783C14.3671 16.6444 11.5997 15.8043 9.67826 13.8683C7.84859 12.0248 7.22267 9.45734 7.01039 8.04128C6.92535 7.47406 7.3737 7 7.94306 7H9.83707L10.572 8.96888L10.1832 11.0701"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>مشاركة على واتساب</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"ghost"}
                                size={"sm"}
                                className="ml-2"
                                onClick={() => {
                                  handleGoodStatus(msg.response, true);
                                }}
                              >
                                {
                                  <svg
                                    width="29px"
                                    height="29px"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                    fill={
                                      msg.response.isGood ? "#000000" : "none"
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    color="#fff"
                                  >
                                    <path
                                      d="M16.4724 20H4.1C3.76863 20 3.5 19.7314 3.5 19.4V9.6C3.5 9.26863 3.76863 9 4.1 9H6.86762C7.57015 9 8.22116 8.6314 8.5826 8.02899L11.293 3.51161C11.8779 2.53688 13.2554 2.44422 13.9655 3.33186C14.3002 3.75025 14.4081 4.30635 14.2541 4.81956L13.2317 8.22759C13.1162 8.61256 13.4045 9 13.8064 9H18.3815C19.7002 9 20.658 10.254 20.311 11.5262L18.4019 18.5262C18.1646 19.3964 17.3743 20 16.4724 20Z"
                                      stroke="#000000"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    ></path>
                                    <path
                                      d="M7 20L7 9"
                                      stroke="#000000"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></path>
                                  </svg>
                                }
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>رد جيد</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={"ghost"}
                                size={"sm"}
                                className="ml-2"
                                onClick={() => {
                                  handleGoodStatus(msg.response, false);
                                }}
                              >
                                <svg
                                  width="29px"
                                  height="29px"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                  fill={
                                    msg.response.isGood === false
                                      ? "#000000"
                                      : "none"
                                  }
                                  xmlns="http://www.w3.org/2000/svg"
                                  color="#000000"
                                >
                                  <path
                                    d="M16.4724 3.5H4.1C3.76863 3.5 3.5 3.76863 3.5 4.1V13.9C3.5 14.2314 3.76863 14.5 4.1 14.5H6.86762C7.57015 14.5 8.22116 14.8686 8.5826 15.471L11.293 19.9884C11.8779 20.9631 13.2554 21.0558 13.9655 20.1681C14.3002 19.7497 14.4081 19.1937 14.2541 18.6804L13.2317 15.2724C13.1162 14.8874 13.4045 14.5 13.8064 14.5H18.3815C19.7002 14.5 20.658 13.246 20.311 11.9738L18.4019 4.97376C18.1646 4.10364 17.3743 3.5 16.4724 3.5Z"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  ></path>
                                  <path
                                    d="M7 14.5L7 3.5"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>رد غير جيد</TooltipContent>
                          </Tooltip>
                        </div>
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
                        <span>جاري تقديم الاستشارة...</span>
                      </div>
                    )}
                </motion.div>
              </AnimatePresence>
            );
          })}
          <div className="h-20 w-full" />
        </div>
      </ScrollArea>
    </div>
  );
}
