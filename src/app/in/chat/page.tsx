"use client";
import ChatInput from "@/components/ChatInput";
import { Info } from "lucide-react";
import React, { useEffect, useState, useRef, useContext } from "react";
import gsap from "gsap";
import SuggestionsPop from "./_components/SuggestionsPop";
import useAddMessage from "./_hook/useAddMessage";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { layoutContext } from "@/components/layout/MainLayout/MainLayout";
import { chatType } from "@/models/Chat";
export default function Page() {
  const { user } = useUser();
  const [currentSuggestion, setCurrentSuggesion] = useState("");
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const suggestion: string[] = React.useMemo(
    () => [
      "اسأل عن القوانين المتعلقة بعملك أو مشروعك.",
      "اطلب شرحًا لمادة قانونية معينة.",
      "استفسر عن الإجراءات القانونية لتأسيس شركة.",
      "اسأل عن حقوقك وواجباتك في العمل.",
      "اطلب ملخصًا لقضية قانونية.",
      "استفسر عن شروط العقود القانونية.",
      "اسأل عن خطوات تقديم شكوى رسمية.",
      "اطلب مقارنة بين القوانين القديمة والجديدة.",
      "استفسر عن عقوبات المخالفات المرورية.",
      "اسأل عن كيفية توثيق المستندات الرسمية.",
      "اسأل عن أحكام الميراث في القانون الليبي.",
      "استفسر عن القوانين المدنية وأهم مواد القانون المدني.",
    ],
    []
  );

  // Animation refs
  const bannerRef = useRef(null);
  const avatarRef = useRef(null);
  const chatInputRef = useRef(null);
  const suggestionRef = useRef(null);
  const suggestionPopRef = useRef(null);
  const router = useRouter();
  const x = useContext(layoutContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentSuggesion(suggestion[0]);
    let index = 1;
    const sugguestToggle = setInterval(() => {
      setCurrentSuggesion(suggestion[index]);
      index = index + 1 < suggestion.length ? index + 1 : 0;
    }, 4000);

    return () => {
      clearInterval(sugguestToggle);
    };
  }, [suggestion]);

  // GSAP entrance animations
  useEffect(() => {
    // check the body loaded and then run the animations
    setLoading(false);

    gsap.fromTo(
      bannerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      avatarRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, delay: 0.5, ease: "back.out(1.7)" }
    );
    gsap.fromTo(
      chatInputRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out" }
    );
    // Animate SuggestionsPop entrance
    gsap.fromTo(
      suggestionPopRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 1.1, ease: "power3.out" }
    );
  }, []);

  // Animate suggestion text on change
  useEffect(() => {
    if (suggestionRef.current) {
      gsap.fromTo(
        suggestionRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [currentSuggestion]);

  const { loading: sending, error, addMessage } = useAddMessage();

  const handleSent = async (
    message: string,
    userId: string,
    files: string[]
  ): Promise<void> => {
    setErrorStatus(null);
    if (!message || message.trim().length === 0) {
      setErrorStatus("لا يمكن أن تكون الرسالة فارغة");
      return;
    }
    if (!userId) {
      setErrorStatus("معرّف المستخدم مطلوب لإرسال الرسالة");
      return;
    }
    if (message.length > 500) {
      setErrorStatus("لا يمكن أن تتجاوز الرسالة 500 حرف");
      return;
    }
    if (files && files.length > 5) {
      setErrorStatus("يمكنك إرفاق حتى 5 ملفات فقط");
      return;
    }
    // Validate file size
    // Call the addMessage function to send the message
    const filesObj: { id: string }[] = files
      ? files.map((file) => ({ id: file }))
      : [];

    const result = await addMessage({
      message: message,
      userId: userId,
      files: filesObj.length > 0 ? filesObj : undefined,
    });

    const { chatId } = result || {};
    if (error) {
      setErrorStatus("حدث خطأ أثناء إرسال الرسالة");
      return;
    }
    // redirect if success
    if (!chatId) {
      setErrorStatus("لم يتم إرجاع معرف المحادثة من الخادم");
      return;
    }
    if (x) {
      x.setChats((prevChats) => {
        const newchat: chatType = {
          _id: result?.chatId || "",
          isFavorite: false,
          messages: result?.newMessage ? [result.newMessage] : [],
          title: result?.message || "",
          user: user?._id || "",
          createdAt: new Date(),
        };
        const newChatLIst = [newchat, ...prevChats];
        return newChatLIst;
      });
      router.push(`/in/chat/${chatId}`);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white z-50">
        <svg
          className="animate-spin h-16 w-16 text-blue-500 mb-6 drop-shadow-lg"
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
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <div className="text-2xl font-bold text-blue-700 animate-pulse mb-2">
          جاري التحميل...
        </div>
        <div className="text-md text-blue-400 animate-fade-in">
          يرجى الانتظار قليلاً
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto text-center py-10">
        <h1 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h1>
        <p>لإرسال الرسائل، يجب عليك تسجيل الدخول أولاً.</p>
      </div>
    );
  }
  return (
    <div className="container relative mx-auto overflow-hidden ">
      <div className="flex flex-col gap-10 h-[calc(100dvh-5rem)] justify-center items-center relative ">
        <div
          ref={bannerRef}
          className="absolute top-5 right-1/2 translate-x-1/2 w-80 md:w-max min-w-fit z-20"
        >
          <div
            className={`max-w-max w-full text-right px-7 py-2 border-2 border-destructive rounded-full text-destructive flex gap-4 items-center bg-white/80 shadow-lg backdrop-blur-md`}
          >
            هذا المنتج قد التجربة لا تثق في النتائج
            <Info className="stroke-destructive size-10 md:size-5 " />
          </div>
        </div>
        <div
          ref={avatarRef}
          className="relative z-20 size-35 bg-gradient-to-br rounded-full mb-8 flex items-center justify-center"
        >
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2  max-w-md "
            ref={suggestionPopRef}
          >
            <SuggestionsPop messages={suggestion} />
          </div>
          {/* You can add an icon or avatar image here for more style */}
        </div>
        <div
          className="flex justify-center items-center w-full"
          ref={chatInputRef}
        >
          <div className="w-full max-w-xl">
            {errorStatus && (
              <div className="mb-4 text-center text-red-600 font-bold bg-red-50 border border-red-200 rounded-lg py-2 px-4">
                {errorStatus}
              </div>
            )}
            <ChatInput
              className="mx-2 md:mx-0"
              user={user}
              onSend={handleSent}
              loading={sending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
