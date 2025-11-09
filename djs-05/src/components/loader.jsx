import React from "react";
import "./loader.css";

/**
 * loading spinner.
 * @returns {JSX.Element}A loading spinner.
 */
const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
