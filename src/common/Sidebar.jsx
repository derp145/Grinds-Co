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
    profilePicture: null,
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    initializeUser();
  }, []);

  // Listen for profile updates from Settings
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('Sidebar: Profile update event received:', event.detail);
      
      if (event.detail.profile_picture !== undefined) {
        setUserData(prev => ({
          ...prev,
          profilePicture: event.detail.profile_picture
        }));
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Listen for real-time profile picture changes from Supabase
  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel('sidebar-profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log('Sidebar: Profile updated via Supabase:', payload);
          if (payload.new.profile_picture !== undefined) {
            setUserData(prev => ({
              ...prev,
              profilePicture: payload.new.profile_picture
            }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const initializeUser = async () => {
    try {
      // Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);

        // Fetch user's profile data including profile picture
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role, profile_picture")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserData({
            name: profile.full_name || "User",
            role: profile.role || "Staff",
            profilePicture: profile.profile_picture || null,
          });
        }

        // Also load from localStorage as fallback
        const storedUser = localStorage.getItem("user");
        if (storedUser && !profile) {
          const user = JSON.parse(storedUser);
          setUserData({
            name: user.name || "User",
            role: user.role || "Staff",
            profilePicture: user.profilePicture || null,
          });
        }
      }
    } catch (error) {
      console.error("Error initializing sidebar user:", error);
      
      // Fallback to localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserData({
          name: user.name || "User",
          role: user.role || "Staff",
          profilePicture: user.profilePicture || null,
        });
      }
    }
  };

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
        <div className="sidebar-profile-avatar">
          {userData.profilePicture ? (
            <img src={userData.profilePicture} alt="Profile" className="sidebar-profile-pic" />
          ) : (
            <FaUserCircle className="profile-avatar-icon" />
          )}
        </div>
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