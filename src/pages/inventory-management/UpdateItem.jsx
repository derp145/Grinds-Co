// UpdateItem.jsx
import React from "react";
import "./inventory.css";

const UpdateItem = () => {
  return (
    <div className="item-form-page">
      <p className="eyebrow">Update Item</p>
      <h1>Espresso Roast Beans</h1>

      <div className="form-card">

        <div className="form-row">
          <div className="form-group">
            <label>Item Name</label>
            <input type="text" defaultValue="Espresso Roast Beans" />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input type="text" defaultValue="Coffee Beans" />
          </div>

          <div className="form-group">
            <label>Supplier</label>
            <input type="text" defaultValue="Roastery North" />
          </div>

          <div className="form-group">
            <label>Unit</label>
            <input type="text" defaultValue="bags" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>On hand quantity</label>
            <input type="number" defaultValue={18} />
          </div>

          <div className="form-group">
            <label>Reorder point</label>
            <input type="number" defaultValue={10} />
          </div>

          <div className="form-group">
            <label>Unit cost (PHP)</label>
            <input type="number" defaultValue={32.5} />
          </div>
        </div>

        <div className="form-actions two-buttons">
          <button className="cancel">Cancel</button>
          <button className="delete big-delete">Delete item</button>
          <button className="create">Save changes</button>
        </div>

      </div>
    </div>
  );
};

export default UpdateItem;
