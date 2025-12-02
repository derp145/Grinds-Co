// Settings.jsx
import React, { useState } from "react";
import "./settings.css";

const Settings = () => {
  const [form, setForm] = useState({
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    password: "",
    lowStockAlert: true,
    emailNotif: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="header-row">
        <h2>Settings</h2>
        <p className="muted">Update your account and system preferences</p>
      </div>

      {/* ACCOUNT CARD */}
      <div className="settings-card">
        <h3 className="card-title">Account Settings</h3>
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>
      </div>

      {/* NOTIFICATION CARD */}
      <div className="settings-card">
        <h3 className="card-title">Notification Settings</h3>

        <div className="toggle-row">
          <label>Low Stock Alert</label>
          <input
            type="checkbox"
            name="lowStockAlert"
            checked={form.lowStockAlert}
            onChange={handleChange}
          />
        </div>

        <div className="toggle-row">
          <label>Email Notifications</label>
          <input
            type="checkbox"
            name="emailNotif"
            checked={form.emailNotif}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SYSTEM INFO CARD */}
      <div className="settings-card">
        <h3 className="card-title">System Information</h3>

        <p><strong>System Version:</strong> v1.0</p>
        <p><strong>Developed by:</strong> Kyros Tech</p>
        <p><strong>Last Updated:</strong> 2025</p>
      </div>

      {/* SAVE BUTTON */}
      <button className="save-btn" onClick={saveSettings}>
        Save Changes
      </button>

      {saved && <p className="saved-msg">✔ Settings Saved</p>}
    </div>
  );
};

export default Settings;
