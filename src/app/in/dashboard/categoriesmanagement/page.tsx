"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Check, X, RefreshCcw } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useCategoriesAction } from "./_hooks/useCategoriesAction";
import { categoryType } from "@/models/Category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Page() {
  const {
    addCategory,
    categories,
    editCategory,
    error,
    fetchCategories,
    loading,
    removeCategory,
  } = useCategoriesAction();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    name: string;
    description?: string;
  }>({
    name: "",
    description: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addValues, setAddValues] = useState<{
    name: string;
    description?: string;
  }>({
    name: "",
    description: "",
  });

  const handleAddCategory = async () => {
    setAdding(true);
    setAddValues({ name: "", description: "" });
    setEditingId(null); // Cancel any edit in progress
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddValues({ ...addValues, [e.target.name]: e.target.value });
  };

  const handleSaveAdd = async () => {
    try {
      await addCategory(addValues);
      toast.success("تمت إضافة التصنيف بنجاح");
      setAdding(false);
      setAddValues({ name: "", description: "" });
      fetchCategories();
    } catch {
      toast.error("حدث خطأ أثناء إضافة التصنيف");
    }
  };

  const handleEditClick = (cat: categoryType) => {
    setEditingId(cat._id);
    setEditValues({ name: cat.name, description: cat.description });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const handleSaveClick = async (catId: string) => {
    try {
      await editCategory(catId, editValues);
      toast.success("تم تعديل التصنيف بنجاح");
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error("حدث خطأ أثناء تعديل التصنيف");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteClick = (catId: string) => {
    setDeleteId(catId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await removeCategory(deleteId);
        toast.success("تم حذف التصنيف بنجاح");
        setDeleteId(null);
        setShowDeleteDialog(false);
        fetchCategories();
      } catch {
        toast.error("حدث خطأ أثناء حذف التصنيف");
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  };

  const handleCancelAdd = () => {
    setAdding(false);
    setAddValues({ name: "", description: "" });
  };

  return (
    <div className="p-4 text-right ">
      <div className="flex  justify-between gap-4">
        <Button variant={"ghost"} size={"lg"} className="">
          <Link
            href={"/in/dashboard"}
            className="w-full h-full flex justify-center items-center"
          >
            <ChevronLeft className="inline mr-2 " />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">إدارة التصنيفات</h1>
      </div>
      <div className="flex flex-col  gap-4 mt-4 w-full">
        <div className="w-full ">
          <div className="flex items-center justify-end gap-6 mb-4 ">
            <Button
              onClick={() => {
                fetchCategories(); // Fetch categories from the server
              }}
              className="mb-4 flex gap-2 "
              variant="outline"
            >
              <RefreshCcw size={18} /> تجديد التصنيفات
            </Button>
            <Button
              onClick={() => {
                handleAddCategory();
              }}
              className="mb-4 flex gap-2 "
              variant="outline"
            >
              <Plus size={18} /> إضافة تصنيف جديد
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            {loading ? (
              <div className="py-10 text-center text-gray-500 text-lg">
                جاري التحميل...
              </div>
            ) : error ? (
              <div className="py-10 text-center text-red-500 text-lg">
                {error}
              </div>
            ) : (
              <table dir="rtl" className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العدد
                    </th>
                    <th
                      className="py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1 whitespace-nowrap"
                      style={{ width: "1%", minWidth: "120px" }}
                    >
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adding && (
                    <tr className="bg-green-50 animate-fade-in">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input
                          name="name"
                          value={addValues.name}
                          onChange={handleAddChange}
                          className="border border-green-400 focus:ring-2 focus:ring-green-300 rounded px-2 py-1 w-full outline-none transition"
                          placeholder="اسم التصنيف"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          name="description"
                          value={addValues.description || ""}
                          onChange={handleAddChange}
                          className="border border-green-400 focus:ring-2 focus:ring-green-300 rounded px-2 py-1 w-full outline-none transition"
                          placeholder="وصف التصنيف"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center">
                        —
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 justify-end w-1"
                        style={{ width: "1%", minWidth: "120px" }}
                      >
                        <Button
                          size="icon"
                          variant="outline"
                          aria-label="حفظ التصنيف الجديد"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={handleSaveAdd}
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="إلغاء"
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                          onClick={handleCancelAdd}
                        >
                          <X size={16} />
                        </Button>
                      </td>
                    </tr>
                  )}
                  {categories && categories.length > 0 ? (
                    categories.map((cat: categoryType) => (
                      <tr
                        key={cat._id}
                        className={
                          editingId === cat._id
                            ? "bg-blue-50"
                            : "hover:bg-gray-50 transition-colors"
                        }
                      >
                        {editingId === cat._id ? (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <input
                                name="name"
                                value={editValues.name}
                                onChange={handleEditChange}
                                className="border border-blue-400 focus:ring-2 focus:ring-blue-300 rounded px-2 py-1 w-full outline-none transition"
                                placeholder="اسم التصنيف"
                                autoFocus
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <input
                                name="description"
                                value={editValues.description || ""}
                                onChange={handleEditChange}
                                className="border border-blue-400 focus:ring-2 focus:ring-blue-300 rounded px-2 py-1 w-full outline-none transition"
                                placeholder="وصف التصنيف"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              {typeof cat.count === "number" ? (
                                cat.count
                              ) : (
                                <span className="text-gray-400">
                                  لا يوجد كتب
                                </span>
                              )}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 justify-end w-1"
                              style={{ width: "1%", minWidth: "120px" }}
                            >
                              <Button
                                size="icon"
                                variant="outline"
                                aria-label="حفظ التصنيف"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleSaveClick(cat._id)}
                              >
                                <Check size={16} />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="إلغاء"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                                onClick={handleCancelEdit}
                              >
                                <X size={16} />
                              </Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {cat.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {cat.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              {typeof cat.count === "number" ? (
                                cat.count
                              ) : (
                                <span className="text-gray-400">
                                  لا يوجد كتب
                                </span>
                              )}
                            </td>
                            <td
                              className="px-6 py-4 whitespace-nowrap text-sm flex gap-2 justify-end w-1"
                              style={{ width: "1%", minWidth: "120px" }}
                            >
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="تعديل التصنيف"
                                className="hover:bg-blue-100"
                                onClick={() => handleEditClick(cat)}
                              >
                                <Pencil size={16} className="text-blue-500" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                aria-label="حذف التصنيف"
                                className="hover:bg-red-100"
                                onClick={() => handleDeleteClick(cat._id)}
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : !adding ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-gray-400 text-lg"
                      >
                        لا توجد تصنيفات
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rounded-xl shadow-lg border-0 p-0">
          <DialogHeader className="bg-red-50 rounded-t-xl px-6 pt-6 pb-2">
            <DialogTitle className="flex items-center gap-2 text-red-700 text-xl">
              <Trash2 size={22} className="text-red-500" />
              تأكيد حذف التصنيف
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-6 text-center text-lg text-gray-700">
            <p className="mb-2 font-semibold">
              هل أنت متأكد أنك تريد حذف التصنيف
              <span className="text-red-600 font-bold mx-1">
                {categories.find((cat) => cat._id === deleteId)?.name || ""}
              </span>
              ؟
            </p>
            <p className="text-sm text-gray-500">
              لا يمكن التراجع عن هذا الإجراء بعد الحذف.
            </p>
          </div>
          <DialogFooter className="bg-gray-50 rounded-b-xl px-6 py-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              className="min-w-[80px]"
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white min-w-[80px]"
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
