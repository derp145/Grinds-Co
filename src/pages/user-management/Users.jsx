import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Import supabase
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    email: "",
  });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // -----------------------
  // FETCH USERS FROM SUPABASE
  // -----------------------
  const fetchUsers = async () => {
  setLoading(true);

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error("No user logged in");
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  } else {
    console.log("Fetched users:", data); // Debug log
    setUsers(data || []);
  }

  setLoading(false);
};

  // -----------------------
  // HANDLE CHANGE
  // -----------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------
  // OPEN EDIT USER
  // -----------------------
  const openEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      role: user.role,
      email: user.email,
    });
    setShowForm(true);
  };

  // -----------------------
  // SAVE USER (UPDATE ONLY)
  // -----------------------
  const saveUser = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        role: formData.role,
        email: formData.email,
      })
      .eq("id", editingUser.id);

    if (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    } else {
      await fetchUsers(); // Refresh list
      setShowForm(false);
    }
  };

  // -----------------------
  // DELETE USER
  // -----------------------
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const deleteUser = async () => {
    // Delete from profiles (will cascade delete from auth.users due to CASCADE)
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userToDelete.id);

    if (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } else {
      await fetchUsers(); // Refresh list
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="users-page">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="header-row">
        <h2>Users</h2>
        <p className="muted">Manage user profiles</p>
      </div>

      {/* USERS TABLE */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>
                No users found.
              </td>
            </tr>
          )}

          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>
              <td className="actions-col">
                <button className="edit-btn" onClick={() => openEditUser(u)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => confirmDelete(u)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* POPUP FORM (EDIT ONLY) */}
      {showForm && (
        <div className="popup-bg">
          <div className="popup-box scrollable-popup">
            <h3>Edit User</h3>

            <div className="form-group">
              <label>Name</label>
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="btn-row">
              <button className="save-btn" onClick={saveUser}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM POPUP */}
      {showDeleteConfirm && (
        <div className="popup-bg">
          <div className="delete-popup">
            <p>
              Are you sure you want to delete{" "}
              <strong>{userToDelete.full_name}</strong>?
            </p>
            <div className="btn-row">
              <button className="delete-btn" onClick={deleteUser}>
                Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;