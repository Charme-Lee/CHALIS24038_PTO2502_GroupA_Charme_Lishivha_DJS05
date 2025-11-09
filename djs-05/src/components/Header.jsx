import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import searchIcon from "../assets/Search-icon.png";
import profileIcon from "../assets/Profile.png";

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
          <img className="profile-person" src={searchIcon} alt="Search" />
          <img className="profile-person" src={profileIcon} alt="Profile" />
        </div>
      </div>
    </header>
  );
};

export default Header;
