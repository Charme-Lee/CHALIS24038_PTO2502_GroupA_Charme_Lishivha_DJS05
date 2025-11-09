import React from "react";

/**
 * Displays an error message with optional troubleshooting guidance.
 * If the error message is a generic fetch failure, the component shows
 * helpful hints for resolving connectivity issues.
 *
 * @param {object} props
 * @param {string} props.message - The error message text.
 * @returns {JSX.Element} Error message component.
 */
const ErrorMessage = ({ message }) => {
  const isGenericFetchError = message?.includes("Fetching data failed");

  const titleStyle = {
    fontSize: "1.1rem",
    fontWeight: 500,
  };

  const messageStyle = {
    marginTop: "0.5rem",
    marginBottom: 0,
    lineHeight: 1.5,
  };
  const containerStyle = {
    color: "#992619ff",
    backgroundColor: "#e7d4d2ff",
    border: "1px solid #8d281dff",
    padding: "1.5rem",
    margin: "2rem auto",
    borderRadius: "8px",
    maxWidth: "600px",
    textAlign: "left",
  };

  const tipsListStyle = {
    paddingLeft: "18px",
    margin: 0,
  };
  const tipsContainerStyle = {
    marginTop: "1rem",
    borderTop: "1px dashed #c0392b",
    paddingTop: "1rem",
  };

  const tipsTitleStyle = {
    fontWeight: 500,
    margin: "0 0 0.5rem 0",
  };

  return (
    <div style={containerStyle}>
      <strong style={titleStyle}>
        {isGenericFetchError ? "Network Connection Error" : "Error Occurred"}
      </strong>

      <p style={messageStyle}>{message}</p>

      {isGenericFetchError && (
        <div style={tipsContainerStyle}>
          <p style={tipsTitleStyle}>Troubleshooting Tips:</p>
          <ul style={tipsListStyle}>
            <li>
              Check your <strong>internet connection</strong>.
            </li>
            <li>Try to refresh the page.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
