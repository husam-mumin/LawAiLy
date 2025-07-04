"use client";
import { libyaLawCategories } from "@/mock/lawCategories";
import React, { useEffect, useState } from "react";
import { DashboardLink } from "./_components/DashboardLinks";

// Dashboard mock stats (replace with API calls for real data)
const getDashboardStats = () => {
  const totalCategories = libyaLawCategories.length;
  const totalBooks = libyaLawCategories.reduce(
    (sum, cat) => sum + cat.books.length,
    0
  );
  // These would be fetched from the backend in a real app
  const totalMessages = 120; // mock
  const totalResponses = 80; // mock
  const totalLikes = 45; // mock
  const totalShares = 30; // mock
  const totalReports = 7; // mock
  return {
    totalCategories,
    totalBooks,
    totalMessages,
    totalResponses,
    totalLikes,
    totalShares,
    totalReports,
  };
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalBooks: 0,
    totalMessages: 0,
    totalResponses: 0,
    totalLikes: 0,
    totalShares: 0,
    totalReports: 0,
  });

  useEffect(() => {
    setStats(getDashboardStats());
  }, []);

  return (
    <div dir="rtl" className="p-8 ">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <DashboardLink
          href="/in/dashboard/usersmanagement"
          label="إدارة المستخدمين"
        />
        <DashboardLink
          href="/in/dashboard/documentsmanagement"
          label="إدارة الكتب"
        />
        <DashboardLink
          href="/in/dashboard/newmanagement"
          label="إدارة الأخبار"
        />
        <DashboardLink
          href="/in/dashboard/categoriesmanagement"
          label="إدارة التصنيفات"
        />
        <DashboardLink href="/in/dashboard/reports" label="التقارير" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="عدد التصنيفات" value={stats.totalCategories} />
        <StatCard label="عدد الكتب" value={stats.totalBooks} />
        <StatCard label="عدد الرسائل" value={stats.totalMessages} />
        <StatCard label="عدد الردود" value={stats.totalResponses} />
        <StatCard label="الإعجابات" value={stats.totalLikes} />
        <StatCard label="المشاركات" value={stats.totalShares} />
        <StatCard label="التقارير" value={stats.totalReports} />
      </div>
      {/* Simple bar chart mockup */}
      <h2 className="text-xl font-semibold mb-4">عدد الكتب في كل تصنيف</h2>
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        {libyaLawCategories.map((cat) => (
          <div key={cat.id} className="mb-3">
            <div className="flex justify-between mb-1">
              <span>{cat.name}</span>
              <span>{cat.books.length}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded">
              <div
                className="h-3 bg-blue-500 rounded"
                style={{
                  width: `${(cat.books.length / stats.totalBooks) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded shadow p-6 flex flex-col items-center">
      <span className="text-2xl font-bold text-blue-600 mb-2">{value}</span>
      <span className="text-gray-700 text-sm">{label}</span>
    </div>
  );
}
