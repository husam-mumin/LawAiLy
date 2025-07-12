"use client";
import ChatInput from "@/components/ChatInput";
import { Info } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import SuggestionsPop from "./_components/SuggestionsPop";
import useAddMessage from "./_hook/useAddMessage";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
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

  const handleSent = async (
    chatMessage: string,
    userId: string,
    Flies: string[] | null | undefined
  ) => {
    setErrorStatus(null);
    if (!chatMessage || chatMessage.trim().length === 0) {
      setErrorStatus("لا يمكن أن تكون الرسالة فارغة");
      return;
    }
    if (!userId) {
      setErrorStatus("معرّف المستخدم مطلوب لإرسال الرسالة");
      return;
    }
    if (chatMessage.length > 500) {
      setErrorStatus("لا يمكن أن تتجاوز الرسالة 500 حرف");
      return;
    }
    if (Flies && Flies.length > 5) {
      setErrorStatus("يمكنك إرفاق حتى 5 ملفات فقط");
      return;
    }
    // Validate file size
    // Call the addMessage function to send the message
    if (!Flies) {
      Flies = [];
    }
    const files: { id: string }[] = Flies.map((file) => ({ id: file }));

    const result = await addMessage({
      message: chatMessage,
      userId: userId, // Replace with actual user ID
      files: files as { id: string }[] | undefined,
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
    router.push(`/in/chat/${chatId}`);
  };

  const { loading: sending, error, addMessage } = useAddMessage();
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
            className={`max-w-max w-full px-7 py-2 border-2 border-destructive rounded-full text-destructive flex gap-4 items-center bg-white/80 shadow-lg backdrop-blur-md`}
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
