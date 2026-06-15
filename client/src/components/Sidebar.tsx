import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-mortarboard-fill me-2"></i>
        ShikshaSetu
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        <NavLink to="/dashboard" end className="sidebar-link">
          <i className="bi bi-grid-1x2-fill"></i>
          Dashboard
        </NavLink>

        <div className="sidebar-section-label mt-3">Modules</div>
        <NavLink to="/dashboard/academics" className="sidebar-link">
          <i className="bi bi-journal-bookmark-fill" style={{ color: "var(--ss-academics)" }}></i>
          Academic Planner
        </NavLink>
        <NavLink to="/dashboard/ai" className="sidebar-link">
          <i className="bi bi-robot" style={{ color: "var(--ss-ai)" }}></i>
          AI Assistant
        </NavLink>
        <NavLink to="/dashboard/opportunities" className="sidebar-link">
          <i className="bi bi-briefcase-fill" style={{ color: "var(--ss-opportunities)" }}></i>
          Opportunities Hub
        </NavLink>
        <NavLink to="/dashboard/career" className="sidebar-link">
          <i className="bi bi-rocket-takeoff-fill" style={{ color: "var(--ss-career)" }}></i>
          Career Builder
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="sidebar-link w-100 border-0 bg-transparent text-start"
          style={{ color: "#f5576c" }}
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
