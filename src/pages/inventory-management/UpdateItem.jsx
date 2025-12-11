  import React, { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { supabase } from "../../supabaseClient";
  import "./Inventory.css";

  const UpdateItem = () => {
    const navigate = useNavigate();
    const { id } = useParams();

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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

    useEffect(() => {
      fetchItem();
    }, [id]);

    const fetchItem = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("inventory")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching item:", fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (data) {
        setForm({
          name: data.name,
          category: data.category,
          supplier: data.supplier,
          unit: data.unit,
          quantity: data.quantity.toString(),
          reorder: data.reorder_point.toString(),
          unitCost: data.unit_cost.toString(),
        });
      }

      setLoading(false);
    };

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
      e.preventDefault();
      setError("");
      setSaving(true);

      const { error: updateError } = await supabase
        .from("inventory")
        .update({
          name: form.name,
          category: form.category,
          supplier: form.supplier,
          unit: form.unit,
          quantity: parseFloat(form.quantity) || 0,
          reorder_point: parseFloat(form.reorder) || 0,
          unit_cost: parseFloat(form.unitCost) || 0,
        })
        .eq("id", id);
        // REMOVED: .eq("user_id", user.id)

      setSaving(false);

      if (updateError) {
        console.error("Error updating item:", updateError);
        setError(updateError.message);
        return;
      }

      navigate("/inventoryItems");
    };

    const handleDelete = async () => {
      const { error: deleteError } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id);
        // REMOVED: .eq("user_id", user.id)

      if (deleteError) {
        console.error("Error deleting item:", deleteError);
        setError(deleteError.message);
        setDeletePopup(false);
        return;
      }

      navigate("/inventoryItems");
    };

    if (loading) {
      return (
        <div className="item-form-page">
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading item...
          </div>
        </div>
      );
    }

    return (
      <div className="item-form-page">
        <div className="item-form-header">
          <div>
            <p className="eyebrow">Update Item</p>
            <h1>Edit Inventory Item</h1>
          </div>
        </div>

        <form className="form-card" onSubmit={handleUpdate}>
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
          <div className="form-actions">
            <button
              type="button"
              className="big-delete"
              onClick={() => setDeletePopup(true)}
              disabled={saving}
            >
              Delete Item
            </button>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="cancel-btn"
                type="button"
                onClick={() => navigate("/inventoryItems")}
                disabled={saving}
              >
                Cancel
              </button>

              <button className="create-btn" type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <span className="btn-spinner"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>

        {deletePopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <h3>Delete Item?</h3>
              <p>This action cannot be undone.</p>

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