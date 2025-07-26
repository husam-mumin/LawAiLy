import React from "react";
import { Spotlight } from "./spotlight-new";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SparklesCore } from "./sparkles";

export default function Hero() {
  return (
    <div className="h-dvh w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="flex justify-center items-center flex-col  p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"></h1>
        <Image
          className="filter invert mx-auto w-fit"
          src={"/MainLogo.png"}
          alt="Logo"
          width={600}
          height={600}
        />
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          مستشاري هو منصة ذكاء صناعي متخصصة في الميراث والقانون الليبي، تهدف إلى
          تقديم حلول قانونية متكاملة وتسهيل الوصول إلى المعرفة القانونية من خلال
          الذكاء الصناعي.
        </p>
        <Link href={"/login"}>
          <Button variant="secondary" className="mt-6 mx-auto block">
            ابدأ الآن
          </Button>
        </Link>
      </div>
    </div>
  );
}
