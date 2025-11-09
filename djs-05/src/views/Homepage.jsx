import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SeasonNavigation from "../components/SeasonNavigation";
import { GENRE_MAP } from "../utils/constants";
import "./ShowDetailPage.css";
// import { formatDate } from "../utils/helpers";

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
 * ShowDetailPage — robust handling for duplicated API data.
 */
const ShowDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const { showId } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
        if (!res.ok)
          throw new Error(`Failed to fetch show ${showId}: ${res.status}`);
        const data = await res.json();
        console.log("🎭 Raw genres from API:", data.genres);

        const genres = Array.isArray(data.genres)
          ? data.genres.map((g) =>
              typeof g === "number" ? GENRE_MAP[g] || `Genre ${g}` : g
            )
          : [];

        // DEBUG: show raw fetched payload (inspect in browser console)
        console.log("🎭 Raw genres from API:", data.genres);

        // Ensure seasons is an array
        const rawSeasons = Array.isArray(data.seasons) ? data.seasons : [];

        // Step 1: dedupe seasons by season number (keep first occurrence)
        const seasonMap = new Map();
        rawSeasons.forEach((s) => {
          // some APIs may give season.season as string/number
          const seasonNum = Number(s?.season);
          if (!seasonMap.has(seasonNum)) {
            seasonMap.set(seasonNum, { ...s, season: seasonNum });
          } else {
            // If duplicate season appears, you might want to merge episodes — merge here
            const existing = seasonMap.get(seasonNum);
            const mergedEpisodes = [
              ...(existing.episodes || []),
              ...(s.episodes || []),
            ];
            existing.episodes = mergedEpisodes;
            seasonMap.set(seasonNum, existing);
          }
        });

        // Convert back to array and sort by season number ascending
        let uniqueSeasons = Array.from(seasonMap.values()).sort(
          (a, b) => a.season - b.season
        );

        // Step 2: dedupe episodes inside each season (by episode number OR file URL)
        uniqueSeasons = uniqueSeasons.map((s) => {
          const epMap = new Map();
          (s.episodes || []).forEach((ep) => {
            // Try to derive a stable episode key: prefer `episode` number, otherwise file, otherwise title
            const epKey = ep?.episode ?? ep?.file ?? ep?.title;
            const key = String(epKey);
            if (!epMap.has(key)) {
              epMap.set(key, ep);
            } else {
              // if duplicate, you could merge fields here; for now keep first
            }
          });
          const deduped = Array.from(epMap.values());

          // Optional: keep episodes sorted by episode number if available
          deduped.sort(
            (a, b) => (Number(a.episode) || 0) - (Number(b.episode) || 0)
          );
          return { ...s, episodes: deduped };
        });

        // DEBUG: show processed seasons and counts
        console.log(
          "✅ Processed seasons (deduped):",
          uniqueSeasons.map((s) => ({
            season: s.season,
            episodesCount: (s.episodes || []).length,
          }))
        );

        // Set default selected season to first available season
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

  // Render guards
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!show) return <ErrorMessage message="Show not found." />;

  // Find season data for currently selected season
  const seasonData = show.seasons.find(
    (s) => Number(s.season) === Number(selectedSeason)
  );

  const renderableGenres = (show.genres || []).map((g) => {
    if (typeof g === "number" && GENRE_MAP[g]) {
      // Handle legacy numeric genres
      return GENRE_MAP[g];
    } else if (typeof g === "string") {
      // Handle new API: already proper strings
      return g;
    } else {
      return "Unknown";
    }
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
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default ShowDetailPage;
