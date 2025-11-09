import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

/**
 * Renders the global application header with an icon and title.
 * The icon is decorative and hidden from assistive technologies.
 *
 * @returns {JSX.Element} Header component.
 */
const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="header-title-link" aria-label="Go to homepage">
          <span className="header-icon" aria-hidden="true">
            🎙️
          </span>

          {/* Main title of the application */}
          <span className="header-title">Podcast App</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
