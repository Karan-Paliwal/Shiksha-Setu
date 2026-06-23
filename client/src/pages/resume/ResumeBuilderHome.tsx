import React, { useState } from "react";
import "./ResumeBuilderHome.css";

const ResumeBuilderHome: React.FC = () => {
  // State for form sections could be managed here
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Resume drafted successfully!");
    }, 1500);
  };

  return (
    <div className="fade-in pb-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-ss-bright fs-3 mb-1">AI Resume Builder</h1>
          <p className="text-ss-muted mb-0 fs-6">Enter your details to generate an ATS-friendly, professional resume.</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <form onSubmit={handleSubmit}>
            {/* 1. Personal Details */}
            <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                  <i className="bi bi-person-badge fs-5"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Personal Information</h5>
                  <span className="text-muted rb-text-sm">Basic details for recruiters to contact you.</span>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Full Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Aditya Sharma" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Email Address <span className="text-danger">*</span></label>
                  <input type="email" className="form-control auth-input bg-light border-0" placeholder="e.g., aditya@example.com" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Phone Number <span className="text-danger">*</span></label>
                  <input type="tel" className="form-control auth-input bg-light border-0" placeholder="e.g., +91 98765 43210" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Location (City, Country)</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., New Delhi, India" />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Professional Summary</label>
                  <textarea className="form-control auth-input bg-light border-0" rows={3} placeholder="A brief summary of your background, skills, and career goals..."></textarea>
                </div>
              </div>
            </div>

            {/* 2. Education */}
            <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                    <i className="bi bi-mortarboard fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">Education</h5>
                    <span className="text-muted rb-text-sm">Your academic background and achievements.</span>
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-light border fw-medium text-muted rounded-pill px-3">
                  <i className="bi bi-plus"></i> Add
                </button>
              </div>

              <div className="border border-dashed rounded-4 p-4 bg-light bg-opacity-50 position-relative mb-3">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Institution / University <span className="text-danger">*</span></label>
                    <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., IIT Delhi" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Degree / Program <span className="text-danger">*</span></label>
                    <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., B.Tech Computer Science" required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Start Date</label>
                    <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted fw-semibold rb-text-sm">End Date / Expected</label>
                    <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label text-muted fw-semibold rb-text-sm">CGPA / Score</label>
                    <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., 8.9/10" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Work Experience */}
            <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                    <i className="bi bi-briefcase fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">Work Experience</h5>
                    <span className="text-muted rb-text-sm">Internships, part-time, or full-time roles.</span>
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-light border fw-medium text-muted rounded-pill px-3">
                  <i className="bi bi-plus"></i> Add
                </button>
              </div>

              <div className="border border-dashed rounded-4 p-4 bg-light bg-opacity-50 position-relative mb-3">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Job Title <span className="text-danger">*</span></label>
                    <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., Software Engineering Intern" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Company / Organization <span className="text-danger">*</span></label>
                    <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., Google" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Start Date</label>
                    <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">End Date (Leave blank if present)</label>
                    <input type="month" className="form-control auth-input bg-white border-0 shadow-sm" />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted fw-semibold d-flex justify-content-between align-items-center rb-text-sm">
                      <span>Key Accomplishments & Responsibilities</span>
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill"><i className="bi bi-stars"></i> Use bullet points</span>
                    </label>
                    <textarea className="form-control auth-input bg-white border-0 shadow-sm" rows={4} placeholder="• Developed a new feature...&#10;• Optimized database queries..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Projects */}
            <div className="glass-panel p-4 rounded-4 mb-4 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                    <i className="bi bi-laptop fs-5"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">Key Projects</h5>
                    <span className="text-muted rb-text-sm">Showcase your practical applications and side projects.</span>
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-light border fw-medium text-muted rounded-pill px-3">
                  <i className="bi bi-plus"></i> Add
                </button>
              </div>

              <div className="border border-dashed rounded-4 p-4 bg-light bg-opacity-50 position-relative mb-3">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Project Title</label>
                    <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., E-Learning Dashboard" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Technologies / Stack</label>
                    <input type="text" className="form-control auth-input bg-white border-0 shadow-sm" placeholder="e.g., React, Node.js, MongoDB" />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted fw-semibold rb-text-sm">Description & Impact</label>
                    <textarea className="form-control auth-input bg-white border-0 shadow-sm" rows={3} placeholder="Describe what you built and the impact it had..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Skills */}
            <div className="glass-panel p-4 rounded-4 mb-5 position-relative overflow-hidden hover-shadow transition">
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center rb-icon-wrapper">
                  <i className="bi bi-tools fs-5"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Technical Skills</h5>
                  <span className="text-muted rb-text-sm">List your core technical proficiencies.</span>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Programming Languages</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Java, Python, C++" />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Frameworks & Libraries</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., React, Spring Boot, Express" />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Tools & Platforms</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Git, Docker, AWS" />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold rb-text-sm">Soft Skills</label>
                  <input type="text" className="form-control auth-input bg-light border-0" placeholder="e.g., Leadership, Agile, Communication" />
                </div>
              </div>
            </div>

            {/* Submit Actions */}
            <div className="d-flex justify-content-end gap-3 mb-5">
              <button type="button" className="btn btn-ss-outline bg-white px-4 py-2 fs-6">
                Save as Draft
              </button>
              <button type="submit" className="btn btn-ss-primary px-5 py-2 fs-6 shadow-sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Generating...</>
                ) : (
                  <>Draft my resume <i className="bi bi-rocket-takeoff ms-2"></i></>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderHome;
