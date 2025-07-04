/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

// Example API endpoints (replace with your actual endpoints)
const endpoints = [
  { key: "users", label: "المستخدمون", url: "/api/dashboard/users" },
  { key: "documents", label: "المستندات", url: "/api/dashboard/documents" },
  { key: "chats", label: "المحادثات", url: "/api/dashboard/dashboard" },
  { key: "messages", label: "الرسائل", url: "/api/dashboard/messages" },
  { key: "responses", label: "الردود", url: "/api/dashboard/responses" },
  { key: "likes", label: "الإعجابات", url: "/api/dashboard/likes" },
  { key: "shares", label: "المشاركات", url: "/api/dashboard/shares" },
  { key: "reports", label: "التقارير", url: "/api/dashboard/reports" },
];

export default function ReportsDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results: { [key: string]: any } = {};
      await Promise.all(
        endpoints.map(async (ep) => {
          try {
            const res = await fetch(ep.url);
            results[ep.key] = await res.json();
          } catch {
            results[ep.key] = [];
          }
        })
      );
      setData(results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center">جاري التحميل...</div>;

  return (
    <div
      className="p-8 max-w-7xl mx-auto bg-white rounded-lg print:shadow-none print:bg-white"
      dir="rtl"
    >
      <div dir="ltr" className="flex print:hidden mb-10  justify-between gap-4">
        <Button variant={"ghost"} size={"lg"} className="">
          <Link
            href={"/in/dashboard"}
            className="w-full h-full flex justify-center items-center"
          >
            <ChevronLeft className="inline mr-2 " />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">التقرير</h1>
      </div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="text-3xl font-bold">نظرة عامة على تقارير المشروع</h1>
        <Button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow print:hidden"
        >
          طباعة التقرير
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {endpoints.map((ep) => (
          <Card
            key={ep.key}
            className="p-4 flex flex-col items-center shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white print:border-none print:shadow-none"
          >
            <span className="text-lg font-semibold text-blue-900">
              {ep.label}
            </span>
            <span className="text-2xl font-bold mt-2 text-blue-700">
              {Array.isArray(data[ep.key]) ? data[ep.key].length : 0}
            </span>
          </Card>
        ))}
      </div>
      <Separator className="my-8 print:hidden" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Users Table */}
        <Card className="p-4 border border-gray-200 print:border-none print:shadow-none">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            أحدث المستخدمين
          </h2>
          <Table className="min-w-full border print:text-xs">
            <thead className="bg-blue-100 print:bg-white">
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الدور</th>
              </tr>
            </thead>
            <tbody>
              {data.users?.slice(0, 5).map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50 print:hover:bg-white"
                >
                  <td>
                    {/* Avatar fallback for print */}
                    <span className="inline-block w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      {user.AvatarURL ? (
                        <Image
                          width={32}
                          height={32}
                          src={user.AvatarURL}
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-gray-500">
                          {user.firstName?.[0]}
                        </span>
                      )}
                    </span>
                  </td>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.role === "admin"
                      ? "مشرف"
                      : user.role === "owner"
                      ? "مالك"
                      : "مستخدم"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        {/* Documents Table */}
        <Card className="p-4 border border-gray-200 print:border-none print:shadow-none">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            أحدث المستندات
          </h2>
          <Table className="min-w-full border print:text-xs">
            <thead className="bg-blue-100 print:bg-white">
              <tr>
                <th>العنوان</th>
                <th>القسم</th>
                <th>أضيف بواسطة</th>
                <th>ظاهر</th>
              </tr>
            </thead>
            <tbody>
              {data.documents?.slice(0, 5).map((doc: any) => (
                <tr
                  key={doc._id}
                  className="hover:bg-blue-50 print:hover:bg-white"
                >
                  <td>{doc.title}</td>
                  <td>{doc.category || "-"}</td>
                  <td>{doc.addedBy?.firstName || "-"}</td>
                  <td>{doc.showUp ? "نعم" : "لا"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        {/* Add more cards/tables for other entities as needed */}
      </div>
    </div>
  );
}
