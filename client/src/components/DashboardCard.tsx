import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCardData } from "../types";

const DashboardCard: React.FC<DashboardCardData> = ({
  icon,
  title,
  description,
  path,
  color,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="dash-card slide-up"
      style={{ "--card-accent": color } as React.CSSProperties}
      onClick={() => navigate(path)}
    >
      <div
        className="dash-card-icon"
        style={{
          background: color.includes("gradient") ? color : `linear-gradient(135deg, ${color}99, ${color})`,
        }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <h3 className="dash-card-title">{title}</h3>
      <p className="dash-card-desc">{description}</p>
      <button className="dash-card-btn mt-3">Open Module</button>
    </div>
  );
};

export default DashboardCard;
