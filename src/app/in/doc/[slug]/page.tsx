"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { documentType } from "@/models/Documents";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import react-pdf to avoid SSR issues
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
});

export default function DocPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;
  const [document, setDocument] = useState<documentType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPdf() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get<documentType>(
          `/api/in/document?id=${slug}`
        );
        if (res.data && res.data.documentURL) {
          setDocument(res.data);
        } else {
          setError("لم يتم العثور على ملف PDF.");
        }
      } catch {
        setError("حدث خطأ أثناء جلب الملف.");
      } finally {
        setLoading(false);
      }
    }
    if (!slug) return;
    fetchPdf();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Loader2 className="animate-spin text-black mb-4" size={48} />
        <span className="text-lg text-black">جاري تحميل المستند...</span>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="bg-white rounded-xl shadow-xl p-8 flex flex-col items-center max-w-md w-full border border-black/10">
          <Alert
            variant="destructive"
            className="w-full mb-6 border-0 bg-transparent p-0"
          >
            <AlertTitle className="text-xl mb-2 text-black">
              خطأ في تحميل المستند
            </AlertTitle>
            <AlertDescription className="text-base text-black/70">
              {error ||
                "لم يتم العثور على ملف PDF. يرجى التأكد من صحة الرابط أو المحاولة لاحقًا."}
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 mt-2 px-6 py-2 text-base rounded-lg border-black/10 text-black hover:bg-black/5"
          >
            <ArrowRight className="rtl:rotate-180" size={20} />
            <span>العودة</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden border border-black/10 bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-black/10 bg-black/5">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-black hover:bg-black/10"
          >
            <ArrowRight className="rtl:rotate-180" size={20} />
            <span>العودة</span>
          </Button>
          <span className="text-base font-semibold text-black truncate max-w-xs">
            {document.title}
          </span>
        </div>
        <div className="flex-1 bg-white overflow-auto flex flex-col items-center justify-center">
          <PDFViewer url={document.documentURL} />
        </div>
      </div>
    </div>
  );
}
