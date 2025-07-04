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
    Flies: File[] | null | undefined
  ) => {
    console.log("Sending message:", chatMessage);
    if (!chatMessage || chatMessage.trim().length === 0) {
      console.error("Message cannot be empty");
      return;
    }
    if (!userId) {
      console.error("User ID is required to send a message");
      return;
    }
    if (chatMessage.length > 500) {
      console.error("Message cannot exceed 500 characters");
      return;
    }
    if (Flies && Flies.length > 5) {
      console.error("You can only attach up to 5 files");
      return;
    }
    if (Flies && Flies.some((file) => file.size > 5 * 1024 * 1024)) {
      console.error("Each file must be less than 5MB");
      return;
    }
    // Call the addMessage function to send the message
    console.log("Preparing to send message with files:", Flies);
    if (!Flies) {
      console.log("No files to send, proceeding with message only.");
      Flies = [];
    }
    const result = await addMessage({
      message: chatMessage,
      userId: userId, // Replace with actual username
      files: Flies.length > 0 ? Flies : undefined,
    });
    const { chatId } = result || {};
    if (error) {
      // Handle error display
      console.error("Error sending message:", error);
      return;
    }
    // redirect if success
    if (!chatId) {
      console.error("No chat ID returned from addMessage");
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
    <div className="container relative mx-auto overflow-hidden">
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
          className="relative z-20 size-35 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 rounded-full shadow-xl border-4 border-white flex items-center justify-center"
        >
          {/* You can add an icon or avatar image here for more style */}
        </div>
        <div
          className="flex justify-center items-center w-full"
          ref={chatInputRef}
        >
          <ChatInput user={user} onSend={handleSent} loading={sending} />
        </div>
      </div>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2  max-w-md "
        ref={suggestionPopRef}
      >
        <SuggestionsPop messages={suggestion} />
      </div>
    </div>
  );
}
