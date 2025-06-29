"use client";
import DocumentCard from "./_components/DocumentCard";
import { useContext, useEffect, useState } from "react";
import { layoutContext } from "@/components/layout/MainLayout/MainLayout";
import Link from "next/link";

// Define the fetched document type
interface FetchedDocument {
  _id: string;
  createdAt: string;
  documentURL: string;
  title: string;
  description: string;
  image: string;
  showUp: boolean;
  addedBy: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  category?: {
    _id: string;
    name: string;
    description: string;
  };
}

export default function Home() {
  const [documents, setDocuments] = useState<FetchedDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<FetchedDocument[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  // Fetch documents from the API
  const searchContext = useContext(layoutContext);
  const { searchQuery } = searchContext || {};
  useEffect(() => {
    fetch("/api/in/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredDocuments(documents);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(lowerCaseQuery) ||
        doc.description.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);
  // Group documents by category
  const grouped = filteredDocuments.reduce(
    (acc: Record<string, FetchedDocument[]>, doc) => {
      const cat = doc.category?.name || "بدون تصنيف";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    },
    {} as Record<string, FetchedDocument[]>
  );

  if (loading) {
    return <div className="text-center py-20 text-xl">جاري التحميل...</div>;
  }

  return (
    <div className="py-12 px-4 min-h-screen">
      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([catName, docs]) => (
          <div key={catName} className="mb-12 w-full">
            <h2 className="text-3xl font-extrabold mb-8 text-right text-blue-900 drop-shadow-sm tracking-tight">
              {catName}
            </h2>
            <div className="flex justify-end gap-10 mb-8 flex-wrap">
              {docs.map((doc) => (
                <div key={doc._id} className="cursor-pointer">
                  <Link href={`/in/doc/${doc._id}`} className="block">
                    <DocumentCard
                      title={doc.title}
                      documentURL={doc.documentURL}
                      image={doc.image}
                      showUp={doc.showUp}
                      description={doc.description}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 h-[calc(100vh-200px)] flex items-center justify-center text-3xl font-bold">
          لا توجد قوانين متاحة حاليًا
        </div>
      )}
    </div>
  );
}
