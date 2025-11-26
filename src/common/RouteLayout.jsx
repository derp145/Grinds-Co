import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import "./RouteLayout.css";

const RouteLayout = () => {
  const location = useLocation();

  // Convert path → key (e.g. "/stock-in" → "stock-in")
  const pageKey = location.pathname.replace("/", "") || "dashboard";

  return (
    <div className="layout-container">
      <Sidebar currentPage={pageKey} />

      <div className="layout-right">
        <Header currentPage={pageKey} />
        <Outlet />
      </div>
    </div>
  );
};

export default RouteLayout;
