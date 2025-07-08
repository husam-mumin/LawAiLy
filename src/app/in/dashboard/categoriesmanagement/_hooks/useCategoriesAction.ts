'use client';
import { useEffect, useState } from "react";
import { categoryType } from "@/models/Category";
import axios from "axios";

export function useCategoriesAction(initialCategories: categoryType[] = []) {
  const [categories, setCategories] = useState<categoryType[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories on initial load
    fetchCategories();
  }
  , []);
  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, noneCountRes] = await Promise.all([
        axios.get("/api/dashboard/categories"),
        axios.get("/api/in/documents?noneCategoryCount=1")
      ]);
      const noneCategory: categoryType = {
        _id: "0",
        name: "بدون تصنيف",
        description: "هذا للمستندات غير المصنفة",
        count: noneCountRes.data.noneCategoryCount || 0
      };
      const listofCategories = [noneCategory, ...(categoriesRes.data.data || [])];
      setCategories(listofCategories || []);
      setLoading(false);
    } catch (e: unknown) {
      setError((e as Error).message || "حدث خطأ أثناء الجلب");
      setLoading(false);
    }
  };

  // Add a new category
  const addCategory = async (category: Omit<categoryType, "_id">) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/dashboard/categories", category);
      setCategories((prev) => [...prev, res.data.data]);
      setLoading(false);
      return res.data.data;
    } catch (e: unknown) {
      setError((e as Error).message || "حدث خطأ أثناء الإضافة");
      setLoading(false);
      return null;
    }
  };

  // Edit a category
  const editCategory = async (id: string, updates: Partial<Omit<categoryType, "_id">>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put("/api/dashboard/categories", { _id: id, ...updates });
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? res.data.data : cat))
      );
      setLoading(false);
      return true;
    } catch (e: unknown) {
      setError((e as Error).message || "حدث خطأ أثناء التعديل");
      setLoading(false);
      return false;
    }
  };

  // Remove a category
  const removeCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete("/api/dashboard/categories", { data: { _id: id } });
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setLoading(false);
      return true;
    } catch (e: unknown) {
      setError((e as Error).message || "حدث خطأ أثناء الحذف");
      setLoading(false);
      return false;
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
    setCategories, // for manual updates if needed
  };
}
