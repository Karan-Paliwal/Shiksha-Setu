import React from "react";
import { useAuth } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="topbar">
      <div className="topbar-title">Welcome back, {user?.name.split(" ")[0]}! 👋</div>
      <div className="topbar-actions">
        <div className="profile-dropdown">
          <div className="profile-avatar">
            {user?.name ? getInitials(user.name) : "U"}
          </div>
          <div className="d-none d-md-block ms-2">
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--ss-text-muted)" }}>Student</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
