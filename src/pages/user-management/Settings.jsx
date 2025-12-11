import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./settings.css";

const Settings = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    lowStockAlert: true,
    profilePicture: "",
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch current user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Error getting user:", authError);
      setError("Failed to load user data");
      setLoading(false);
      return;
    }

    setUserId(user.id);

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      setError("Failed to load profile");
    } else if (profile) {
      setForm({
        name: profile.full_name || "",
        email: profile.email || "",
        password: "",
        lowStockAlert: profile.low_stock_alert ?? true,
        profilePicture: profile.profile_picture || "",
      });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Update form state
      setForm({ ...form, profilePicture: publicUrl });

      // Delete old profile picture if exists
      if (form.profilePicture) {
        const oldPath = form.profilePicture.split("/").slice(-2).join("/");
        await supabase.storage.from("avatars").remove([oldPath]);
      }

    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload profile picture: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveSettings = async () => {
    setError("");
    setSaved(false);

    if (!userId) {
      setError("User not authenticated");
      return;
    }

    try {
      // 1. Update profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: form.name,
          email: form.email,
          low_stock_alert: form.lowStockAlert,
          profile_picture: form.profilePicture,
        })
        .eq("id", userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        setError("Failed to update profile");
        return;
      }

      // 2. Update password if provided
      if (form.password && form.password.trim() !== "") {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: form.password,
        });

        if (passwordError) {
          console.error("Password update error:", passwordError);
          setError("Profile updated but password change failed: " + passwordError.message);
          return;
        }
      }

      // Success!
      setSaved(true);
      setForm({ ...form, password: "" }); // Clear password field
      setTimeout(() => setSaved(false), 3000);

    } catch (err) {
      console.error("Save error:", err);
      setError("An error occurred while saving");
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div style={{ textAlign: "center", padding: "60px" }}>
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      {/* HEADER */}
      <div className="header-row">
        <h2>Settings</h2>
        <p className="muted">Update your account and system preferences</p>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          background: "#fef2f2",
          color: "#991b1b",
          padding: "14px 18px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "1px solid #fecaca"
        }}>
          {error}
        </div>
      )}

      {/* ACCOUNT CARD */}
      <div className="settings-card">
        <h3 className="card-title">Account Settings</h3>
        
        {/* Profile Picture Upload */}
        <div className="form-group">
          <label>Profile Picture</label>
          <div className="profile-picture-section">
            <div className="profile-preview">
              {form.profilePicture ? (
                <img src={form.profilePicture} alt="Profile" />
              ) : (
                <div className="profile-placeholder">No Image</div>
              )}
            </div>
            <div className="profile-upload">
              <input
                type="file"
                id="profile-pic-upload"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="profile-pic-upload" className="upload-btn">
                {uploading ? "Uploading..." : "Choose Image"}
              </label>
              <p className="upload-hint">Max size: 2MB. Formats: JPG, PNG, GIF</p>
            </div>
          </div>
        </div>

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
            placeholder="Leave blank to keep current password"
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

      {saved && <p className="saved-msg">✔ Settings Saved Successfully!</p>}
    </div>
  );
};

export default Settings;