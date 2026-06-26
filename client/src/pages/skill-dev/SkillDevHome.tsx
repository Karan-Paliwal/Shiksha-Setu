import React from "react";
import "./SkillDevHome.css";

const SkillDevHome: React.FC = () => {
  return (
    <div className="fade-in pb-5">
      <div className="row g-4">
        {/* Main Content Area (Left) */}
        <div className="col-lg-8 pe-lg-4">
          
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 className="fw-bold text-dark mb-2 sd-hub-title">Skill Development Hub</h1>
              <p className="text-secondary fs-6 mb-0 sd-hub-subtitle">
                Master industry-relevant skills, track your learning journey, and earn verified certifications.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-light border d-flex align-items-center gap-2 fw-medium shadow-sm">
                <i className="bi bi-bookmark"></i> Saved Paths
              </button>
              <button className="btn btn-primary d-flex align-items-center gap-2 fw-medium shadow-sm">
                <i className="bi bi-compass"></i> Explore Catalog
              </button>
            </div>
          </div>

          {/* Ongoing Learning */}
          <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
            <h5 className="fw-bold mb-0">Ongoing Learning</h5>
            <a href="#" className="text-primary text-decoration-none fw-medium sd-view-all">View All</a>
          </div>

          <div className="row g-4 mb-5">
            {/* Course 1 */}
            <div className="col-md-6">
              <div className="card border shadow-sm rounded-4 h-100 p-4 hover-shadow transition">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center sd-course-icon-wrapper">
                    <i className="bi bi-cloud-check fs-4"></i>
                  </div>
                  <span className="badge bg-light text-dark border rounded-pill">Cloud</span>
                </div>
                <h5 className="fw-bold text-dark mb-1">AWS Cloud Practitioner</h5>
                <p className="text-secondary mb-4 sd-course-module">Module 4: Security and Compliance</p>
                
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-medium text-dark sd-progress-label">Progress</span>
                    <span className="fw-bold text-primary sd-progress-value">65%</span>
                  </div>
                  <div className="progress rounded-pill bg-light mb-3 sd-progress-container">
                    <div className="progress-bar bg-primary sd-w-65"></div>
                  </div>
                  <button className="btn btn-primary w-100 fw-medium shadow-sm">Continue Learning</button>
                </div>
              </div>
            </div>

            {/* Course 2 */}
            <div className="col-md-6">
              <div className="card border shadow-sm rounded-4 h-100 p-4 hover-shadow transition">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center sd-course-icon-wrapper">
                    <i className="bi bi-braces fs-4"></i>
                  </div>
                  <span className="badge bg-light text-dark border rounded-pill">Frontend</span>
                </div>
                <h5 className="fw-bold text-dark mb-1">Advanced React Patterns</h5>
                <p className="text-secondary mb-4 sd-course-module">Module 2: Custom Hooks & Context</p>
                
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-medium text-dark sd-progress-label">Progress</span>
                    <span className="fw-bold text-success sd-progress-value">32%</span>
                  </div>
                  <div className="progress rounded-pill bg-light mb-3 sd-progress-container">
                    <div className="progress-bar bg-success sd-w-32"></div>
                  </div>
                  <button className="btn btn-light border w-100 fw-medium shadow-sm text-secondary">Continue Learning</button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Learning Paths */}
          <h5 className="fw-bold mb-3">Recommended Learning Paths</h5>
          <p className="text-secondary mb-4 sd-recommendation-subtitle">Curated based on your major and career goals.</p>
          
          <div className="card border shadow-sm rounded-4 p-0 mb-5 overflow-hidden">
            <div className="list-group list-group-flush">
              
              <div className="list-group-item p-4 border-bottom hover-shadow transition">
                <div className="d-flex gap-4 align-items-center">
                  <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm sd-path-icon-wrapper">
                    <i className="bi bi-server fs-3"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold text-dark mb-0 fs-5">Backend Engineering Track</h6>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1">Highly Recommended</span>
                    </div>
                    <p className="text-secondary mb-2 sd-path-desc">Master Node.js, Databases, System Design, and Microservices.</p>
                    <div className="d-flex gap-3 text-muted sd-path-meta">
                      <span><i className="bi bi-clock me-1"></i> 120 Hours</span>
                      <span><i className="bi bi-journal-code me-1"></i> 6 Modules</span>
                      <span><i className="bi bi-star-fill text-warning me-1"></i> 4.8</span>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary fw-medium rounded-pill px-4 shadow-sm">Enroll</button>
                </div>
              </div>

              <div className="list-group-item p-4 hover-shadow transition">
                <div className="d-flex gap-4 align-items-center">
                  <div className="bg-dark text-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm sd-path-icon-wrapper">
                    <i className="bi bi-robot fs-3"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="fw-bold text-dark mb-0 fs-5">Generative AI Fundamentals</h6>
                    </div>
                    <p className="text-secondary mb-2 sd-path-desc">Learn LLMs, Prompt Engineering, and building AI agents.</p>
                    <div className="d-flex gap-3 text-muted sd-path-meta">
                      <span><i className="bi bi-clock me-1"></i> 45 Hours</span>
                      <span><i className="bi bi-journal-code me-1"></i> 3 Modules</span>
                      <span><i className="bi bi-star-fill text-warning me-1"></i> 4.9</span>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary fw-medium rounded-pill px-4 shadow-sm">Enroll</button>
                </div>
              </div>

            </div>
          </div>

          {/* Skill Assessments */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1">Skill Assessments</h5>
              <p className="text-secondary mb-0 sd-assessment-subtitle">Take quizzes to validate your skills and earn profile badges.</p>
            </div>
            <button className="btn btn-light border rounded-pill px-3 shadow-sm"><i className="bi bi-filter"></i> Filter</button>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                <i className="bi bi-filetype-sql text-primary mb-3 sd-assessment-icon"></i>
                <h6 className="fw-bold text-dark mb-2">SQL Mastery</h6>
                <p className="text-secondary mb-3 sd-assessment-meta">20 questions • 30 mins</p>
                <button className="btn btn-light border w-100 fw-medium text-primary mt-auto">Take Quiz</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                <i className="bi bi-git text-danger mb-3 sd-assessment-icon"></i>
                <h6 className="fw-bold text-dark mb-2">Git & Version Control</h6>
                <p className="text-secondary mb-3 sd-assessment-meta">15 questions • 20 mins</p>
                <button className="btn btn-light border w-100 fw-medium text-danger mt-auto">Take Quiz</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border shadow-sm rounded-4 p-4 text-center hover-shadow transition h-100">
                <i className="bi bi-terminal text-dark mb-3 sd-assessment-icon"></i>
                <h6 className="fw-bold text-dark mb-2">Linux Fundamentals</h6>
                <p className="text-secondary mb-3 sd-assessment-meta">25 questions • 40 mins</p>
                <button className="btn btn-light border w-100 fw-medium text-dark mt-auto">Take Quiz</button>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Sidebar (col-lg-4) */}
        <div className="col-lg-4">
          
          {/* Daily Goal */}
          <div className="glass-panel-accent border shadow-sm rounded-4 p-4 mb-4 text-center position-relative overflow-hidden">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-lightning-charge-fill text-primary sd-daily-icon"></i>
            </div>
            <h6 className="fw-bold text-primary mb-1 position-relative z-1 text-uppercase sd-daily-title">Daily Learning Goal</h6>
            <div className="text-dark mb-4 position-relative z-1 sd-daily-time">45 mins / 60 mins</div>
            
            <div className="position-relative d-inline-flex justify-content-center align-items-center mb-2 sd-daily-chart-wrapper">
              <svg viewBox="0 0 36 36" className="w-100 h-100 position-absolute top-0 start-0 sd-daily-chart-svg">
                <path className="text-white" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(37,99,235,0.2)" strokeWidth="3" strokeDasharray="100, 100" />
                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" />
              </svg>
              <div className="fw-bold fs-2 text-dark position-relative z-1">75%</div>
            </div>
            <p className="text-secondary mt-3 mb-0 sd-daily-streak">You're on a 5-day streak! 🔥</p>
          </div>

          {/* Verified Skills */}
          <div className="card border shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-success fs-5"></i> Verified Skills
              </h6>
              <a href="#" className="text-primary sd-verified-edit">Edit</a>
            </div>
            
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 fw-medium">
                <i className="bi bi-check2-circle me-1"></i> Python
              </span>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 fw-medium">
                <i className="bi bi-check2-circle me-1"></i> Data Structures
              </span>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 fw-medium">
                <i className="bi bi-check2-circle me-1"></i> HTML/CSS
              </span>
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-normal">
                React.js (Pending)
              </span>
            </div>
          </div>

          {/* Certifications Earned */}
          <div className="card border shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-award text-warning fs-5"></i> Certifications
              </h6>
              <button className="btn btn-sm btn-light border rounded-pill"><i className="bi bi-plus"></i> Add</button>
            </div>
            
            <div className="d-flex gap-3 align-items-center mb-3 p-3 border rounded-3 bg-light hover-shadow transition">
              <div className="bg-white rounded p-2 shadow-sm border text-primary">
                <i className="bi bi-google fs-4"></i>
              </div>
              <div>
                <div className="fw-bold text-dark sd-cert-title">Google Data Analytics</div>
                <div className="text-muted sd-cert-meta">Issued: Sep 2023</div>
              </div>
            </div>

            <div className="d-flex gap-3 align-items-center p-3 border rounded-3 bg-light hover-shadow transition">
              <div className="bg-white rounded p-2 shadow-sm border sd-cert-ms-icon">
                <i className="bi bi-microsoft fs-4"></i>
              </div>
              <div>
                <div className="fw-bold text-dark sd-cert-title">Azure Fundamentals</div>
                <div className="text-muted sd-cert-meta">Issued: Jan 2024</div>
              </div>
            </div>
            
            <button className="btn btn-light border w-100 fw-medium text-secondary rounded-pill shadow-sm mt-4">View Portfolio</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SkillDevHome;
