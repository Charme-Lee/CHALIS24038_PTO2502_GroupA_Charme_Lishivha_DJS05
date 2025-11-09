import React from "react";
import "./Pagination.css";

/**
 * Displays pagination controls for navigating between multiple pages.
 *
 *  @param {number} props.totalPageCount - Total number of pages available.
 * @param {function} props.onPageChange - Callback triggered when the user switches pages.
 * @returns {JSX.Element|null} The pagination controls, or null if only one page exists.
 * @param {object} props
 * @param {number} props.currentPage - The currently active page number.
 */

const Pagination = ({ currentPage, totalPageCount, onPageChange }) => {
  // If there's only one page or less, no need to show pagination
  if (totalPageCount <= 1) return null;

  return (
    <div className="pagination-container">
      {/* Previous Page Button */}
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1} // Disable if already on first page
      >
        &larr; Previous
      </button>

      {/* Display current page and total pages */}
      <span className="pagination-info">
        Page {currentPage} of {totalPageCount}
      </span>

      {/* Next Page Button */}
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPageCount}
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;
