"use client";
import DocumentCard from "./_components/DocumentCard";
import { useContext, useEffect, useRef, useState } from "react";
import { layoutContext } from "@/components/layout/MainLayout/MainLayout";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { OpenSidebarContext } from "@/components/layout/MainLayout/OpenSidebarContext";
import FirstLogin from "./_components/FirstLogin";
import { UserProfileFormValues } from "./userProfileSchema";
import axios from "axios";
import { userPatch } from "../api/in/user/route";
import { XOctagonIcon } from "lucide-react";
import { notificationUnsupported } from "@/lib/Push";
import { attachPushSubscribeToButton } from "./action/PushSubscribe";

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

// Register ScrollTrigger only once

export default function Home() {
  const [documents, setDocuments] = useState<FetchedDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<FetchedDocument[]>(
    []
  );
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  // Fetch documents from the API
  const searchContext = useContext(layoutContext);
  const { searchQuery, setSearchQuery } = searchContext || {};

  // New: fetchDocuments function using axios
  const fetchDocuments = async () => {
    try {
      const res = await axios.get("/api/in/documents", {
        withCredentials: true,
      });
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    if (!setSearchQuery) return;
    setSearchQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        doc.description.toLowerCase().includes(lowerCaseQuery) ||
        doc.category?.name.toLowerCase().includes(lowerCaseQuery)
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

  const con = useContext(OpenSidebarContext);

  // --- New: For category navigation ---
  const categoryNames = Object.keys(grouped);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);

  // --- New: Scroll to category on nav click ---
  const handleCategoryNavClick = (idx: number) => {
    const section = categoryRefs.current[idx];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (user) {
      if (!user?.firstName) {
        if (con?.isSidebarOpen) {
          con?.setIsSidebarOpen(false);
        }
      } else {
        con?.setIsSidebarOpen(true);
      }
    }
  }, [user, con]);

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!user) return;
    const isUnsupported = notificationUnsupported();

    localStorage.setItem("userid", user ? user._id : "");

    if (isUnsupported) {
      return;
    }
    attachPushSubscribeToButton("subscribe-btn");
  }, [user]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white z-50">
        <svg
          className="animate-spin h-16 w-16 text-blue-500 mb-6 drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
        <div className="text-2xl font-bold text-blue-700 animate-pulse mb-2">
          جاري التحميل...
        </div>
        <div className="text-md text-blue-400 animate-fade-in">
          يرجى الانتظار قليلاً
        </div>
      </div>
    );
  }
  if (!user) {
    return;
  }

  async function onSubmit(values: UserProfileFormValues) {
    if (!user?._id) return;
    try {
      const res = await axios.patch<userPatch>(`/api/in/user?id=${user._id}`, {
        firstName: values.firstName,
        lastName: values.lastName,
      });
      setUser({ ...user, ...res.data });
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
      console.error(err);
    }
  }

  return (
    <div
      dir="rtl"
      className="h-[calc(100dvh-4rm)] relative bg-gradient-to-br from-blue-50 to-white"
    >
      {/* Header */}
      <div className="w-full h-8" />
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <h1 className="text-4xl font-bold text-blue-900 drop-shadow-sm tracking-tight">
            مرحباً بك {user.firstName + " " + user.lastName}
          </h1>
          <div className="flex items-center gap-4">
            {/* You can add user avatar or actions here if needed */}
          </div>
        </div>
        {/* --- Category Navigation Bar --- */}
        {categoryNames.length > 1 && (
          <div className="sticky top-0 z-20   rounded-xl  flex flex-wrap gap-2 py-3 px-2 mb-6 overflow-x-auto">
            {categoryNames.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => handleCategoryNavClick(idx)}
                className="transition-all px-4 py-1 rounded-full font-semibold text-blue-800 bg-blue-50 hover:bg-blue-200 border border-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* First Login Prompt */}
      {!user?.firstName && (
        <div className="max-w-lg mx-auto mt-8">
          <FirstLogin onSubmit={onSubmit} />
        </div>
      )}
      {/* Main Content */}
      <div className="py-8 px-2 sm:px-4 min-h-screen max-w-5xl mx-auto">
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([catName, docs], idx) => (
            <div
              key={catName}
              className="mb-16 w-full "
              ref={(el) => {
                sectionRefs.current[idx] = el;
                categoryRefs.current[idx] = el;
              }}
            >
              {/* --- Enhanced Category Header --- */}
              <div className="flex items-center gap-4 mb-8  rounded-lg px-4 py-3  ">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 drop-shadow-sm tracking-tight whitespace-nowrap">
                  {catName}
                </h2>
                <div className="flex-1 border-t border-blue-200" />
              </div>
              {/* --- Enhanced Document Cards Grid --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 justify-center items-center content-center self-center place-self-center gap-10 flex-wrap">
                {docs.map((doc) => (
                  <Link
                    key={doc._id}
                    href={`/in/doc/${doc._id}`}
                    className="w-[16rem] block group transition-transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl rounded-2xl bg-white/90 border border-blue-100 overflow-hidden shadow-md duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <DocumentCard
                      title={doc.title}
                      documentURL={doc.documentURL}
                      image={doc.image}
                      showUp={doc.showUp}
                      description={doc.description}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-center text-gray-400">
            <XOctagonIcon size={80} />
            <div className="text-2xl font-semibold mb-2">
              {searchQuery != ""
                ? "لا يوجد مستندات بهذا الاسم"
                : "لا توجد مستندات متاحة حالياً"}
            </div>
            <div className="text-md"> جرب البحث باسم آخر.</div>
          </div>
        )}
        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center z-[60] bg-white/60">
            <svg
              className="animate-spin h-12 w-12 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
