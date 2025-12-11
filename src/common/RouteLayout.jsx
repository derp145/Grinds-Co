import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import "./RouteLayout.css";

const RouteLayout = () => {
  const location = useLocation();

  // Convert path → key for Sidebar highlighting
  const pageKey = location.pathname.split("/")[1] || "dashboard";

  return (
    <div className="layout-container">
      <Sidebar currentPage={pageKey} />

      <div className="layout-right">
        <Header /> {/* Removed currentPage prop */}
        <Outlet />
      </div>
    </div>
  );
};

export default RouteLayout;