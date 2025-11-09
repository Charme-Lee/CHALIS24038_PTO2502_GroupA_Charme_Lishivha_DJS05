import React, { createContext, useState, useMemo } from "react";

/**
 * Global context that stores filter-related UI states.
 * This allows multiple components to read/update shared settings.
 */
export const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  // Selected genre ID (null means “no genre filter active”)
  const [genreId, setGenreId] = useState(null);

  // Tracks which page of results is currently shown
  const [currentPage, setCurrentPage] = useState(1);

  // Text user types into the search input
  const [searchTerm, setSearchTerm] = useState("");

  // Sorting mode (Alphabetical by default)
  const [sortOrder, setSortOrder] = useState("A-Z");

  /**
   * Restores all filters to their initial/default values.
   * Useful when user wants to start fresh.
   */
  const clearFilters = () => {
    setSearchTerm("");
    setSortOrder("A-Z");
    setGenreId(null);
    setCurrentPage(1); // Reset pagination as well
  };

  /**
   * Memoized context object to avoid unnecessary re-renders.
   * Recalculated only when one of its dependencies changes.
   */
  const contextValue = useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      sortOrder,
      setSortOrder,
      genreId,
      setGenreId,
      currentPage,
      setCurrentPage,
      clearFilters,
    }),
    [searchTerm, sortOrder, genreId, currentPage] // updated dependencies
  );

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
