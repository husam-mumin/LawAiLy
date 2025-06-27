import React from "react";

// Mock user data
const users = [
  { id: 1, name: "أحمد محمد", email: "ahmed@example.com", role: "مشرف" },
  { id: 2, name: "سارة علي", email: "sara@example.com", role: "مستخدم" },
  { id: 3, name: "خالد يوسف", email: "khaled@example.com", role: "محرر" },
];

export default function UserManagement() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">إدارة المستخدمين</h1>
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-right">الاسم</th>
            <th className="p-3 text-right">البريد الإلكتروني</th>
            <th className="p-3 text-right">الدور</th>
            <th className="p-3 text-right">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-b-0">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">
                  تعديل
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
