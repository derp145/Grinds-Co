// Inventory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./inventory.css";

const Inventory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inventory")) || [];
    setItems(stored);
  }, []);

  const handleDelete = () => {
    const updated = items.filter((i) => i.id !== deleteId);
    localStorage.setItem("inventory", JSON.stringify(updated));
    setItems(updated);
    setDeleteId(null);
  };

  const filteredItems = items.filter((item) => {
    const s = search.toLowerCase();

    return (
      item.name.toLowerCase().startsWith(s) ||
      item.category.toLowerCase().startsWith(s) ||
      item.supplier.toLowerCase().startsWith(s) ||
      item.unit.toLowerCase().startsWith(s)
    );
  });

  return (
    <div className="inventory-page">
      <div className="inv-header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Every bean, syrup, and pastry tracked.</h1>
        </div>

        <div className="inv-header-right">
          <input
            className="search-bar"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="new-item-btn" onClick={() => navigate("/inventoryItems/new")}>
            + New Item
          </button>
        </div>
      </div>

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
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No matching items.
                </td>
              </tr>
            )}

            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="item-name">{item.name}</div>
                  <div className="reorder">Reorder @ {item.reorder}</div>
                </td>

                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.supplier}</td>
                <td>{item.updated}</td>
                <td>₱{item.unitCost}</td>

                <td className="actions">
                  <button className="edit" onClick={() => navigate(`/inventoryItems/update/${item.id}`)}>
                    Edit
                  </button>

                  <button className="delete" onClick={() => setDeleteId(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Delete Item?</h3>
            <p>This action cannot be undone.</p>

            <div className="popup-actions">
              <button className="cancel-btn" onClick={() => setDeleteId(null)}>
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

export default Inventory;
