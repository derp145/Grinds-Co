// UpdateItem.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./inventory.css";

const UpdateItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);

  const [form, setForm] = useState({
    name: "",
    category: "",
    supplier: "",
    unit: "",
    quantity: "",
    reorder: "",
    unitCost: "",
  });

  const [deletePopup, setDeletePopup] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inventory")) || [];
    const item = stored.find((i) => i.id === numericId);

    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        supplier: item.supplier,
        unit: item.unit,
        quantity: item.quantity,
        reorder: item.reorder,
        unitCost: item.unitCost,
      });
    }
  }, [numericId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const stored = JSON.parse(localStorage.getItem("inventory")) || [];

    const updated = stored.map((i) =>
      i.id === numericId
        ? {
            ...i,
            ...form,
            updated: new Date().toLocaleString(),
          }
        : i
    );

    localStorage.setItem("inventory", JSON.stringify(updated));

    navigate("/inventoryItems");
  };

  const handleDelete = () => {
    const stored = JSON.parse(localStorage.getItem("inventory")) || [];
    const updated = stored.filter((i) => i.id !== numericId);

    localStorage.setItem("inventory", JSON.stringify(updated));

    navigate("/inventoryItems");
  };

  return (
    <div className="item-form-page">
      <div className="item-form-header">
        <div>
          <p className="eyebrow">Update Item</p>
          <h1>Edit Inventory Item</h1>
        </div>
      </div>

      <form className="form-card" onSubmit={handleUpdate}>
        <div className="form-row-3">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input name="category" value={form.category} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Supplier</label>
            <input name="supplier" value={form.supplier} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row-3">
          <div className="form-group">
            <label>Unit</label>
            <input name="unit" value={form.unit} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>On Hand</label>
            <input name="quantity" value={form.quantity} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Reorder Point</label>
            <input name="reorder" value={form.reorder} onChange={handleChange} />
          </div>
        </div>

        <div className="unit-costing-row">
          <div className="form-group">
            <label>Unit Cost</label>
            <input name="unitCost" value={form.unitCost} onChange={handleChange} />
          </div>
        </div>

        {/* 🔄 BUTTONS SWAPPED */}
        <div className="form-actions">

          {/* LEFT: Save Changes */}
          <button type="submit" className="create-btn">
            Save Changes
          </button>

          {/* RIGHT: Delete Item */}
          <button
            type="button"
            className="big-delete"
            onClick={() => setDeletePopup(true)}
          >
            Delete Item
          </button>
        </div>
      </form>

      {deletePopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Delete Item?</h3>
            <p>This cannot be undone.</p>

            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => setDeletePopup(false)}>
                Cancel
              </button>

              <button className="delete" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateItem;
