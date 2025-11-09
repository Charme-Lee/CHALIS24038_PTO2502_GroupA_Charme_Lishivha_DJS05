import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FilterContext } from "../components/filter";
import LoadingSpinner from "../components/loader";
import ErrorMessage from "../components/Errors";
// import formatDates from "../utils/helpers";
import Pagination from "../components/pagination";
import { GENRE_MAP } from "../utils/genres";

import "./Homepage.css";

// How many shows to display per page (7 cards x 2 rows = 14)
const SHOWS_PER_PAGE = 14;

// Date formatter

/** Format ISO string like "3 November 2022" */
function formatDate(e) {
  if (!e) return "";
  let d;

  // Try parsing ISO format first
  if (!isNaN(Date.parse(e))) {
    d = new Date(e);
  } else {
    // Fallback for formats like "10/3/2025"
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
 * Renders the home page, which displays a searchable, filterable,
 * and sortable list of all podcast shows with pagination.
 *
 * @returns {JSX.Element} The HomePage component.
 */
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allShows, setAllShows] = useState([]);
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

  const filteredAndSortedShows = useMemo(() => {
    let shows = [...allShows];

    if (genreId) {
      shows = shows.filter((show) => show.genres.includes(Number(genreId)));
    }
    if (searchTerm) {
      shows = shows.filter((show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    if (sortOrder === "A-Z") {
      shows.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "Z-A") {
      shows.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOrder === "Newest") {
      shows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    } else if (sortOrder === "Oldest") {
      shows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    }
    return shows;
  }, [allShows, searchTerm, sortOrder, genreId]);

  const paginatedShows = useMemo(() => {
    const startIndex = (currentPage - 1) * SHOWS_PER_PAGE;
    const endIndex = startIndex + SHOWS_PER_PAGE;
    return filteredAndSortedShows.slice(startIndex, endIndex);
  }, [filteredAndSortedShows, currentPage]);

  const totalPageCount = Math.ceil(
    filteredAndSortedShows.length / SHOWS_PER_PAGE
  );

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

  const allGenreIds = Object.keys(GENRE_MAP);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main>
      {/* --- Control Panwl--- */}
      <div className="control-panel">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title..."
            className="control-input"
            value={searchTerm}
            onChange={handleSearchChange}
            id="search-input"
            name="search-input"
          />
        </div>
        <div className="control-group">
          {" "}
          <select
            className="control-select"
            value={genreId || ""}
            onChange={handleGenreChange}
            id="genre-select"
            name="genre-select"
          >
            <option value="">All Genres</option>
            {allGenreIds.map((id) => (
              <option key={id} value={id}>
                {GENRE_MAP[id]}
              </option>
            ))}
          </select>
          <select
            className="control-select"
            value={sortOrder}
            onChange={handleSortChange}
            id="sort-select"
            name="sort-select"
          >
            <option value="A-Z">Sort: A-Z</option>
            <option value="Z-A">Sort: Z-A</option>
            <option value="Newest">Sort: Newest</option>
            <option value="Oldest">Sort: Oldest</option>
          </select>
        </div>
      </div>

      {/* --- Podcast Grid --- */}
      <div className="podcast-grid">
        {" "}
        {/* Changed class */}
        {paginatedShows.length > 0 ? (
          paginatedShows.map((show) => (
            <Link
              to={`/show/${show.id}`}
              key={show.id}
              className="podcast-card"
            >
              {" "}
              <img
                src={show.image}
                alt={`${show.title} cover`}
                className="podcast-image"
              />{" "}
              {/* Changed class */}
              <div className="card-content">
                {" "}
                {/* Changed class */}
                <h3 className="podcast-title">{show.title}</h3>{" "}
                {/* Changed class */}
                <p className="podcast-seasons">Seasons: {show.seasons}</p>{" "}
                {/* Changed class */}
                <p className="podcast-genre">
                  Genres:{" "}
                  {show.genres
                    .map((id) => GENRE_MAP[id] || "Unknown")
                    .join(", ")}
                </p>
                <p className="podcast-updated">
                  Last Updated: {formatDate(show.updated)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No shows found for your current filters.</p>
        )}
      </div>

      {/* --- PAGINATION --- */}
      <div className="pagination-controls">
        <Pagination
          currentPage={currentPage}
          totalPageCount={totalPageCount}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
};

export default HomePage;
