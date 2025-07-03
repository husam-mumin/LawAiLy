"use client";
import DocumentCard from "./_components/DocumentCard";
import { useContext, useEffect, useState } from "react";
import { layoutContext } from "@/components/layout/MainLayout/MainLayout";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userProfileSchema, UserProfileFormValues } from "./userProfileSchema";

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
  const [tourMode, settourMode] = useState(false);
  const { user } = useUser();
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
  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
    mode: "onChange",
  });

  if (loading) {
    return <div className="text-center py-20 text-xl">جاري التحميل...</div>;
  }
  if (!user) {
    return;
  }
  console.log("this is your user", user);

  function onSubmit(values: UserProfileFormValues) {
    // TODO: send values to API
    alert("تم حفظ البيانات: " + JSON.stringify(values));
  }
  if (!user.firstName) {
    // this is Mean this user First Login We will be a Welcome and Description of the App Ui
    // and there a form to add FirstName and the lastName

    return (
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-white flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow-lg bg-white border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-center text-blue-900">
            مرحباً بك في مستشاري، {user.firstName}!
          </h1>
          <p className="mb-6 text-center text-gray-600">
            هذا التطبيق يساعدك في إدارة ومتابعة مستنداتك القانونية بسهولة
            وفعالية. يمكنك تصفح القوانين، إضافة مستندات جديدة، والبحث عن أي
            مستند تريده.
          </p>
          <div className="mb-6 text-center text-blue-700 font-semibold">
            يرجى إكمال بياناتك الشخصية:
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأول</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم العائلة</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                حفظ البيانات
              </button>
            </form>
          </Form>
        </div>
      </div>
    );
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
