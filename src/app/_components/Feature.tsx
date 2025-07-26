"use client";

import React from "react";
import { Card, Carousel } from "./apple-cards-carousel";

export function Feature() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full py-20">
      <h2
        dir="rtl"
        className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans"
      >
        اكتشف ميزات مشروع مستشاري الذكي للخدمات القانونية
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const InheritanceContent = () => (
  <div
    dir="rtl"
    className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
  >
    <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
      <span className="font-bold text-neutral-700 dark:text-neutral-200">
        خدمة حساب الميراث في LawAiLy
      </span>
      <br />
      يتيح لك مشروع LawAiLy حساب نصيب كل وريث بدقة وسهولة، مع مراعاة القوانين
      الليبية والشريعة الإسلامية.
      <br />
      يمكنك إدخال بيانات الورثة وسيقوم النظام الذكي بحساب وتوضيح توزيع الميراث
      بشكل فوري، مما يوفر عليك الوقت والجهد في العمليات القانونية المعقدة.
    </p>
    {/* Image removed as requested */}
  </div>
);

const DocumentContent = () => (
  <div
    dir="rtl"
    className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
  >
    <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
      <span className="font-bold text-neutral-700 dark:text-neutral-200">
        تحليل المستندات في LawAiLy
      </span>
      <br />
      LawAiLy يوفر لك إمكانية رفع المستندات القانونية لتحليلها بشكل ذكي وسريع.
      <br />
      النظام يكتشف النقاط الهامة والأخطاء المحتملة في العقود والاتفاقيات،
      ويساعدك على فهم محتوى المستندات والتأكد من سلامتها القانونية قبل اتخاذ أي
      إجراء.
    </p>
    {/* Image removed as requested */}
  </div>
);

const LawContent = () => (
  <div
    dir="rtl"
    className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
  >
    <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
      <span className="font-bold text-neutral-700 dark:text-neutral-200">
        أسئلة وأجوبة قانونية عبر LawAiLy
      </span>
      <br />
      من خلال LawAiLy يمكنك طرح أي سؤال متعلق بالقانون الليبي والحصول على إجابات
      دقيقة وفورية.
      <br />
      المشروع يوفر قاعدة بيانات قانونية متكاملة ويعتمد على الذكاء الصناعي لتقديم
      شرح مبسط وواضح لكل مادة قانونية، مع تحديثات مستمرة للمعلومات.
    </p>
    {/* Image removed as requested */}
  </div>
);

const InstantContent = () => (
  <div
    dir="rtl"
    className=" text-right bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
  >
    <p className="text-neutral-600 text-right dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
      <span className=" text-right font-bold text-neutral-700 dark:text-neutral-200">
        السرعة في LawAiLy
      </span>
      <br />
      يركز مشروع LawAiLy على تقديم الإجابات والنتائج القانونية بشكل فوري دون أي
      انتظار.
      <br />
      كل ما عليك هو إدخال سؤالك أو مستندك، وسيتم معالجة الطلب مباشرة عبر النظام
      الذكي، لتوفير تجربة قانونية سريعة وفعالة لجميع المستخدمين.
    </p>
    {/* Image removed as requested */}
  </div>
);

const data = [
  {
    category: "الذكاء الصناعي",
    title: "حساب الميراث تلقائياً",
    src: "/calculator.jpg",
    content: <InheritanceContent />,
  },
  {
    category: "تحليل المستندات",
    title: "تحليل الوثائق القانونية",
    src: "/books.jpg",
    content: <DocumentContent />,
  },
  {
    category: "القانون الليبي",
    title: "أسئلة وأجوبة حول القانون الليبي",
    src: "/askq.jpg",
    content: <LawContent />,
  },
  {
    category: "النتائج الفورية",
    title: "احصل على الإجابات فوراً",
    src: "/paper.jpg",
    content: <InstantContent />,
  },
];
