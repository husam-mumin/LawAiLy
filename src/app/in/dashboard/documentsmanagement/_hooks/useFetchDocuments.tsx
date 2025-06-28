import { useEffect, useState } from "react";
import axios from "axios";
import { documentType } from "@/models/Documents";
import { useUser } from "@/app/context/UserContext";

export function useFetchDocuments() {
  const [documents, setDocuments] = useState<documentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setDocuments([]);
      return;
    }
    setLoading(true);
    axios
      .get("/api/in/documents", { params: { userId: user._id } })
      .then((res) => {
        setDocuments(res.data);
        setError(null);
      })
      .catch(() => {
        setError("فشل في جلب المستندات");
        setDocuments([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return { documents, setDocuments, loading, error };
}
