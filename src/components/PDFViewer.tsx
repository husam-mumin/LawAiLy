import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);
  // Encode the URL if it contains non-ASCII characters (e.g., Arabic)
  const encodedUrl = url ? encodeURI(url) : url;
  if (!url) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-500">لا يوجد ملف PDF لعرضه</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
        >
          <ChevronRight className="rtl:rotate-180" />
        </Button>
        <span className="text-sm text-black">
          صفحة {pageNumber} من {numPages || "..."}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
          disabled={pageNumber >= numPages}
        >
          <ChevronLeft className="rtl:rotate-180" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
        >
          <ZoomOut />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setScale((s) => Math.min(2, s + 0.2))}
        >
          <ZoomIn />
        </Button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-start w-full overflow-auto bg-white rounded-lg">
        <Document
          file={encodedUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="text-black">جاري تحميل الصفحات...</div>}
          error={<div className="text-red-500">تعذر تحميل الملف</div>}
        >
          <Page
            pageNumber={pageNumber}
            width={600}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}
