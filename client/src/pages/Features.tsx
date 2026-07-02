import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Features: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      iconClass: "bi-shield-lock",
      bgClass: "lp-icon-blue",
      title: "Core Authentication",
      desc: "Secure JWT login, mandatory smart onboarding for incomplete profiles, and dynamic avatar generation.",
    },
    {
      iconClass: "bi-file-earmark-text",
      bgClass: "lp-icon-indigo",
      title: "AI Marksheet Scanner",
      desc: "Upload marksheet images for a 5-step AI vision process extracting semester SGPAs and CGPAs automatically.",
    },
    {
      iconClass: "bi-graph-up",
      bgClass: "lp-icon-cyan",
      title: "Academic Analytics Hub",
      desc: "Interactive SVG line charts for GPA trends, predicted degree CGPA, and semester improvement rates.",
    },
    {
      iconClass: "bi-calendar-week",
      bgClass: "lp-icon-emerald",
      title: "Schedule Manager",
      desc: "Modal-driven weekly timetable to easily map out and track your classes, times, and locations.",
    },
    {
      iconClass: "bi-search",
      bgClass: "lp-icon-violet",
      title: "Smart Global Search",
      desc: "Top navbar search bar that contextually routes you to modules based on keywords like 'cv' or 'mock'.",
    },
    {
      iconClass: "bi-patch-check",
      bgClass: "lp-icon-pink",
      title: "ATS Resume Builder",
      desc: "Create single-column, ATS-compliant resumes with conditional fresher logic and searchable PDF export.",
    },
    {
      iconClass: "bi-stars",
      bgClass: "lp-icon-blue",
      title: "AI Study Assistant",
      desc: "Conversational AI tutor for instant doubt solving, study guides, and personalized revision flashcards.",
    },
    {
      iconClass: "bi-briefcase",
      bgClass: "lp-icon-indigo",
      title: "Opportunities Tracker",
      desc: "Match with national scholarships and track internship or job applications with a status dashboard.",
    },
    {
      iconClass: "bi-laptop",
      bgClass: "lp-icon-cyan",
      title: "Skill Development",
      desc: "Explore expert-curated learning roadmaps, integrated course players, and interview question banks.",
    }
  ];

  return (
    <div className="landing-page fade-in">
      <nav className="navbar navbar-expand-lg navbar-light lp-navbar position-sticky top-0 z-3 border-bottom px-3 px-md-5 py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/final-logo.png" alt="Shiksha Setu Logo" style={{ height: "36px", width: "36px", objectFit: "cover", borderRadius: "8px" }} />
            <span className="fw-bold fs-4 text-ss-primary">Shiksha Setu</span>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <button className="btn fw-semibold text-ss-text hover-primary" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn-ss-primary px-4" onClick={() => navigate("/login")}>Join Shiksha Setu</button>
          </div>
        </div>
      </nav>

      <section className="lp-features-section" style={{ minHeight: 'calc(100vh - 85px)' }}>
        <div className="container py-5">
          <div className="text-center mb-5 px-3">
            <h2 className="lp-section-title mb-2">All Features</h2>
            <p className="lp-section-subtitle mb-0 mx-auto">
              Explore everything Shiksha Setu has to offer in one place.
            </p>
          </div>

          <div className="row g-4 px-3">
            {features.map((feature, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={idx}>
                <div className="lp-feature-card h-100">
                  <div className={`lp-feature-icon-box ${feature.bgClass}`}>
                    <i className={`bi ${feature.iconClass}`}></i>
                  </div>
                  <h3 className="lp-feature-title">{feature.title}</h3>
                  <p className="lp-feature-desc">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
