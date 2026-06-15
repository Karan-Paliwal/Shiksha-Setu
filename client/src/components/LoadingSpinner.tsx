import React from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--ss-bg)",
        }}
      >
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
