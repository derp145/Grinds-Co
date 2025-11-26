import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaTags,
  FaUsers,
  FaChartBar,
  FaArrowCircleDown,
  FaArrowCircleUp,
  FaFileAlt,
  FaUserCog,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import "./Sidebar.css";

function Sidebar({ currentPage }) {
  const navigate = useNavigate();

  const userData = {
    name: "John Doe",
    role: "Admin",
  };

  const menuItems = [
    { section: "MAIN MENU" },
    { key: "dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { key: "inventoryItems", label: "Inventory Items", icon: <FaBox /> },
    { section: "ACTION" },
    { key: "stockIn", label: "Stock In", icon: <FaArrowCircleDown /> },
    { key: "stockOut", label: "Stock Out", icon: <FaArrowCircleUp /> },
    { section: "USER MANAGEMENT" },
    { key: "reports", label: "Reports", icon: <FaFileAlt /> },
    { key: "users", label: "Users", icon: <FaUsers /> },
    { key: "settings", label: "System Settings", icon: <FaUserCog /> },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <h2>Grinds & Co.</h2>
      </div>

      {/* Profile */}
      <div className="sidebar-profile">
        <FaUserCircle className="profile-avatar-icon" />
        <div className="profile-info">
          <h3>{userData.name}</h3>
          <p>{userData.role}</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item, index) =>
          item.section ? (
            <h4 key={index} className="menu-title">
              {item.section}
            </h4>
          ) : (
            <button
              key={item.key}
              className={currentPage === item.key ? "active" : ""}
              onClick={() => navigate(item.key)}
            >
              {item.icon} {item.label}
            </button>
          )
        )}
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={() => navigate("/auth/signin")}
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
