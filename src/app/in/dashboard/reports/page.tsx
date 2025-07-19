/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Chat from "@/models/Chat";
import DocumentModel from "@/models/Documents";
import User from "@/models/Users";
import Message from "@/models/Messages";
import Response from "@/models/Responses";
import PrintButton from "./PrintButton";

export default async function ReportsDashboard() {
  // Fetch all data asynchronously
  // Use .lean() to get plain objects for users
  const usersRaw = await User.find({}).sort("-createdAt").limit(5).lean();
  // Remove any Buffer fields from users
  const users = usersRaw.map((user: any) => {
    const cleanUser = { ...user };
    Object.keys(cleanUser).forEach((key) => {
      if (cleanUser[key] && cleanUser[key].type === "Buffer") {
        cleanUser[key] = "[file]";
      }
    });
    return cleanUser;
  });

  const documentsRaw = await DocumentModel.find({})
    .populate("addedBy")
    .populate("category")
    .lean();
  // Remove any Buffer fields from documents
  const documents = documentsRaw.map((doc: any) => {
    const cleanDoc = { ...doc };
    Object.keys(cleanDoc).forEach((key) => {
      if (cleanDoc[key] && cleanDoc[key].type === "Buffer") {
        cleanDoc[key] = "[file]";
      }
    });
    return cleanDoc;
  });
  const chatsCount = await Chat.find({}).countDocuments();
  const messagesCount = await Message.find({}).countDocuments();
  const responsesCount = await Response.find({}).countDocuments();

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
        <PrintButton />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {/* Users */}
        <Card className="p-4 flex flex-col items-center shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white print:border-none print:shadow-none">
          <span className="text-lg font-semibold text-blue-900">
            المستخدمون
          </span>
          <span className="text-2xl font-bold mt-2 text-blue-700">
            {users.length}
          </span>
        </Card>
        {/* Documents */}
        <Card className="p-4 flex flex-col items-center shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white print:border-none print:shadow-none">
          <span className="text-lg font-semibold text-blue-900">المستندات</span>
          <span className="text-2xl font-bold mt-2 text-blue-700">
            {documents.length}
          </span>
        </Card>
        {/* Chats */}
        <Card className="p-4 flex flex-col items-center shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white print:border-none print:shadow-none">
          <span className="text-lg font-semibold text-blue-900">المحادثات</span>
          <span className="text-2xl font-bold mt-2 text-blue-700">
            {chatsCount}
          </span>
        </Card>
        {/* Messages */}
        <Card className="p-4 flex flex-col items-center shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white print:border-none print:shadow-none">
          <span className="text-lg font-semibold text-blue-900">الرسائل</span>
          <span className="text-2xl font-bold mt-2 text-blue-700">
            {messagesCount}
          </span>
        </Card>
        {/* Responses */}
        <Card className="p-4 flex flex-col items-center shadow-md border border-gray-200 bg-gradient-to-br from-blue-50 to-white print:border-none print:shadow-none">
          <span className="text-lg font-semibold text-blue-900">الردود</span>
          <span className="text-2xl font-bold mt-2 text-blue-700">
            {responsesCount}
          </span>
        </Card>
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
              {users.map((user: any) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50 print:hover:bg-white"
                >
                  <td>
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
              {documents.map((doc: any) => (
                <tr
                  key={doc._id}
                  className="hover:bg-blue-50 print:hover:bg-white"
                >
                  <td>{doc.title}</td>
                  <td>{doc.category?.name || doc.category || "-"}</td>
                  <td>{doc.addedBy?.firstName || "-"}</td>
                  <td>{doc.showUp ? "نعم" : "لا"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
