"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { documentType } from "@/models/Documents";
import { documentColumns, DocumentRow } from "./_components/document-columns";
import { DataTable1 } from "@/components/tables/dataTable1";
import { AddDocumentPopup } from "./_components/AddDocumentPopup";
import { log } from "console";

export default function DocumentsManagement() {
  const [documents, setDocuments] = useState<documentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [fileUrl, setFileUrl] = React.useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await axios.get("/api/in/documents");
      setDocuments(res.data);
      setError("");
    } catch {
      setError("فشل في جلب المستندات");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddDocument(doc: {
    title: string;
    url: string;
    description: string;
    showup: boolean;
    addBy: string;
  }) {
    try {
      const res = await axios.post("/api/in/documents", doc);
      setDocuments([...documents, res.data.document]);
    } catch (error) {
      console.error(error);
      setError("فشل في إضافة المستند");
    }
  }

  async function handleDelete(id: string) {
    try {
      await axios.delete(`/api/in/documents/${id}`);
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch {
      setError("فشل في حذف المستند");
    }
  }

  const handleEdit = useCallback(
    async (id: string, editDocument: documentType) => {
      console.log("Editing document with ID:", id);

      // Update the document in the state
      try {
        const res = await axios.put(`/api/in/documents`, {
          id: id,
          title: editDocument.title,
          description: editDocument.description,
          showup: editDocument.showUp,
          addBy: editDocument.addedBy,
          url: editDocument.documentURL,
        });
        setDocuments(
          documents.map((doc) =>
            doc._id === id ? { ...doc, ...res.data } : doc
          )
        );
      } catch {
        setError("فشل في تعديل المستند");
      }
    },
    [documents]
  );

  // Map documents to DocumentRow and add handlers
  const rows: DocumentRow[] = useMemo(
    () =>
      documents.map((doc) => {
        console.log("Mapping document:", doc._id);

        return {
          documentURL: doc.documentURL,
          createdAt: doc.createdAt,
          showUp: doc.showUp,
          addedBy: doc.addedBy,
          _id: doc._id,
          title: doc.title,
          description: doc.description,
          onEdit: (row) => {
            handleEdit(row._id, {
              title: row.title,
              description: row.description,
              showUp: row.showUp,
              addedBy: row.addedBy,
              documentURL: row.documentURL,
              _id: row._id,
              createdAt: row.createdAt,
            });
          },
          onDelete: (id) => {
            handleDelete(id);
          },
        };
      }),
    [documents, handleEdit, handleDelete]
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">إدارة المستندات</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-6 flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setAddOpen(true)}
        >
          إضافة مستند
        </button>
      </div>
      <AddDocumentPopup
        open={addOpen}
        setFileUrl={setFileUrl}
        onClose={() => {
          setAddOpen(false);
        }}
        fileUrl={fileUrl}
        onAdd={handleAddDocument}
      />
      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <DataTable1 columns={documentColumns} data={rows} />
      )}
    </div>
  );
}
