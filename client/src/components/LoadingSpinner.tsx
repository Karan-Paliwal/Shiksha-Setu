import React from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="ls-fullscreen">
        <div className="ss-spinner"></div>
      </div>
    );
  }

  return (
    <div className="spinner-wrapper">
      <div className="ss-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
