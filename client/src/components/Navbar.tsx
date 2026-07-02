import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarCollapsed }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      
      // Define a keyword to route mapping
      const routeMap: { [key: string]: string[] } = {
        "/dashboard/academics": ["academic", "study", "class", "subject"],
        "/dashboard/ai": ["ai", "tutor", "assistant", "bot", "help"],
        "/dashboard/opportunities": ["opportunity", "scholarship", "internship", "job", "career"],
        "/dashboard/skill-dev": ["skill", "course", "learn", "development", "tutorial", "video"],
        "/dashboard/interview-prep": ["interview", "prep", "mock", "practice", "question"],
        "/dashboard/resume-builder": ["resume", "cv", "builder", "template", "portfolio"],
        "/dashboard/profile": ["profile", "account", "setting", "user"],
        "/dashboard/analytics": ["analytic", "progress", "report", "stat", "dashboard"]
      };

      let matchedRoute = "";

      // Check if any keyword is included in the query
      for (const [route, keywords] of Object.entries(routeMap)) {
        if (keywords.some(keyword => query.includes(keyword))) {
          matchedRoute = route;
          break;
        }
      }

      if (matchedRoute) {
        navigate(matchedRoute);
      } else {
        // Fallback or could show a toast indicating no match
        // For now, just navigate to the dashboard root or stay on page
        navigate("/dashboard");
      }
      
      setSearchQuery(""); // clear after search
    }
  };

  return (
    <header className="topbar transition">
      <div className="d-flex align-items-center flex-grow-1 me-4">
        <button onClick={toggleSidebar} className="btn btn-link text-ss-muted me-3 p-0 border-0 fs-4 hover-primary">
          <i className="bi bi-list"></i>
        </button>
        <div className="search-bar w-100" style={{ maxWidth: '600px' }}>
          <i className="bi bi-search text-ss-muted me-2"></i>
          <input 
            type="text" 
            placeholder="Search resources, scholarships..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>
      <div className="topbar-actions d-flex align-items-center">
        <div className="profile-dropdown ms-2 d-flex align-items-center">
          <Link to="/dashboard/profile">
            <img 
              src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&rounded=true`} 
              alt="Profile" 
              className="profile-avatar shadow-sm border border-2 border-white cursor-pointer transition hover-shadow"
              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
