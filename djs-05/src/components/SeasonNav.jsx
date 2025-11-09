/**
 * @file SeasonNav.jsx
 * @description Displays season details and a list of episodes for a podcast show.
 *              Allows the user to switch between available seasons using a dropdown selector.
 */

import React, { useState } from "react";
import "./SeasonNav.css";

/**
 *
 * Provides a dropdown for selecting seasons and displays all episodes
 * for the selected season, including images, titles, descriptions, and play links.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.seasons - Array of season objects retrieved from the API.
 * Each season object should include:
 *  - {string} title - The season title.
 *  - {string} image - The season cover image.
 *  - {Array<Object>} episodes - List of episode objects with `title`, `description`, and `file`.
 * @returns {JSX.Element} Rendered SeasonNavigation component.
 */
const SeasonNavigation = ({ seasons }) => {
  // 🔸 Normalize incoming seasons to ensure a safe array
  const safeSeasons = Array.isArray(seasons) ? seasons : [];

  // 🔹 Track currently selected season index
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(
    safeSeasons.length > 0 ? 0 : -1
  );

  /**
   * Handles season selection changes from the dropdown menu.
   *
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Change event triggered when the user selects a season.
   */
  const handleSeasonChange = (event) => {
    setSelectedSeasonIndex(Number(event.target.value));
  };

  // 🔸 Retrieve data for the currently selected season
  const currentSeason = safeSeasons[selectedSeasonIndex];

  // 🧩 Handle cases where there is no valid season data
  if (safeSeasons.length === 0 || !currentSeason) {
    return (
      <p className="no-data-message">
        This show currently has no detailed season or episode information.
      </p>
    );
  }

  // 🔹 Safely access episodes array
  const currentEpisodes = Array.isArray(currentSeason.episodes)
    ? currentSeason.episodes
    : [];

  return (
    <div className="season-navigation">
      {/* === Season Header & Selector === */}
      <div className="season-header">
        <h2 className="season-title">{currentSeason.title}</h2>

        <select
          id="season-select"
          name="season-select"
          className="season-select"
          aria-label="Select a season"
          value={selectedSeasonIndex}
          onChange={handleSeasonChange}
        >
          {safeSeasons.map((season, index) => (
            <option key={index} value={index}>
              {season.title}
            </option>
          ))}
        </select>
      </div>

      {/* === Episode List === */}
      <div className="episode-list">
        {currentEpisodes.length > 0 ? (
          currentEpisodes.map((episode) => (
            <div key={episode.episode} className="episode-card">
              {/* Episode Thumbnail */}
              <img
                src={currentSeason.image}
                alt={currentSeason.title}
                className="episode-image"
              />

              {/* Episode Details */}
              <div className="episode-content">
                <h3 className="episode-title">
                  {episode.episode}. {episode.title}
                </h3>

                <p className="episode-description">
                  {episode.description || "No description available."}
                </p>

                {/* Episode Metadata */}
                <div className="episode-meta">
                  <span className="episode-duration">
                    {Math.floor(Math.random() * 30) + 20} min
                  </span>
                  <span className="separator"> • </span>
                  <span className="episode-date">
                    {currentSeason.updated
                      ? new Date(currentSeason.updated).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "Release Date Unknown"}
                  </span>
                </div>

                {/* Play Button */}
                <p>
                  <a
                    href={episode.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="episode-play-btn"
                  >
                    ▶️ Play Episode
                  </a>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-episodes-message">
            No episodes found for this season.
          </p>
        )}
      </div>
    </div>
  );
};

export default SeasonNavigation;
