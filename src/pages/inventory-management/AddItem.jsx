import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Inventory.css";

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to add items");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("inventory")
      .insert([
        {
          name: form.name,
          category: form.category,
          supplier: form.supplier,
          unit: form.unit,
          quantity: parseFloat(form.quantity) || 0,
          reorder_point: parseFloat(form.reorder) || 0,
          unit_cost: parseFloat(form.unitCost) || 0,
          user_id: user.id,
        },
      ])
      .select();

    setLoading(false);

    if (insertError) {
      console.error("Error adding item:", insertError);
      setError(insertError.message);
      return;
    }

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
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <circle cx="10" cy="10" r="8" strokeWidth="2" />
              <path
                d="M10 6v4M10 14h.01"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </div>
        )}

        {/* ROW 1 */}
        <div className="form-row-3">
          <div className="form-group">
            <label>Name <span className="required">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category <span className="required">*</span></label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g., Beverages, Food"
              required
            />
          </div>

          <div className="form-group">
            <label>Supplier <span className="required">*</span></label>
            <input
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              placeholder="Supplier name"
              required
            />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="form-row-3">
          <div className="form-group">
            <label>Unit <span className="required">*</span></label>
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="e.g., kg, pcs, bags"
              required
            />
          </div>

          <div className="form-group">
            <label>On Hand <span className="required">*</span></label>
            <input
              name="quantity"
              type="number"
              step="0.01"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Reorder Point <span className="required">*</span></label>
            <input
              name="reorder"
              type="number"
              step="0.01"
              min="0"
              value={form.reorder}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        {/* ROW 3 */}
        <div className="unit-costing-row">
          <div className="form-group">
            <label>Unit Cost (₱) <span className="required">*</span></label>
            <div className="input-with-prefix">
              <span className="input-prefix">₱</span>
              <input
                name="unitCost"
                type="number"
                step="0.01"
                min="0"
                value={form.unitCost}
                onChange={handleChange}
                placeholder="0.00"
                className="input-with-prefix-field"
                required
              />
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="action-buttons">
          <button
            className="cancel-btn"
            type="button"
            onClick={() => navigate("/inventoryItems")}
            disabled={loading}
          >
            Cancel
          </button>

          <button className="create-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Saving...
              </>
            ) : (
              "Save Item"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;