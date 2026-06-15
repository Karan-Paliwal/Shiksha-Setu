import React from "react";
import DashboardCard from "../components/DashboardCard";
import { mockDashboardStats } from "../utils/mockData";

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="module-header mb-4">
        <h1>Your Dashboard</h1>
        <p>Overview of your academic progress and opportunities.</p>
      </div>

      {/* Stats Row */}
      <div className="stats-grid slide-up">
        <div className="stat-card">
          <div className="stat-value">{mockDashboardStats.attendance}</div>
          <div className="stat-label">Overall Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{mockDashboardStats.cgpa}</div>
          <div className="stat-label">Current CGPA</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{mockDashboardStats.scholarships}</div>
          <div className="stat-label">Matched Scholarships</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{mockDashboardStats.applications}</div>
          <div className="stat-label">Active Applications</div>
        </div>
      </div>

      {/* Main Modules */}
      <h3 className="mb-3 fs-5 fw-semibold">Quick Access</h3>
      <div className="dashboard-grid">
        <DashboardCard
          icon="bi-journal-bookmark-fill"
          title="Academic Planner"
          description="Manage attendance, predict CGPA, and plan your study schedules effectively."
          path="/dashboard/academics"
          color="var(--ss-academics)"
        />
        <DashboardCard
          icon="bi-robot"
          title="AI Study Assistant"
          description="Get help with viva preparation, summarize notes, and clear your doubts instantly."
          path="/dashboard/ai"
          color="var(--ss-ai)"
        />
        <DashboardCard
          icon="bi-briefcase-fill"
          title="Opportunities Hub"
          description="Find relevant scholarships, government schemes, and education loans."
          path="/dashboard/opportunities"
          color="var(--ss-opportunities)"
        />
        <DashboardCard
          icon="bi-rocket-takeoff-fill"
          title="Career Builder"
          description="Build your resume, practice for interviews, and track internship applications."
          path="/dashboard/career"
          color="var(--ss-career)"
        />
      </div>
    </div>
  );
};

export default Dashboard;
