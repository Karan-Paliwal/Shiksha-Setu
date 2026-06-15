import React from "react";
import FeatureCard from "../../components/FeatureCard";
import { mockAttendance, mockExams, mockStudyPlans } from "../../utils/mockData";

const AcademicsHome: React.FC = () => {
  return (
    <div className="module-page fade-in">
      <div className="module-header">
        <h1>Academic Planner</h1>
        <p>Stay on top of your attendance, grades, and study schedules.</p>
      </div>

      <div className="module-grid mb-5">
        <FeatureCard
          icon="bi-calendar-check"
          title="Attendance Predictor"
          description="Calculate how many classes you can afford to miss or need to attend to maintain 75%."
        />
        <FeatureCard
          icon="bi-calculator"
          title="CGPA Predictor"
          description="Estimate your target CGPA based on expected grades in upcoming exams."
        />
        <FeatureCard
          icon="bi-journal-text"
          title="Study Planner"
          description="Create and track daily study tasks to prepare for your end-semester exams."
        />
      </div>

      <div className="row g-4">
        {/* Attendance Table */}
        <div className="col-lg-8">
          <h4 className="mb-3 fs-5 fw-semibold">Current Attendance</h4>
          <div className="ss-table">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Attended / Total</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendance.map((record, index) => (
                  <tr key={index}>
                    <td>{record.subject}</td>
                    <td>{record.attendedClasses} / {record.totalClasses}</td>
                    <td>{record.percentage.toFixed(1)}%</td>
                    <td>
                      <span className={`badge-ss ${record.percentage >= 75 ? "safe" : "risk"}`}>
                        {record.percentage >= 75 ? "Safe" : "At Risk"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exams / Study Plans */}
        <div className="col-lg-4">
          <h4 className="mb-3 fs-5 fw-semibold">Upcoming Exams</h4>
          <div className="d-flex flex-column gap-3 mb-4">
            {mockExams.slice(0, 3).map((exam, i) => (
              <div key={i} className="p-3 border rounded" style={{ borderColor: "var(--ss-border) !important", background: "var(--ss-bg-card)" }}>
                <div className="fw-semibold">{exam.subject}</div>
                <div className="text-muted small mt-1">
                  <i className="bi bi-calendar-event me-2"></i>
                  {exam.date} • {exam.type}
                </div>
              </div>
            ))}
          </div>

          <h4 className="mb-3 fs-5 fw-semibold">Study Focus</h4>
          <div className="d-flex flex-column gap-3">
            {mockStudyPlans.slice(0, 2).map((plan, i) => (
              <div key={i} className="p-3 border rounded" style={{ borderColor: "var(--ss-border) !important", background: "var(--ss-bg-card)" }}>
                <div className="fw-semibold text-primary">{plan.title}</div>
                <div className="text-muted small mt-1">{plan.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicsHome;
