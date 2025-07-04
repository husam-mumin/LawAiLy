// بيانات تجريبية (Mock) لقوانين ليبيا من الحكومة، كل تصنيف يحتوي على عدة كتب رسمية

export type lawCategory = {
  id: number;
  name: string;
  books: Array<{
    id: number;
    title: string;
    publisher: string;
    img: string; // إضافة خاصية الصورة
  }>;
};

export const libyaLawCategories = [
  {
    id: 1,
    name: "القانون الدستوري الليبي",
    books: [
      { id: 1, title: "دستور ليبيا المؤقت لسنة 2011", publisher: "المجلس الوطني الانتقالي", img: "/books/libya-constitution-2011.png" },
      { id: 2, title: "مشروع الدستور الليبي 2017", publisher: "الهيئة التأسيسية لصياغة الدستور", img: "/books/libya-draft-2017.png" }
    ]
  },
  {
    id: 2,
    name: "القانون الجنائي الليبي",
    books: [
      { id: 1, title: "قانون العقوبات الليبي", publisher: "وزارة العدل الليبية", img: "/books/libya-penal-code.png" },
      { id: 2, title: "قانون الإجراءات الجنائية الليبي", publisher: "وزارة العدل الليبية", img: "/books/libya-criminal-procedure.png" }
    ]
  },
  {
    id: 3,
    name: "قانون العمل الليبي",
    books: [
      { id: 1, title: "قانون العمل رقم 12 لسنة 2010", publisher: "وزارة العمل والتأهيل", img: "/books/libya-labor-law-2010.png" },
      { id: 2, title: "قانون الضمان الاجتماعي", publisher: "صندوق الضمان الاجتماعي الليبي", img: "/books/libya-social-security.png" }
    ]
  },
  {
    id: 4,
    name: "القانون التجاري الليبي",
    books: [
      { id: 1, title: "قانون الشركات التجارية الليبي", publisher: "وزارة الاقتصاد والتجارة", img: "/books/libya-commercial-companies.png" },
      { id: 2, title: "قانون السجل التجاري", publisher: "وزارة الاقتصاد والتجارة", img: "/books/libya-commercial-register.png" }
    ]
  },
  {
    id: 5,
    name: "قانون الأحوال الشخصية الليبي",
    books: [
      { id: 1, title: "قانون الأحوال الشخصية الليبي", publisher: "وزارة العدل الليبية", img: "/books/libya-personal-status.png" },
      { id: 2, title: "قانون الزواج والطلاق", publisher: "وزارة العدل الليبية", img: "/books/libya-marriage-divorce.png" }
    ]
  }
];
