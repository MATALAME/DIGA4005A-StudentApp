import React from "react";
import "../Styling/LoadingOverlay.css";

const LoadingOverlay = ({ text = "Loading..." }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingOverlay;
