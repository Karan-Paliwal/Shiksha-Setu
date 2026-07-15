import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth <= 991) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className={`d-flex ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Backdrop */}
      <div 
        className={`sidebar-backdrop ${isMobileSidebarOpen ? 'show' : ''}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      ></div>

      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        isMobileOpen={isMobileSidebarOpen}
      />
      <div className="w-100 flex-grow-1">
        <Navbar 
          toggleSidebar={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        <main className="dashboard-layout fade-in">
          <div className="main-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
