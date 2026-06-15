import React from "react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page fade-in">
      <section className="landing-hero">
        <h1 className="landing-logo">ShikshaSetu</h1>
        <p className="landing-tagline">
          The all-in-one AI-powered student companion platform. Simplify your journey
          from admission to employment with our unified dashboard.
        </p>
        <div className="landing-actions">
          <button className="btn-ss-primary" onClick={() => navigate("/signup")}>
            Get Started
          </button>
          <button className="btn-ss-outline" onClick={() => navigate("/login")}>
            Student Login
          </button>
        </div>
      </section>

      <section className="landing-features" id="features">
        <h2>Everything You Need in One Place</h2>
        <div className="features-grid">
          <div className="feature-card text-center">
            <i className="bi bi-journal-bookmark-fill fs-1" style={{ color: "var(--ss-academics)" }}></i>
            <h4 className="mt-3">Academic Planner</h4>
            <p className="text-muted">Track attendance, predict CGPA, and plan your study schedule.</p>
          </div>
          <div className="feature-card text-center">
            <i className="bi bi-robot fs-1" style={{ color: "var(--ss-ai)" }}></i>
            <h4 className="mt-3">AI Study Assistant</h4>
            <p className="text-muted">Prepare for vivas, summarize notes, and solve complex doubts instantly.</p>
          </div>
          <div className="feature-card text-center">
            <i className="bi bi-briefcase-fill fs-1" style={{ color: "var(--ss-opportunities)" }}></i>
            <h4 className="mt-3">Opportunities Hub</h4>
            <p className="text-muted">Find scholarships, government schemes, and education loans.</p>
          </div>
          <div className="feature-card text-center">
            <i className="bi bi-rocket-takeoff-fill fs-1" style={{ color: "var(--ss-career)" }}></i>
            <h4 className="mt-3">Career Builder</h4>
            <p className="text-muted">Build resumes, practice interviews, and track internship applications.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
