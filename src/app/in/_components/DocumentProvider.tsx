"use client";
import { documentType } from "@/models/Documents";
import { useEffect, useState, createContext } from "react";

interface DocumentContextType {
  filter: string;
  setFilter: (filter: string) => void;
  sort: string;
  setSort: (sort: string) => void;
  search: string;
  setSearch: (search: string) => void;
  filteredDocuments: documentType[];
  openNot: boolean;
  setOpenNot: (open: boolean) => void;
}

export const DocumentContext = createContext<DocumentContextType>({
  filter: "",
  setFilter: () => {},
  sort: "date",
  setSort: () => {},
  search: "",
  setSearch: () => {},
  filteredDocuments: [],
  openNot: false,
  setOpenNot: () => {},
});

export const DocumentProvider = ({
  children,
  documents = [],
}: {
  children: React.ReactNode;
  documents?: documentType[];
}) => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("date");
  const [search, setSearch] = useState("");
  const [documentsState, setDocumentsState] = useState<documentType[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<documentType[]>(
    []
  );
  const [openNot, setOpenNot] = useState(false);

  useEffect(() => {
    const savedFilter = localStorage.getItem("documentFilter") || "";
    const savedSort = localStorage.getItem("documentSort") || "date";
    const savedSearch = localStorage.getItem("documentSearch") || "";

    setFilter(savedFilter);
    setSort(savedSort);
    setSearch(savedSearch);
    setDocumentsState(documents.length > 0 ? documents : []);
  }, [documents]);

  useEffect(() => {
    setFilteredDocuments(
      documentsState.length > 0
        ? documentsState.filter((document) =>
            document.title.toLowerCase().includes(filter.trim().toLowerCase())
          )
        : []
    );
  }, [filter, documentsState]);

  return (
    <DocumentContext.Provider
      value={{
        filter,
        setFilter,
        sort,
        setSort,
        search,
        setSearch,
        filteredDocuments,
        openNot,
        setOpenNot,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
