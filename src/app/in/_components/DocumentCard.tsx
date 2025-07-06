import { Card, CardContent } from "@/components/ui/card";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DocumentCardProps {
  title: string;
  description: string;
  image?: string;
  documentURL?: string;
  showUp?: boolean;
}

export default function DocumentCard({
  title,
  description,
  image,
  showUp = true,
}: DocumentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, scale: 0.92, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onEnter = () => {
      gsap.to(el, {
        scale: 1.08,
        boxShadow: "0 12px 32px 0 rgba(0,0,0,0.18)",
        borderColor: "#2563eb",
        duration: 0.45,
        ease: "power3.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
        borderColor: "rgba(255,255,255,0.3)",
        duration: 0.45,
        ease: "power3.inOut",
      });
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      className="cursor-pointer w-full h-full  backdrop-blur-lg   flex flex-col p-0 relative group transition-all duration-300 hover:border-blue-600"
      tabIndex={0}
      aria-label={title}
      style={{
        background: undefined,
      }}
    >
      {/* Image or placeholder */}
      {image ? (
        <div className="w-full h-32 relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover bg-gray-200 group-hover:brightness-90 transition duration-200 "
            sizes="288px"
            priority={false}
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-5xl rounded-t-3xl">
          <span>📄</span>
        </div>
      )}
      <CardContent className="flex-1 flex flex-col justify-between text-right p-5">
        <div>
          <h2
            className="text-xl font-bold truncate text-blue-900 mb-1"
            title={title}
          >
            {title}
          </h2>
          <p
            className="text-base text-gray-700 mt-1 line-clamp-2 font-medium"
            title={description}
          >
            {description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          {!showUp && (
            <span className="text-xs text-red-500 font-bold ml-2">مخفي</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
