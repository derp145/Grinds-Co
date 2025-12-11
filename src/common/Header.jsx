import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Header.css";

function Header() {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lowStockAlertEnabled, setLowStockAlertEnabled] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    initializeUser();
  }, []);

  // Listen for custom events from Settings component
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('Profile update event received:', event.detail);
      
      if (event.detail.low_stock_alert !== undefined) {
        setLowStockAlertEnabled(event.detail.low_stock_alert);
        
        // If alert is disabled, clear all low stock notifications
        if (!event.detail.low_stock_alert) {
          const existingNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
          const nonLowStockNotifs = existingNotifs.filter(n => n.type !== "low_stock");
          localStorage.setItem("notifications", JSON.stringify(nonLowStockNotifs));
          setNotifications(nonLowStockNotifs);
        } else {
          // If alert is re-enabled, check for low stock items immediately
          checkLowStockItems();
        }
      }
      
      // Update profile picture if changed
      if (event.detail.profile_picture !== undefined) {
        setProfilePicture(event.detail.profile_picture);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Listen for changes to user's low stock alert preference and profile picture via Supabase
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log('Profile updated via Supabase:', payload);
          if (payload.new.low_stock_alert !== undefined) {
            setLowStockAlertEnabled(payload.new.low_stock_alert);
            
            if (!payload.new.low_stock_alert) {
              const existingNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
              const nonLowStockNotifs = existingNotifs.filter(n => n.type !== "low_stock");
              localStorage.setItem("notifications", JSON.stringify(nonLowStockNotifs));
              setNotifications(nonLowStockNotifs);
            } else {
              checkLowStockItems();
            }
          }
          
          if (payload.new.profile_picture !== undefined) {
            setProfilePicture(payload.new.profile_picture);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  // Set up real-time inventory monitoring
  useEffect(() => {
    if (lowStockAlertEnabled && userId) {
      checkLowStockItems();

      const interval = setInterval(checkLowStockItems, 2 * 60 * 1000);

      const subscription = supabase
        .channel('inventory-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'inventory'
          },
          (payload) => {
            console.log('Inventory changed:', payload);
            checkLowStockItems();
          }
        )
        .subscribe();

      return () => {
        clearInterval(interval);
        subscription.unsubscribe();
      };
    } else if (!lowStockAlertEnabled) {
      const existingNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
      const nonLowStockNotifs = existingNotifs.filter(n => n.type !== "low_stock");
      localStorage.setItem("notifications", JSON.stringify(nonLowStockNotifs));
      setNotifications(nonLowStockNotifs);
    }
  }, [lowStockAlertEnabled, userId]);

  const initializeUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("low_stock_alert, profile_picture")
          .eq("id", user.id)
          .single();

        if (profile) {
          setLowStockAlertEnabled(profile.low_stock_alert ?? true);
          setProfilePicture(profile.profile_picture);
        }

        const stored = JSON.parse(localStorage.getItem("notifications")) || [];
        setNotifications(stored);
      }
    } catch (error) {
      console.error("Error initializing user:", error);
    }
  };

  const checkLowStockItems = async () => {
    try {
      const { data: items, error } = await supabase
        .from("inventory")
        .select("*");

      if (error) {
        console.error("Error fetching inventory:", error);
        return;
      }

      const lowStockItems = items.filter((item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const reorderPoint = parseFloat(item.reorder_point) || 10;
        return quantity <= reorderPoint;
      });

      const existingNotifs = JSON.parse(localStorage.getItem("notifications")) || [];

      const existingLowStockIds = new Set(
        existingNotifs
          .filter(n => n.type === "low_stock")
          .map(n => n.itemId)
      );

      const currentLowStockIds = new Set(lowStockItems.map(item => item.id));
      const updatedNotifs = existingNotifs.filter(n => {
        if (n.type === "low_stock") {
          return currentLowStockIds.has(n.itemId);
        }
        return true;
      });

      const newNotifications = lowStockItems
        .filter(item => !existingLowStockIds.has(item.id))
        .map((item) => {
          const quantity = parseFloat(item.quantity) || 0;
          const reorderPoint = parseFloat(item.reorder_point) || 10;
          const difference = reorderPoint - quantity;
          return {
            type: "low_stock",
            itemId: item.id,
            message: `⚠️ Low stock: ${item.name} (${quantity} ${item.unit} left, reorder at ${reorderPoint})`,
            severity: difference > 5 ? "critical" : "warning",
            time: new Date().toLocaleString(),
            timestamp: Date.now(),
          };
        });

      if (newNotifications.length > 0 || updatedNotifs.length !== existingNotifs.length) {
        const finalNotifs = [...updatedNotifs, ...newNotifications];
        localStorage.setItem("notifications", JSON.stringify(finalNotifs));
        setNotifications(finalNotifs);
      }
    } catch (error) {
      console.error("Error checking low stock items:", error);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "Dashboard";
    if (path === "/inventoryItems") return "Inventory Items";
    if (path === "/inventoryItems/new") return "Inventory";
    if (path.startsWith("/inventoryItems/update/")) return "Inventory";
    if (path === "/purchasedOrder") return "Purchased Order";
    if (path === "/reports") return "Reports";
    if (path === "/users") return "Users";
    if (path === "/settings") return "System Settings";
    return "Dashboard";
  };

  const handleClearAll = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
    setNotifOpen(false);
  };

  const handleDismissNotification = (index) => {
    const updatedNotifs = notifications.filter((_, i) => i !== index);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifs));
    setNotifications(updatedNotifs);
  };

  return (
    <>
      <header className="top-header">
        <h1 className="page-title">
          {getPageTitle()}
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
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-pic" />
            ) : (
              <FaUserCircle />
            )}
          </div>
        </div>
      </header>

      {/* Notification Popup */}
      {notifOpen && (
        <div className="notif-popup">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ margin: 0 }}>Notifications</h3>
            {notifications.length > 0 && (
              <span style={{ fontSize: "12px", color: "#666" }}>
                {notifications.length} alert{notifications.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {notifications.length === 0 && (
            <p className="empty-notif">No notifications yet.</p>
          )}

          {notifications
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .map((n, index) => (
              <div 
                key={index} 
                className={`notif-item ${n.type === 'low_stock' ? 'low-stock-notif' : ''} ${n.severity === 'critical' ? 'critical-notif' : ''}`}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 4px 0" }}>{n.message}</p>
                  <span className="notif-time">{n.time}</span>
                </div>
                <button
                  onClick={() => handleDismissNotification(index)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                    fontSize: "18px",
                    padding: "0 5px"
                  }}
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            ))}

          {notifications.length > 0 && (
            <button
              className="clear-notif-btn"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Header;