/**
 * @file EpisodePage.jsx
 * @description Displays detailed information about a podcast show, including genres, description,
 *              and a list of deduplicated seasons and episodes. Handles API fetching, deduplication,
 *              and graceful error states.
 */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/loader";
import ErrorMessage from "../components/Errors";
import SeasonNavigation from "../components/SeasonNav";
import { GENRE_TITLE } from "../utils/genres";
import "./EpisodePage.css";

/**
 * Converts a raw date string (ISO or MM/DD/YYYY) into a readable, localized format.
 *
 * @param {string} e - Raw date string from API.
 * @returns {string} A formatted date string like "October 3, 2025", or an empty string if invalid.
 */
function formatDate(e) {
  if (!e) return "";
  let d;

  // Parsing ISO format first
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
 * EpisodePage — Displays a single show's detailed information and its episodes.
 * Fetches data from the API, deduplicates seasons and episodes, and manages loading/error states.
 *
 * @component
 * @returns {JSX.Element} Rendered EpisodePage component.
 */
const EpisodePage = () => {
  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(true);
  /** @type {[string|null, Function]} */
  const [error, setError] = useState(null);
  /** @type {[number|null, Function]} */
  const [selectedSeason, setSelectedSeason] = useState(null);
  /** @type {Object} */
  const { showId } = useParams();
  /** @type {[Object|null, Function]} */
  const [show, setShow] = useState(null);

  /**
   * Fetches show details and normalizes the data structure.
   * Deduplicates seasons and episodes by their numeric identifiers or fallback keys.
   */
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
        if (!res.ok)
          throw new Error(`Failed to fetch show ${showId}: ${res.status}`);

        const data = await res.json();
        console.log("🎭 Raw genres from API:", data.genres);

        // Convert numeric genre IDs to human-readable strings
        const genres = Array.isArray(data.genres)
          ? data.genres.map((g) =>
              typeof g === "number" ? GENRE_TITLE[g] || `Genre ${g}` : g
            )
          : [];

        // Ensure seasons is an array
        const rawSeasons = Array.isArray(data.seasons) ? data.seasons : [];

        // 🔹 Step 1: Deduplicate seasons by season number (merge duplicates)
        const seasonMap = new Map();
        rawSeasons.forEach((s) => {
          const seasonNum = Number(s?.season);
          if (!seasonMap.has(seasonNum)) {
            seasonMap.set(seasonNum, { ...s, season: seasonNum });
          } else {
            const existing = seasonMap.get(seasonNum);
            const mergedEpisodes = [
              ...(existing.episodes || []),
              ...(s.episodes || []),
            ];
            existing.episodes = mergedEpisodes;
            seasonMap.set(seasonNum, existing);
          }
        });

        // Sort deduped seasons
        let uniqueSeasons = Array.from(seasonMap.values()).sort(
          (a, b) => a.season - b.season
        );

        // 🔹 Step 2: Deduplicate episodes within each season
        uniqueSeasons = uniqueSeasons.map((s) => {
          const epMap = new Map();
          (s.episodes || []).forEach((ep) => {
            const epKey = ep?.episode ?? ep?.file ?? ep?.title;
            const key = String(epKey);
            if (!epMap.has(key)) {
              epMap.set(key, ep);
            }
          });
          const deduped = Array.from(epMap.values());
          deduped.sort(
            (a, b) => (Number(a.episode) || 0) - (Number(b.episode) || 0)
          );
          return { ...s, episodes: deduped };
        });

        console.log(
          "✅ Processed seasons (deduped):",
          uniqueSeasons.map((s) => ({
            season: s.season,
            episodesCount: (s.episodes || []).length,
          }))
        );

        // Default season selection
        const defaultSeason =
          uniqueSeasons.length > 0 ? uniqueSeasons[0].season : null;

        setShow({
          ...data,
          genres,
          seasons: uniqueSeasons,
        });

        setSelectedSeason((prev) => (prev == null ? defaultSeason : prev));
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching show details:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  // 🔹 Render guards
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!show) return <ErrorMessage message="Show not found." />;

  // Current season
  const seasonData = show.seasons.find(
    (s) => Number(s.season) === Number(selectedSeason)
  );

  // Resolve human-readable genres
  const renderableGenres = (show.genres || []).map((g) => {
    if (typeof g === "number" && GENRE_TITLE[g]) return GENRE_TITLE[g];
    if (typeof g === "string") return g;
    return "Unknown";
  });

  return (
    <main className="show-detail-page">
      <Link to="/" className="back-link">
        &larr; Back
      </Link>

      <div className="show-header-card">
        <img
          src={show.image}
          alt={`${show.title} cover`}
          className="show-image-main"
        />

        <div className="show-header-content">
          <h1 className="show-title-main">{show.title}</h1>
          <p className="show-description">{show.description}</p>

          <div className="show-meta-grid">
            <div className="chip-row">
              <strong>Genres</strong>
              <div className="chip-container">
                {renderableGenres.map((genre, index) => (
                  <span key={index} className="chip">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <strong>Last Updated</strong>
              <p>{formatDate(show.updated)}</p>
            </div>

            <div>
              <strong>Total Seasons</strong>
              <p>{show.seasons.length}</p>
            </div>

            <div>
              <strong>Total Episodes</strong>
              <p>
                {show.seasons.reduce(
                  (acc, s) => acc + (s.episodes?.length || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="season-section">
        <SeasonNavigation
          seasons={show.seasons}
          selectedSeason={selectedSeason}
          onSeasonSelect={(s) => setSelectedSeason(Number(s))}
        />

        <div className="episode-list">
          {!seasonData ? (
            <p>No season selected or data available.</p>
          ) : (
            seasonData.episodes.map((episode, idx) => {
              const key = episode?.episode ?? episode?.file ?? `idx-${idx}`;
              return (
                <div key={key} className="episode-item">
                  <h3>
                    Episode {episode.episode || idx + 1}: {episode.title}
                  </h3>
                  <p>{episode.description}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default EpisodePage;
