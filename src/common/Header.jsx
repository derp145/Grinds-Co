import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "./Header.css";

function Header({ currentPage }) {
const pageTitles = {
  dashboard: "Dashboard",
  inventoryItems: "Inventory Items",
  purchasedOrder: "Purchased Order",
  reports: "Reports",
  users: "Users",
  settings: "System Settings",
  signin: "Sign In",
};


  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  }, []);

  return (
    <>
      <header className="top-header">
        <h1 className="page-title">
          {pageTitles[currentPage] || "Dashboard"}
        </h1>

        <div className="header-right">
          <button
            className="icon-btn"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            <FaBell />
            {/* Red dot when new notifications exist */}
            {notifications.length > 0 && <span className="notif-dot"></span>}
          </button>

          <div className="header-user">
            <FaUserCircle />
          </div>
        </div>
      </header>

      {/* Notification Popup */}
      {notifOpen && (
        <div className="notif-popup">
          <h3>Notifications</h3>

          {notifications.length === 0 && (
            <p className="empty-notif">No notifications yet.</p>
          )}

          {notifications.map((n, index) => (
            <div key={index} className="notif-item">
              <p>{n.message}</p>
              <span className="notif-time">{n.time}</span>
            </div>
          ))}

          <button
            className="clear-notif-btn"
            onClick={() => {
              localStorage.removeItem("notifications");
              setNotifications([]);
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </>
  );
}

export default Header;
