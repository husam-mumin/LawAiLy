"use client";
import React, { useEffect, useRef, useState } from "react";
import { RobotAvatar } from "../../_components/newChatPop";
import { Avatar } from "@/components/ui/avatar";
import gsap from "gsap";

export default function SuggestionsPop({ messages }: { messages: string[] }) {
  const [showMessage, setShowMessage] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Show the message after a short delay
    const showTimeout = setTimeout(() => {
      setShowMessage(true);
      // Start the message rotation
      timerRef.current = setInterval(() => {
        setMessageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % messages.length;
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
  }, [messages.length]);
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
    // Only run this when showMessage changes from false to true
  }, [showMessage]);

  // Rotate messages every 5 seconds if showMessage is true
  useEffect(() => {
    if (!showMessage) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showMessage, messages.length]);

  // Typing animation effect
  useEffect(() => {
    let typingActive = true;
    const message = messages[messageIndex] || "";
    setTypedText("");
    let i = 0;
    function typeChar() {
      if (!typingActive) return;
      setTypedText(message.slice(0, i + 1));
      i++;
      if (i < message.length) {
        typingTimeout.current = setTimeout(typeChar, 30);
      }
    }
    if (showMessage) {
      typeChar();
    }
    return () => {
      typingActive = false;
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [showMessage, messageIndex, messages]);

  // check the path if he is in chat or Dashboard stop showing

  return (
    <div className="flex items-end justify-center w-fit relative">
      <div className="ml-2">
        <Avatar
          className="shadow-lg border-2 border-indigo-400 bg-white"
          style={{ width: 52, height: 52 }}
        >
          <RobotAvatar />
        </Avatar>
      </div>
      {showMessage && (
        <div
          ref={bubbleRef}
          className="bg-indigo-100 text-center text-indigo-900 px-4 py-2 rounded-2xl shadow-md mb-2 ml-2 absolute left-1/2 -translate-x-1/2 -top-11 w-max"
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
  );
}
