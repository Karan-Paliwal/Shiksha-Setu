import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await api.get("/schedule/my-schedule");
        if (data && data.classes) setSchedule(data.classes);
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      }
    };
    fetchSchedule();
  }, []);

  const academic = user?.academicProfile || {
    currentCgpa: 0, targetCgpa: 0, creditsEarned: 0, totalCredits: 160, currentSemester: 1
  };
  
  const progressPercent = academic.totalCredits > 0 ? (academic.creditsEarned / academic.totalCredits) * 100 : 0;

  return (
    <div className="fade-in pb-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold text-ss-bright fs-3 mb-1">Academic Overview, {user?.name.split(" ")[0] || 'Aditya'}</h1>
          <p className="text-ss-muted mb-0 fs-6">Track your trajectory, credits, and career readiness.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-ss-outline bg-white shadow-sm"><i className="bi bi-file-earmark-arrow-down me-2"></i>Download Transcript</button>
          <button className="btn btn-ss-primary shadow-sm"><i className="bi bi-graph-up-arrow me-2"></i>Detailed Analytics</button>
        </div>
      </div>

      {/* Row 1: Academic Overview (Glassmorphism Metric Cards) */}
      <div className="row g-4 mb-5">
        {/* Current CGPA */}
        <div className="col-md-3">
          <div className="glass-panel p-4 h-100 rounded-4 position-relative overflow-hidden transition hover-shadow">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-award-fill text-primary db-icon-bg"></i>
            </div>
            <div className="text-ss-muted fw-semibold mb-2 text-uppercase db-text-xs-spacing">Current CGPA</div>
            <div className="fs-1 fw-bold text-ss-bright mb-2 d-flex align-items-center gap-2">
              {academic.currentCgpa.toFixed(2)} <i className="bi bi-arrow-up-right-circle-fill text-success fs-5"></i>
            </div>
            <div className="d-inline-block badge bg-success-light text-success border border-success border-opacity-25 rounded-pill px-2 py-1 db-text-xs">
              Target: {academic.targetCgpa.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Credits Earned */}
        <div className="col-md-3">
          <div className="glass-panel p-4 h-100 rounded-4 position-relative overflow-hidden transition hover-shadow">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-journal-bookmark-fill text-primary db-icon-bg"></i>
            </div>
            <div className="text-ss-muted fw-semibold mb-2 text-uppercase db-text-xs-spacing">Credits Earned</div>
            <div className="fs-1 fw-bold text-ss-bright mb-2">
              {academic.creditsEarned} <span className="text-muted fs-4">/ {academic.totalCredits}</span>
            </div>
            <div className="progress mt-3 db-progress-bg">
              <div className="progress-bar bg-primary" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Academic Progress */}
        <div className="col-md-3">
          <div className="glass-panel p-4 h-100 rounded-4 d-flex align-items-center gap-4 transition hover-shadow">
            <div className="position-relative d-flex justify-content-center align-items-center db-chart-container">
              <svg viewBox="0 0 36 36" className="w-100 h-100 position-absolute top-0 start-0 db-chart-svg">
                <path className="text-light" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${progressPercent}, 100`} />
              </svg>
              <div className="fw-bold fs-4 text-dark position-relative z-1">{Math.round(progressPercent)}%</div>
            </div>
            <div>
              <div className="text-ss-muted fw-semibold mb-1 text-uppercase db-text-xs-spacing">Degree Progress</div>
              <div className="fs-5 fw-bold text-ss-bright">On Track</div>
              <div className="text-muted db-text-xs-alt">Sem {academic.currentSemester} of 8</div>
            </div>
          </div>
        </div>

        {/* Predicted CGPA */}
        <div className="col-md-3">
          <div className="glass-panel-accent p-4 h-100 rounded-4 position-relative overflow-hidden transition hover-shadow">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <i className="bi bi-stars text-primary db-icon-bg"></i>
            </div>
            <div className="text-primary fw-bold mb-2 text-uppercase d-flex align-items-center gap-2 db-text-xs-spacing">
              <i className="bi bi-lightning-charge-fill"></i> Predicted CGPA
            </div>
            <div className="fs-1 fw-bold text-dark mb-2">8.65</div>
            <div className="text-dark opacity-75 db-text-sm">
              Projected upon graduation if current trend continues.
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Interactive Analytics Hub */}
      <h4 className="fw-bold text-ss-bright mb-4">Interactive Analytics Hub</h4>
      <div className="row g-4 mb-5">
        
        {/* Main Graph */}
        <div className="col-lg-9">
          <div className="glass-panel p-4 h-100 rounded-4 position-relative">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1">Semester-wise CGPA Trend</h5>
                <div className="text-ss-muted db-text-sm">Your academic performance across completed semesters.</div>
              </div>
              <div className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 fw-medium">
                Overall Average: 8.35
              </div>
            </div>

            <div className="w-100 position-relative mt-4 db-chart-area-container">
              
              {/* Y-Axis Labels */}
              <div className="position-absolute h-100 d-flex flex-column justify-content-between text-muted db-chart-y-axis">
                <span>10.0</span>
                <span>9.0</span>
                <span>8.0</span>
                <span>7.0</span>
              </div>

              {/* Chart Area */}
              <div className="position-absolute h-100 border-start border-bottom db-chart-main-area">
                
                {/* Grid Lines */}
                <div className="w-100 border-top position-absolute db-chart-grid-1"></div>
                <div className="w-100 border-top position-absolute db-chart-grid-2"></div>
                
                {/* SVG Spline Chart */}
                <svg viewBox="0 0 1000 270" width="100%" height="100%" preserveAspectRatio="none" className="position-absolute top-0 start-0 overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(14, 165, 233, 0.4)" />
                      <stop offset="100%" stopColor="rgba(14, 165, 233, 0.0)" />
                    </linearGradient>
                  </defs>
                  {/* Fill */}
                  <path d="M0,250 C150,230 200,100 350,150 C500,200 650,50 800,80 C900,90 950,40 1000,20 L1000,270 L0,270 Z" fill="url(#chartGradient)" />
                  {/* Line */}
                  <path d="M0,250 C150,230 200,100 350,150 C500,200 650,50 800,80 C900,90 950,40 1000,20" fill="none" stroke="url(#chartGradient)" strokeWidth="0" />
                  <path d="M0,250 C150,230 200,100 350,150 C500,200 650,50 800,80 C900,90 950,40 1000,20" fill="none" stroke="var(--ss-primary)" strokeWidth="4" />
                </svg>

                {/* X-Axis Labels */}
                <div className="position-absolute w-100 d-flex justify-content-between text-muted mt-2 db-chart-x-axis">
                  <span>Sem 1</span>
                  <span>Sem 2</span>
                  <span>Sem 3</span>
                  <span>Sem 4</span>
                  <span className="text-primary fw-bold">Sem 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Analytics Panel */}
        <div className="col-lg-3">
          <div className="d-flex flex-column gap-4 h-100">
            
            <div className="glass-panel p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center transition hover-shadow">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center db-icon-sm">
                  <i className="bi bi-trophy-fill fs-5"></i>
                </div>
                <div>
                  <div className="text-ss-muted fw-semibold text-uppercase db-text-xxs-spacing">Highest CGPA</div>
                  <div className="fw-bold fs-4 text-dark">9.12</div>
                </div>
              </div>
              <div className="text-muted ms-5 ps-1 db-text-xs-alt">Achieved in Semester 5</div>
            </div>

            <div className="glass-panel p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center transition hover-shadow">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center db-icon-sm">
                  <i className="bi bi-calculator-fill fs-5"></i>
                </div>
                <div>
                  <div className="text-ss-muted fw-semibold text-uppercase db-text-xxs-spacing">Average CGPA</div>
                  <div className="fw-bold fs-4 text-dark">8.35</div>
                </div>
              </div>
              <div className="text-muted ms-5 ps-1 db-text-xs-alt">Across 5 semesters</div>
            </div>

            <div className="glass-panel p-4 rounded-4 flex-grow-1 d-flex flex-column justify-content-center transition hover-shadow">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center db-icon-sm">
                  <i className="bi bi-graph-up-arrow fs-5"></i>
                </div>
                <div>
                  <div className="text-ss-muted fw-semibold text-uppercase db-text-xxs-spacing">Improvement Rate</div>
                  <div className="fw-bold fs-4 text-success">+0.4%</div>
                </div>
              </div>
              <div className="text-muted ms-5 ps-1 db-text-xs-alt">Semester-over-semester</div>
            </div>

          </div>
        </div>
      </div>

      {/* Row 3: Weekly Schedule */}
      <h4 className="fw-bold text-ss-bright mb-4 mt-5">My Weekly Schedule</h4>
      <div className="card border shadow-sm rounded-4 p-4 mb-5">
        {schedule.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Course Name</th>
                  <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Day</th>
                  <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Time</th>
                  <th className="text-secondary fw-medium border-0 pb-3 db-text-sm">Location</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((cls, idx) => (
                  <tr key={idx} className="border-bottom">
                    <td className="fw-bold text-dark py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center db-icon-sm">
                          <i className="bi bi-book"></i>
                        </div>
                        {cls.courseName}
                      </div>
                    </td>
                    <td className="text-secondary fw-medium py-3">{cls.dayOfWeek}</td>
                    <td className="text-secondary py-3">
                      <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-medium">
                        {cls.startTime} - {cls.endTime}
                      </span>
                    </td>
                    <td className="text-secondary py-3">{cls.location || "TBA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="text-muted mb-3"><i className="bi bi-calendar-x fs-1"></i></div>
            <h6 className="fw-bold text-dark">No classes scheduled</h6>
            <p className="text-secondary db-text-base">Update your profile to add classes to your timetable.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
