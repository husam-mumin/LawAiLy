import React from "react";
import Hero from "./_components/Hero";
import { Feature } from "./_components/Feature";

export default function Page() {
  // Scroll animation for features section
  return (
    <main dir="rlt" className="bg-black dark">
      <section id="Hero" className="h-screen w-screen relative">
        <Hero />
      </section>

      <section id="features" className="text-white">
        <Feature />
      </section>
      <section id="about" className="text-white">
        <div
          className="max-w-7xl mx-auto px-4 py-20
          text-center text-xl md:text-3xl font-bold"
        >
          <h2 className="text-neutral-800 dark:text-neutral-200">
            تعرف على مشروع مستشاري الذكي للخدمات القانونية
          </h2>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            هو منصة مبتكرة تهدف إلى تسهيل الوصول إلى الخدمات القانونية في ليبيا
            من خلال استخدام الذكاء الاصطناعي.
            <br />
            هذا المشروع هو مشروع تخرج للطالبين حسام فرج مؤمن و أحمد نوري بن
            خيال، من كلية العلوم والتقنية.
          </p>
        </div>
      </section>
      <section id="footer" className="bg-neutral-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-neutral-400">
            © 2025 مشروع مستشاري الذكي للخدمات القانونية. جميع الحقوق محفوظة.
          </p>
        </div>
      </section>
    </main>
  );
}
