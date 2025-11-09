import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

/**
 * Renders the global application header with icon, title, and right-side actions.
 *
 * @returns {JSX.Element} The Header component.
 */
const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-title-link" aria-label="Go to homepage">
          {/* Decorative icon */}
          <span className="header-icon" aria-hidden="true">
            🎙️
          </span>
          <span className="header-title">Podcast App</span>
        </Link>

        {/* Right-side section: search + profile */}
        <div className="header-actions">
          <button className="search-button" aria-label="Search">
            🔍
          </button>
          <img
            className="profile-person"
            src="/profile-person.png"
            alt="Profile"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
