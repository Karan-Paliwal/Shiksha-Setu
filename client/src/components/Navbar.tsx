import React from "react";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarCollapsed }) => {
  const { user } = useAuth();

  return (
    <header className="topbar transition">
      <div className="d-flex align-items-center">
        <button onClick={toggleSidebar} className="btn btn-link text-ss-muted me-3 p-0 border-0 fs-4 hover-primary">
          <i className="bi bi-list"></i>
        </button>
        <div className="search-bar">
          <i className="bi bi-search text-ss-muted me-2"></i>
          <input type="text" placeholder="Search resources, scholarships..." />
        </div>
      </div>
      <div className="topbar-actions d-flex align-items-center">
        <button className="btn btn-link text-ss-muted position-relative me-3 p-0">
          <i className="bi bi-bell fs-5"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
            <span className="visually-hidden">New alerts</span>
          </span>
        </button>
        <div className="profile-dropdown ms-2 d-flex align-items-center">
          <img 
            src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&rounded=true`} 
            alt="Profile" 
            className="profile-avatar shadow-sm border border-2 border-white"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
