import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="w-100">
        <Navbar />
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
