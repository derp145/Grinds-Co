// AddItem.jsx
import React from "react";
import "./inventory.css";

const AddItem = () => {
  return (
    <div className="item-form-page">
      <p className="eyebrow">Add New Item</p>
      <h1>New ingredient or supply</h1>

      <div className="form-card">

        <div className="form-row">
          <div className="form-group">
            <label>Item Name</label>
            <input type="text" placeholder="Single origin espresso beans" />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input type="text" placeholder="Coffee beans" />
            <small>Start typing to reuse a category or create a new one.</small>
          </div>

          <div className="form-group">
            <label>Supplier</label>
            <input type="text" placeholder="Roastery North" />
            <small>Pick an existing supplier or type a new partner.</small>
          </div>

          <div className="form-group">
            <label>Unit</label>
            <input type="text" placeholder="bags / cases / bottles" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>On hand quantity</label>
            <input type="number" />
          </div>

          <div className="form-group">
            <label>Reorder point</label>
            <input type="number" />
          </div>

          <div className="form-group">
            <label>Unit cost (PHP)</label>
            <input type="number" />
            <small>Enter price in Philippine peso (₱).</small>
          </div>
        </div>

        <div className="form-actions">
          <button className="cancel">Cancel</button>
          <button className="create">Create item</button>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
