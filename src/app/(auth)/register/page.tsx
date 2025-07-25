"use client";

import GoogleLoginButton from "../_components/GoogleLoginButton";
import TopLogo from "../_components/TopLogo";
import RegisterForm from "./RegisterForm";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Page() {
  const sidePhotoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidePhotoRef.current) {
      gsap.to(sidePhotoRef.current, {
        y: -30,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <div className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl px-4 sm:px-8 py-8 sm:py-10 flex flex-col items-center gap-6">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 mb-2 shrink-0">
          <TopLogo />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          إنشاء حساب جديد
        </h2>
        <RegisterForm />
        <div className="w-full flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-xs">أو</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <GoogleLoginButton />
        {/* Decorative planet SVG as background accent */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none z-0 max-w-[90%] overflow-hidden">
          <svg
            width="120"
            height="70"
            viewBox="0 0 70 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-32 h-16 sm:w-[120px] sm:h-[70px]"
          >
            <ellipse
              cx="35"
              cy="47"
              rx="28"
              ry="3"
              fill="#A3A3A3"
              fillOpacity="0.2"
            />
            <ellipse cx="35" cy="35" rx="20" ry="12" fill="#6EC6FF" />
            <ellipse
              cx="35"
              cy="35"
              rx="20"
              ry="12"
              fill="url(#planetGradient)"
            />
            <ellipse
              cx="35"
              cy="35"
              rx="14"
              ry="7"
              fill="#FFF59D"
              fillOpacity="0.2"
            />
            <ellipse
              cx="50"
              cy="30"
              rx="3"
              ry="1.5"
              fill="#FFF"
              fillOpacity="0.4"
            />
            <ellipse
              cx="25"
              cy="40"
              rx="2.5"
              ry="1"
              fill="#FFF"
              fillOpacity="0.3"
            />
            <defs>
              <linearGradient
                id="planetGradient"
                x1="15"
                y1="23"
                x2="55"
                y2="47"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6EC6FF" />
                <stop offset="1" stopColor="#1565C0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
