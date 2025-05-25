import { useState } from "react";

export default function useSearchBar() {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSearchBar = () => {
    setIsActive((prev) => !prev);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return {
    isActive,
    toggleSearchBar,
    searchQuery,
    handleSearchChange,
  };
}
