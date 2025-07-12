import {
  getDashboardStats,
  getLibyaLawCategories,
} from "./_actions/dashboardActions";
import React from "react";
import { DashboardLink } from "./_components/DashboardLinks";

// Convert to server component
export default async function Dashboard() {
  const stats = await getDashboardStats();
  const libyaLawCategories = await getLibyaLawCategories();

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
          label="إدارة المستندات"
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
        <StatCard label="عدد المستندات" value={stats.totalBooks} />
        <StatCard label="عدد الرسائل" value={stats.totalMessages} />
        <StatCard label="عدد الردود" value={stats.totalResponses} />
        <StatCard label="الإعجابات" value={stats.totalLike} />
        <StatCard label="المشاركات" value={stats.totalShares} />
      </div>
      {/* Simple bar chart mockup */}
      <h2 className="text-xl font-semibold mb-4">عدد المستندات في كل تصنيف</h2>
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        {libyaLawCategories.map((cat) => (
          <div key={cat._id} className="mb-3">
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
    <div className="bg-white text-center rounded shadow p-6 flex flex-col items-center">
      <span className="text-2xl font-bold text-blue-600 mb-2">{value}</span>
      <span className="text-gray-700 text-sm">{label}</span>
    </div>
  );
}
