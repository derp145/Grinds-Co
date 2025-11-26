// InventoryPage.jsx
import React from "react";
import "./inventory.css";

const Inventory = () => {
  return (
    <div className="inventory-page">

      {/* PAGE HEADER */}
      <div className="inv-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Every bean, syrup, and pastry tracked.</h1>
        </div>

        <div className="inv-header-right">
          <input
            type="text"
            className="search-bar"
            placeholder="Search beans, suppliers, categories..."
          />
          <button className="new-item-btn">+ New Item</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="inv-table">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>On hand</th>
              <th>Unit</th>
              <th>Supplier</th>
              <th>Updated</th>
              <th>Unit cost</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                Espresso Roast Beans
                <span className="reorder">Reorder @ 10</span>
              </td>
              <td>Coffee Beans</td>
              <td>18</td>
              <td>bags</td>
              <td>Roastery North</td>
              <td>2025-11-15</td>
              <td>₱32.50</td>
              <td className="actions">
                <button className="edit">Edit</button>
                <button className="delete">Delete</button>
              </td>
            </tr>

            {/* Duplicate similar rows below */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
