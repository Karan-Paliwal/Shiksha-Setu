import React from "react";
import "./Sidebar.css";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar transition">
      <Link to="/" className="sidebar-brand mb-3 d-flex align-items-center text-decoration-none">
        <img src="/final-logo.png" alt="Shiksha Setu Logo" className="shadow-sm sb-logo-img" />
        <span className={`text-ss-bright fw-bold ms-2 sidebar-text ${isCollapsed ? 'd-none' : ''} sb-brand-text`}>Shiksha Setu</span>
      </Link>

      <nav className="sidebar-nav mt-2">
        <NavLink to="/dashboard" end className="sidebar-link">
          <i className="bi bi-grid-1x2"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Dashboard</span>
        </NavLink>

        <NavLink to="/dashboard/academics" className="sidebar-link">
          <i className="bi bi-journal-bookmark"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Academics</span>
        </NavLink>

        <NavLink to="/dashboard/ai" className="sidebar-link">
          <i className="bi bi-robot"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>AI Study Assistant</span>
        </NavLink>


        <NavLink to="/dashboard/opportunities" className="sidebar-link">
          <i className="bi bi-mortarboard"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Scholarships</span>
        </NavLink>

        <NavLink to="/dashboard/skill-dev" className="sidebar-link">
          <i className="bi bi-bullseye"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Skills Development</span>
        </NavLink>

        <NavLink to="/dashboard/interview-prep" className="sidebar-link">
          <i className="bi bi-chat-square-text"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Interview Prep</span>
        </NavLink>

        <NavLink to="/dashboard/resume-builder" className="sidebar-link">
          <i className="bi bi-file-earmark-person"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Resume Builder</span>
        </NavLink>


        <NavLink to="/dashboard/profile" className="sidebar-link">
          <i className="bi bi-person-circle"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Profile</span>
        </NavLink>
      </nav>

      <div className="p-3 border-top mt-auto">
        <button
          onClick={logout}
          className="sidebar-link w-100 border-0 bg-transparent text-start text-danger"
        >
          <i className="bi bi-box-arrow-left"></i>
          <span className={`sidebar-text ${isCollapsed ? 'd-none' : ''}`}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
