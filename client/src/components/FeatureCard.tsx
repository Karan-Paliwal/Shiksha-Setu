import React from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  actionText = "Explore",
  onAction,
}) => {
  return (
    <div className="feature-card slide-up">
      <div className="feature-card-icon">
        <i className={`bi ${icon} text-primary`}></i>
      </div>
      <h5>{title}</h5>
      <p>{description}</p>
      {onAction && (
        <button className="btn btn-outline-primary btn-sm mt-2" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default FeatureCard;
