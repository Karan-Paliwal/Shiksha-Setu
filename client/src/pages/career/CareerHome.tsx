import React from "react";
import FeatureCard from "../../components/FeatureCard";
import { mockInterviewQuestions } from "../../utils/mockData";

const CareerHome: React.FC = () => {
  return (
    <div className="module-page fade-in">
      <div className="module-header">
        <h1>Career Builder</h1>
        <p>Prepare for placements, build your resume, and track applications.</p>
      </div>

      <div className="module-grid mb-5">
        <FeatureCard
          icon="bi-file-person-fill"
          title="Resume Builder"
          description="Create ATS-friendly resumes using professional templates."
        />
        <FeatureCard
          icon="bi-map-fill"
          title="Skill Roadmap"
          description="Follow step-by-step roadmaps for Full Stack, Data Science, and more."
        />
        <FeatureCard
          icon="bi-check-circle-fill"
          title="Internship Tracker"
          description="Organize your internship applications and track their status."
        />
      </div>

      <div className="row g-4">
        {/* Interview Prep */}
        <div className="col-12">
          <h4 className="mb-3 fs-5 fw-semibold">Interview Question Bank</h4>
          <div className="row g-3">
            {mockInterviewQuestions.map((q) => (
              <div className="col-md-6 col-xl-4" key={q.id}>
                <div className="p-3 border rounded h-100" style={{ borderColor: "var(--ss-border) !important", background: "var(--ss-bg-card)" }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-secondary text-light bg-opacity-25 border border-secondary">{q.category}</span>
                    <span className={`badge-ss ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                  </div>
                  <div className="fw-medium mt-2">{q.question}</div>
                  <button className="btn btn-sm btn-link text-primary p-0 mt-3 text-decoration-none">
                    View Answer <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerHome;
