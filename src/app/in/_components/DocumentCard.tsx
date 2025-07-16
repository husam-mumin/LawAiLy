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
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <Card
      ref={cardRef}
      className="cursor-pointer w-full h-full backdrop-blur-lg flex flex-col p-0 relative group transition-all duration-300 hover:border-blue-600 shadow-md hover:shadow-xl"
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
