import React from "react";
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
  FaUserCircle, // <--- ADD THIS
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({ onNavigate, currentPage }) {
  const userData = {
    name: "John Doe",
    role: "Admin",
  };

  const menuItems = [
    { section: "MASTER DATA" },
    { key: "inventoryItems", label: "Inventory Items", icon: <FaBox /> },
    { key: "categories", label: "Categories", icon: <FaTags /> },
    { key: "suppliers", label: "Suppliers", icon: <FaUsers /> },

    { section: "INVENTORY MANAGEMENT" },
    { key: "dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { key: "stockIn", label: "Stock In", icon: <FaArrowCircleDown /> },
    { key: "stockOut", label: "Stock Out", icon: <FaArrowCircleUp /> },
    { key: "reports", label: "Reports", icon: <FaFileAlt /> },

    { section: "USER MANAGEMENT" },
    { key: "users", label: "Users", icon: <FaUsers /> },
    { key: "settings", label: "System Settings", icon: <FaUserCog /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Grinds & Co.</h2>
      </div>

      {/* === PROFILE SECTION === */}
      <div className="sidebar-profile">
        <FaUserCircle className="profile-avatar-icon" />
        <div className="profile-info">
          <h3>{userData.name}</h3>
          <p>{userData.role}</p>
        </div>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) =>
          item.section ? (
            <h4 key={index} className="menu-title">{item.section}</h4>
          ) : (
            <button
              key={item.key}
              className={currentPage === item.key ? "active" : ""}
              onClick={() => onNavigate(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => onNavigate("signin")}>
          <FaSignOutAlt />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
