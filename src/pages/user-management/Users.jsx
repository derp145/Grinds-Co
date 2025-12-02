// Users.jsx
import React, { useState } from "react";
import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Dela Cruz", role: "Admin", email: "juan@example.com" },
    { id: 2, name: "Maria Santos", role: "Staff", email: "maria@example.com" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
  });

  // -----------------------
  // HANDLE CHANGE
  // -----------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------
  // OPEN ADD USER
  // -----------------------
  const openAddUser = () => {
    setEditingUser(null);
    setFormData({ name: "", role: "", email: "" });
    setShowForm(true);
  };

  // -----------------------
  // OPEN EDIT USER
  // -----------------------
  const openEditUser = (user) => {
    setEditingUser(user);
    setFormData(user);
    setShowForm(true);
  };

  // -----------------------
  // SAVE USER
  // -----------------------
  const saveUser = () => {
    if (editingUser) {
      // update
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...formData } : u
        )
      );
    } else {
      // create new
      const newUser = {
        id: Date.now(),
        ...formData,
      };
      setUsers([...users, newUser]);
    }
    setShowForm(false);
  };

  // -----------------------
  // DELETE USER
  // -----------------------
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const deleteUser = () => {
    setUsers(users.filter((u) => u.id !== userToDelete.id));
    setShowDeleteConfirm(false);
  };

  return (
    <div className="users-page">
      <div className="header-row">
        <h2>Users</h2>
        <button className="add-btn" onClick={openAddUser}>+ Add User</button>
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
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>
              <td className="actions-col">
                <button className="edit-btn" onClick={() => openEditUser(u)}>Edit</button>
                <button className="delete-btn" onClick={() => confirmDelete(u)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* POPUP FORM */}
      {showForm && (
        <div className="popup-bg">
          <div className="popup-box scrollable-popup">
            <h3>{editingUser ? "Edit User" : "Add User"}</h3>

            <div className="form-group">
              <label>Name</label>
              <input name="name" value={formData.name} onChange={handleChange} />
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
              <input name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="btn-row">
              <button className="save-btn" onClick={saveUser}>Save</button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM POPUP */}
      {showDeleteConfirm && (
        <div className="popup-bg">
          <div className="delete-popup">
            <p>Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
            <div className="btn-row">
              <button className="delete-btn" onClick={deleteUser}>Delete</button>
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
