import React from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page fade-in">
      <nav className="d-flex justify-content-between align-items-center py-4 px-5 bg-white border-bottom position-sticky top-0 z-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-hexagon-fill text-ss-primary fs-4"></i>
          <span className="fw-bold fs-5 text-ss-primary">Shiksha Setu</span>
        </div>
        <div className="d-none d-md-flex gap-4 fw-medium text-ss-text">
          <a href="#features" className="text-decoration-none text-ss-text hover-primary">Features</a>
          <a href="#scholarships" className="text-decoration-none text-ss-text hover-primary">Scholarships</a>
          <a href="#success" className="text-decoration-none text-ss-text hover-primary">Success Stories</a>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <button className="btn fw-medium text-ss-text" onClick={() => navigate("/login")}>Log in</button>
          <button className="btn-ss-primary" onClick={() => navigate("/signup")}>Join Shiksha Setu</button>
        </div>
      </nav>

      <section className="landing-hero container d-flex flex-column align-items-center text-center py-5 mt-5">
        <div className="badge rounded-pill bg-light border text-ss-primary px-3 py-2 mb-4 d-inline-flex align-items-center gap-2">
          <span>🚀</span>
          <span className="fw-medium lp-badge-text">NEW: AI Resume Builder Integrated</span>
        </div>
        
        <h1 className="fw-black mb-4 lp-hero-title">
          Connecting Students to <br/>
          <span className="text-ss-primary fst-italic">Opportunities.</span>
        </h1>
        
        <p className="text-ss-muted mb-5 mx-auto fs-5 lp-hero-subtitle">
          Shiksha Setu is the ultimate bridge between your academic journey and professional career. Track grades, find scholarships, and leverage AI to unlock your full potential.
        </p>
        
        <div className="d-flex gap-3 justify-content-center mb-5 pb-5">
          <button className="btn-ss-primary btn-lg px-5 py-3 fs-5" onClick={() => navigate("/signup")}>
            Get Started for Free
          </button>
          <button className="btn-ss-outline btn-lg px-5 py-3 fs-5 bg-white shadow-sm" onClick={() => navigate("/login")}>
            Watch Demo
          </button>
        </div>

        {/* Floating Card & Mockup Section */}
        <div className="position-relative w-100 mx-auto lp-mockup-container">
          {/* Glassmorphism Floating Card */}
          <div className="position-absolute bg-white bg-opacity-75 shadow-lg rounded-4 p-3 d-flex align-items-center gap-3 lp-floating-card">
            <div className="bg-light rounded-circle p-2">
              <i className="bi bi-trophy text-secondary fs-5"></i>
            </div>
            <div className="text-start">
              <div className="text-uppercase text-secondary fw-bold lp-card-eyebrow">Scholarship Won</div>
              <div className="fw-bold fs-5 text-dark">$12,500 Merit Award</div>
            </div>
          </div>

          {/* Dummy UI Mockup Image (CSS placeholder) */}
          <div className="w-100 rounded-top-4 overflow-hidden border shadow-sm lp-mockup-window">
            {/* Window header */}
            <div className="w-100 d-flex gap-2 p-3 bg-dark border-bottom border-secondary">
               <div className="rounded-circle bg-danger lp-window-btn"></div>
               <div className="rounded-circle bg-warning lp-window-btn"></div>
               <div className="rounded-circle bg-success lp-window-btn"></div>
            </div>
            {/* Content */}
            <div className="p-4 d-flex">
              <div className="border border-secondary rounded p-3 w-25 lp-mockup-content">
                <div className="text-info fw-bold mb-3">SHIKSHA SETU</div>
                <div className="text-light fs-6">Academic Tracking</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
