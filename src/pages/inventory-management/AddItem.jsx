// AddItem.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inventory.css";

const AddItem = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    supplier: "",
    unit: "",
    quantity: "",
    reorder: "",
    unitCost: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stored = JSON.parse(localStorage.getItem("inventory")) || [];

    const newItem = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      supplier: form.supplier,
      unit: form.unit,
      quantity: form.quantity,
      reorder: form.reorder, // FIXED
      unitCost: form.unitCost,
      updated: new Date().toLocaleString(),
    };

    localStorage.setItem("inventory", JSON.stringify([...stored, newItem]));

    navigate("/inventoryItems");
  };

  return (
    <div className="item-form-page">
      <div className="item-form-header">
        <div>
          <p className="eyebrow">New Inventory Item</p>
          <h1>Add New Item</h1>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
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

        <div className="action-buttons">
          <button className="cancel-btn" type="button" onClick={() => navigate("/inventoryItems")}>
            Cancel
          </button>

          <button className="create-btn" type="submit">
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
