import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaUserCog,
  FaSignOutAlt,
  FaUserCircle,
  FaShoppingCart
} from "react-icons/fa";
import "./Sidebar.css";
import logo from "../assets/LoginLogo.png";
import { supabase } from "../supabaseClient";

function Sidebar({ currentPage }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "User",
    role: "Staff",
  });

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData({
        name: user.name || "User",
        role: user.role || "Staff",
      });
    }
  }, []);

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear localStorage
    localStorage.removeItem("user");
    
    // Navigate to sign in
    navigate("/auth/signin");
  };

  const menuItems = [
    { section: "MAIN MENU" },
    { key: "dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { key: "inventoryItems", label: "Inventory Items", icon: <FaBox /> },

    { section: "PURCHASES" },
    { key: "purchasedOrder", label: "Purchased Order", icon: <FaShoppingCart /> },

    { section: "USER MANAGEMENT" },
    { key: "reports", label: "Reports", icon: <FaFileAlt /> },
    { key: "users", label: "Users", icon: <FaUsers /> },
    { key: "settings", label: "System Settings", icon: <FaUserCog /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Grinds & Co Logo" className="logo-images" />
      </div>

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
              onClick={() => navigate("/" + item.key)}
            >
              {item.icon} {item.label}
            </button>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleSignOut}
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;