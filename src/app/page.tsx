"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaGavel, FaRegFileAlt, FaUserShield } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Page() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (headlineRef.current && descRef.current && ctaRef.current) {
      gsap.from(headlineRef.current, {
        y: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(descRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });
      gsap.from(ctaRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: 1,
        ease: "back.out(1.7)",
      });
    }

    // Scroll animation for features section
    const features = document.querySelectorAll("#features > div");
    features.forEach((feature, i) => {
      gsap.from(feature, {
        scrollTrigger: {
          trigger: feature,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: "power2.out",
      });
    });
  }, []);

  return (
    <main
      dir="rlt"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center justify-center px-4"
    >
      <div className="h-dvh flex justify-center items-center flex-col">
        <motion.h1
          ref={headlineRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold text-blue-900 text-center mb-6 drop-shadow-lg"
        >
          مستشاري
        </motion.h1>
        <motion.p
          ref={descRef}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-2xl text-lg md:text-2xl text-blue-800 text-center mb-10"
        >
          مساعدك القانوني الذكي. حلل، نظم، وشارك مستنداتك القانونية فورياً مع
          دردشة متقدمة، تصنيف، وتعاون آمن. تمكين المحامين، الشركات، والأفراد
          بتقنية قانونية حديثة.
        </motion.p>
        <motion.div
          ref={ctaRef}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col md:flex-row gap-4 mb-16"
        >
          <Link href={"/in"}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 cursor-pointer py-3 rounded-full bg-blue-700 text-white font-semibold text-lg shadow-lg hover:bg-blue-800 transition-all duration-200"
            >
              ابدأ الآن
            </motion.button>
          </Link>
          <a href="#features">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 cursor-pointer rounded-full border-2 border-blue-700 text-blue-700 font-semibold text-lg bg-white shadow-lg hover:bg-blue-50 transition-all duration-200"
            >
              اعرف المزيد
            </motion.button>
          </a>
        </motion.div>
      </div>
      <motion.section
        id="features"
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
          whileHover={{ y: -8, scale: 1.04 }}
        >
          <FaGavel className="text-4xl text-blue-700 mb-4" />
          <h3 className="font-bold text-xl mb-2">
            محادثة قانونية بالذكاء الاصطناعي
          </h3>
          <p className="text-blue-800 text-center">
            تحدث مع مستنداتك، اطرح الأسئلة، واحصل على رؤى قانونية فورية مدعومة
            بالذكاء الاصطناعي.
          </p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
          whileHover={{ y: -8, scale: 1.04 }}
        >
          <FaRegFileAlt className="text-4xl text-blue-700 mb-4" />
          <h3 className="font-bold text-xl mb-2">المستندات القانونية</h3>
          <p className="text-blue-800 text-center">
            عرض جميع المستندات القانونية الخاصة بك في مكان واحد.
          </p>
        </motion.div>
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
          whileHover={{ y: -8, scale: 1.04 }}
        >
          <FaUserShield className="text-4xl text-blue-700 mb-4" />
          <h3 className="font-bold text-xl mb-2">التعاون والأمان</h3>
          <p className="text-blue-800 text-center">
            شارك المستندات، وادِر الصلاحيات، وتعاون بثقة وخصوصية.
          </p>
        </motion.div>
      </motion.section>
      <motion.footer
        className="mt-24 text-blue-600 text-center text-sm opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <div dir="ltr">&copy; 2025 جميع الحقوق محفوظة </div>
      </motion.footer>
    </main>
  );
}
