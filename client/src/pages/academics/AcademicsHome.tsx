import React from "react";
import "./AcademicsHome.css";

const AcademicsHome: React.FC = () => {
  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-book text-ss-primary"></i>
            <span className="text-ss-primary fw-bold text-uppercase ah-text-xs-spacing">Academic Hub</span>
          </div>
          <h1 className="fw-bold text-ss-bright fs-2 mb-1">Semester 5 Overview</h1>
          <p className="text-ss-muted mb-0 fs-6">Third Year | Computer Science & Engineering</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-ss-outline bg-white"><i className="bi bi-calendar4-week me-2"></i>Full Calendar</button>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content Column */}
        <div className="col-lg-8">
          {/* Quick Downloads */}
          <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
            <h5 className="fw-bold mb-0 d-flex align-items-center"><i className="bi bi-file-earmark-arrow-down text-primary me-2"></i>One Destination for all Resources </h5>
            <a href="#" className="text-ss-primary text-decoration-none fw-medium fs-6">View All Materials</a>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="ss-card p-3 d-flex align-items-center gap-3 cursor-pointer hover-primary">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-file-earmark-text fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold text-dark fs-6 text-truncate ah-max-w-150">OS Midterm Question Bank 2023</div>
                  <div className="text-ss-muted ah-text-xs">Operating Systems • 2.4 MB</div>
                </div>
                <i className="bi bi-download text-muted hover-primary"></i>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ss-card p-3 d-flex align-items-center gap-3 cursor-pointer">
                <div className="bg-info bg-opacity-10 text-info rounded p-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-book fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold text-dark fs-6 text-truncate ah-max-w-150">B-Tree Visualization Notes</div>
                  <div className="text-ss-muted ah-text-xs">Data Structures • 1.1 MB</div>
                </div>
                <i className="bi bi-download text-muted hover-primary"></i>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ss-card p-3 d-flex align-items-center gap-3 cursor-pointer">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-file-earmark-text fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold text-dark fs-6 text-truncate ah-max-w-150">Lab Manual - 8085 Kit</div>
                  <div className="text-ss-muted ah-text-xs">Microprocessors • 4.8 MB</div>
                </div>
                <i className="bi bi-download text-muted hover-primary"></i>
              </div>
            </div>
            <div className="col-md-6">
              <div className="ss-card p-3 d-flex align-items-center gap-3 cursor-pointer">
                <div className="bg-success bg-opacity-10 text-success rounded p-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-camera-video fs-4"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="fw-bold text-dark fs-6 text-truncate ah-max-w-150">Agile Methodology Summary</div>
                  <div className="text-ss-muted ah-text-xs">Software Engineering • 3.2 MB</div>
                </div>
                <i className="bi bi-download text-muted hover-primary"></i>
              </div>
            </div>
          </div>

          <div className="bg-dark rounded-4 p-4 text-white d-flex justify-content-between align-items-center position-relative overflow-hidden">
            <i className="bi bi-box-arrow-up-right position-absolute opacity-25 ah-icon-xl"></i>
            <div className="position-relative z-1 w-75">
              <h4 className="fw-bold mb-2">Previous Year Papers</h4>
              <p className="mb-0 text-white-50 ah-text-base">Access the curated collection of end-semester papers from the last 5 years with detailed solutions.</p>
            </div>
            <button className="btn btn-light fw-bold px-4 py-2 position-relative z-1 shadow-sm text-dark">Explore Repository</button>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Academic Tasks */}
          <div className="ss-card">
            <h5 className="fw-bold mb-4 d-flex align-items-center"><i className="bi bi-journal-text text-primary me-2"></i>Academic Tasks</h5>
            <div className="d-flex gap-3 mb-4">
              <i className="bi bi-file-earmark-text text-dark fs-5 mt-1"></i>
              <div>
                <div className="fw-bold text-dark fs-6">OS Lab Record Submission</div>
                <div className="text-ss-muted ah-text-sm-alt">Due by tomorrow, 11:59 PM</div>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4 position-relative">
              <div className="position-absolute bg-primary rounded-start ah-timeline-line"></div>
              <i className="bi bi-check-circle text-primary fs-5 mt-1"></i>
              <div>
                <div className="fw-bold text-dark fs-6">Registration Confirmation</div>
                <div className="text-ss-muted ah-text-sm-alt">NPTEL Cloud Computing Exam</div>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <i className="bi bi-three-dots text-muted fs-5 mt-1"></i>
              <div>
                <div className="fw-bold text-dark fs-6">Library Notice</div>
                <div className="text-ss-muted ah-text-sm-alt">Renew "Modern Operating Systems"</div>
              </div>
            </div>

            <button className="btn btn-outline-primary w-100 d-flex justify-content-center align-items-center border-dashed py-2">
              <i className="bi bi-plus-circle me-2"></i> <span className="ah-text-sm">Add a Task before you forget</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsHome;
