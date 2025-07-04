import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { documentType } from "@/models/Documents";

export function useDocumentActions(initialDocuments: documentType[] = []) {
  const [documents, setDocuments] = useState<documentType[]>(initialDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      refresh();
  } , []);

  const refresh = useCallback(async () => {
    
    setLoading(true);
    try {
      const res = await axios.get("/api/in/documents");
      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid response format");
      }
      if (res.data.length === 0) {
        setDocuments([]);
        setError("لا توجد مستندات متاحة");
        return;
      }
      
      setDocuments(res.data);
      setError(null);
      
    } catch {
      setError("فشل في جلب المستندات");
    } finally {
      setLoading(false);
    }
  }, []);

  const add = useCallback(async (doc: Partial<documentType>) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/in/documents", {
        ...doc,
        addedBy: doc.addedBy?._id || "غير معروف",
      });
      setDocuments((prev) => [...prev, res.data.document]);
      setError(null);
      return true;
    } catch {
      setError("فشل في إضافة المستند");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const edit = useCallback(async (updatedDoc: documentType) => {
    setLoading(true);
    try {
      const res = await axios.put("/api/in/documents", updatedDoc);
      setDocuments((prev) =>
        prev.map((doc) => (doc._id === updatedDoc._id ? res.data.document : doc))
      );
      setError(null);
      return true;
    } catch {
      setError("فشل في تعديل المستند");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    
    try {
      const res = await axios.delete("/api/in/documents", { data: { id: id } });
      if(res.status !== 200) {
        throw new Error("فشل في حذف المستند");
      }
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      setError(null);
      return true;
    } catch {
      setError("فشل في حذف المستند");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, loading, error, refresh, add, edit, remove, setDocuments };
}