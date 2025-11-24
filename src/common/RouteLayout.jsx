import React from "react";
import Sidebar from "./Sidebar";

function RouteLayout({ children, onNavigate, currentPage }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onNavigate={onNavigate} currentPage={currentPage} />
      <div style={{ flex: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}

export default RouteLayout;
