"use client";
import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow print:hidden"
    >
      طباعة التقرير
    </Button>
  );
}
