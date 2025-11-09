/**
 * @file HomePage.jsx
 * @description Displays the main landing page of the podcast app.
 * Allows users to search, filter by genre, sort shows, and paginate through results.
 */

import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FilterContext } from "../components/filter";
import LoadingSpinner from "../components/loader";
import ErrorMessage from "../components/Errors";
import Pagination from "../components/pagination";
import { GENRE_TITLE } from "../utils/genres";
import "./Homepage.css";

/** Number of podcast shows displayed per page. */
const SHOWS_PER_PAGE = 14;

/**
 * Converts a raw date string (ISO or MM/DD/YYYY) into a readable, localized date format.
 *
 * @param {string} e - Date string from the API.
 * @returns {string} Formatted date string like "November 3, 2025".
 */
function formatDate(e) {
  if (!e) return "";
  let d;

  // Attempt ISO parsing first
  if (!isNaN(Date.parse(e))) {
    d = new Date(e);
  } else {
    // Fallback for non-ISO formats like "10/3/2025"
    const [month, day, year] = e.split(/[\/\-]/).map(Number);
    d = new Date(year, month - 1, day);
  }

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * HomePage Component
 *
 * Renders the main view of all available podcasts. Supports:
 * - Searching by title
 * - Filtering by genre
 * - Sorting alphabetically or by update date
 * - Pagination across all shows
 *
 * @component
 * @returns {JSX.Element} Rendered HomePage component.
 */
const HomePage = () => {
  // 🔸 Local state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allShows, setAllShows] = useState([]);

  // 🔹 Global filter context
  const {
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    genreId,
    setGenreId,
    currentPage,
    setCurrentPage,
  } = useContext(FilterContext);

  /**
   * Fetch all podcast shows from the API once when component mounts.
   */
  useEffect(() => {
    const fetchAllShows = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://podcast-api.netlify.app/");
        if (!res.ok) throw new Error("Data fetching failed");
        const data = await res.json();
        setAllShows(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllShows();
  }, []);

  /**
   * Filters and sorts all shows according to the user’s selected
   * genre, search term, and sorting preference.
   */
  const filteredAndSortedShows = useMemo(() => {
    let shows = [...allShows];

    // Genre filtering
    if (genreId) {
      shows = shows.filter((show) => show.genres.includes(Number(genreId)));
    }

    // Search filtering
    if (searchTerm) {
      shows = shows.filter((show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting options
    switch (sortOrder) {
      case "A-Z":
        shows.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Z-A":
        shows.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "Newest":
        shows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case "Oldest":
        shows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        break;
    }

    return shows;
  }, [allShows, searchTerm, sortOrder, genreId]);

  /**
   * Calculates the subset of shows to display on the current page.
   */
  const paginatedShows = useMemo(() => {
    const startIndex = (currentPage - 1) * SHOWS_PER_PAGE;
    const endIndex = startIndex + SHOWS_PER_PAGE;
    return filteredAndSortedShows.slice(startIndex, endIndex);
  }, [filteredAndSortedShows, currentPage]);

  /** Total number of pages based on filtered results. */
  const totalPageCount = Math.ceil(
    filteredAndSortedShows.length / SHOWS_PER_PAGE
  );

  // 🔹 Event handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    setGenreId(e.target.value ? Number(e.target.value) : null);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  // 🔹 All available genre IDs
  const allGenreIds = Object.keys(GENRE_TITLE);

  // === Render Guards ===
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // === Main Render ===
  return (
    <main className="homepage">
      {/* === Control Panel === */}
      <section className="control-panel">
        {/* Search Input */}
        <div className="search-container">
          <input
            type="text"
            id="search-input"
            name="search-input"
            className="control-input"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Genre + Sort Dropdowns */}
        <div className="control-group">
          <select
            id="genre-select"
            name="genre-select"
            className="control-select"
            value={genreId || ""}
            onChange={handleGenreChange}
          >
            <option value="">All Genres</option>
            {allGenreIds.map((id) => (
              <option key={id} value={id}>
                {GENRE_TITLE[id]}
              </option>
            ))}
          </select>

          <select
            id="sort-select"
            name="sort-select"
            className="control-select"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="A-Z">Sort: A–Z</option>
            <option value="Z-A">Sort: Z–A</option>
            <option value="Newest">Sort: Newest</option>
            <option value="Oldest">Sort: Oldest</option>
          </select>
        </div>
      </section>

      {/* === Podcast Grid === */}
      <section className="podcast-grid">
        {paginatedShows.length > 0 ? (
          paginatedShows.map((show) => (
            <Link
              to={`/show/${show.id}`}
              key={show.id}
              className="podcast-card"
            >
              <img
                src={show.image}
                alt={`${show.title} cover`}
                className="podcast-image"
              />
              <div className="card-content">
                <h3 className="podcast-title">{show.title}</h3>
                <p className="podcast-seasons">Seasons: {show.seasons}</p>
                <p className="podcast-genre">
                  Genres:{" "}
                  {show.genres
                    .map((id) => GENRE_TITLE[id] || "Unknown")
                    .join(", ")}
                </p>
                <p className="podcast-updated">
                  Last Updated: {formatDate(show.updated)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results">No shows found on your current filters.</p>
        )}
      </section>

      {/* === Pagination === */}
      <section className="pagination-controls">
        <Pagination
          currentPage={currentPage}
          totalPageCount={totalPageCount}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
};

export default HomePage;
