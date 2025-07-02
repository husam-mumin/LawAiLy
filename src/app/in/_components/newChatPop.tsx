import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Simple inline robot SVG
export const RobotAvatar = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#E0E7FF" />
    <rect x="10" y="15" width="20" height="15" rx="7" fill="#6366F1" />
    <rect x="16" y="10" width="8" height="8" rx="4" fill="#6366F1" />
    <circle cx="15" cy="22" r="2" fill="#fff" />
    <circle cx="25" cy="22" r="2" fill="#fff" />
    <rect x="18" y="25" width="4" height="2" rx="1" fill="#fff" />
  </svg>
);

const helpMessages = [
  "مرحبًا! هل تحتاج إلى مساعدة في أي أسئلة قانونية؟",
  "أنا هنا لمساعدتك في المعلومات القانونية.",
  "تحتاج إلى فهم قانون؟ اسألني!",
];

export default function NewChatPop() {
  const [showMessage, setShowMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const hoverText = "لنبدأ الدردشة!";

  useEffect(() => {
    // Show the message after a short delay
    const showTimeout = setTimeout(() => {
      setShowMessage(true);
      // Start the message rotation
      timerRef.current = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % helpMessages.length;
          return nextIndex;
        });
      }, 5000); // Change message every 5 seconds
    }, 1000); // Initial delay before showing the message

    return () => {
      clearTimeout(showTimeout);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  // Hide the message after a few seconds
  useEffect(() => {
    if (showMessage && bubbleRef.current) {
      // Reset styles before animating
      gsap.set(bubbleRef.current, {
        clearProps: "all",
        scale: 0.2,
        borderRadius: "50%",
        opacity: 0,
        width: 40,
        height: 40,
        padding: 0,
        transformOrigin: "left bottom",
      });
      gsap.to(bubbleRef.current, {
        scale: 1,
        borderRadius: "24px 24px 24px 4px",
        opacity: 1,
        width: "max-content",
        height: "auto",
        padding: "0.5rem 1rem",
        duration: 0.7,
        ease: "back.out(1.7)",
        clearProps: "width,height,padding,borderRadius,scale,x,y,opacity",
      });
    }
  }, [showMessage, messageIndex]);

  // Typing animation effect
  useEffect(() => {
    let typingActive = true;
    const message = isHovering ? hoverText : helpMessages[messageIndex] || "";
    setTypedText("");
    let i = 0;
    function typeChar() {
      if (!typingActive) return;
      setTypedText(message.slice(0, i + 1));
      i++;
      if (i < message.length) {
        typingTimeout.current = setTimeout(typeChar, 30);
      } else {
        // After typing animation completes
        if (!isHovering && !showMessage) return;
        // If hovering, pause message rotation
        if (isHovering && timerRef.current) {
          clearInterval(timerRef.current);
        }
        // If not hovering, restart message rotation if not already running
        if (!isHovering && showMessage && !timerRef.current) {
          timerRef.current = setInterval(() => {
            setMessageIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % helpMessages.length;
              return nextIndex;
            });
          }, 5000);
        }
      }
    }
    if (showMessage || isHovering) {
      typeChar();
    }
    return () => {
      typingActive = false;
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [showMessage, messageIndex, isHovering]);

  // Pause/resume message rotation on hover
  useEffect(() => {
    if (isHovering && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    } else if (!isHovering && showMessage && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % helpMessages.length;
          return nextIndex;
        });
      }, 5000);
    }
  }, [isHovering, showMessage]);

  // check the path if he is in chat or Dashboard stop showing
  const path = usePathname();
  if (path.includes("/in/chat") || path.includes("/in/dashboard")) {
    return null;
  }

  return (
    <Link
      href={"/in/chat"}
      className="fixed bottom-8 left-8 z-50 flex flex-col items-start"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-end">
        <div className="ml-2">
          <Avatar
            className="shadow-lg border-2 border-indigo-400 bg-white"
            style={{ width: 52, height: 52 }}
          >
            <RobotAvatar />
          </Avatar>
        </div>
        {(showMessage || isHovering) && (
          <div
            ref={bubbleRef}
            className="bg-indigo-100 text-indigo-900 px-4 py-2 rounded-2xl rounded-bl-none shadow-md mb-2 ml-2 absolute left-6 -top-11 w-max "
            style={{
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderBottomRightRadius: 24,
              borderBottomLeftRadius: 4,
              whiteSpace: "pre-line",
              wordBreak: "break-word",
            }}
          >
            {typedText}
          </div>
        )}
      </div>
    </Link>
  );
}
