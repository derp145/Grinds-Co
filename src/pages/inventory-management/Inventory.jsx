import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Inventory.css";

const Inventory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inventory:", error);
    } else {
      setItems(data || []);
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("id", deleteId);

    if (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } else {
      await fetchItems();
    }
    
    setDeleteId(null);
  };

  const filteredItems = items.filter((item) => {
    const s = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(s) ||
      item.category.toLowerCase().includes(s) ||
      item.supplier.toLowerCase().includes(s) ||
      item.unit.toLowerCase().includes(s)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const isLowStock = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const reorderPoint = parseFloat(item.reorder_point) || 10;
    return quantity <= reorderPoint;
  };

  const isCriticalStock = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const reorderPoint = parseFloat(item.reorder_point) || 10;
    return quantity <= (reorderPoint - 5);
  };

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
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading inventory...
          </div>
        ) : (
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
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    {search ? "No matching items." : "No items yet. Click 'New Item' to add one."}
                  </td>
                </tr>
              )}

              {filteredItems.map((item) => (
                <tr 
                  key={item.id}
                  className={
                    isCriticalStock(item) ? "critical-stock-row" : 
                    isLowStock(item) ? "low-stock-row" : ""
                  }
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {isCriticalStock(item) && <span style={{ color: "#dc2626", fontSize: "16px" }}>🔴</span>}
                      {isLowStock(item) && !isCriticalStock(item) && <span style={{ color: "#f59e0b", fontSize: "16px" }}>⚠️</span>}
                      <div>
                        <div className="item-name">{item.name}</div>
                        <div className="reorder">Reorder @ {item.reorder_point}</div>
                      </div>
                    </div>
                  </td>

                  <td>{item.category}</td>
                  <td>
                    <span style={{ 
                      fontWeight: isLowStock(item) ? "bold" : "normal",
                      color: isCriticalStock(item) ? "#dc2626" : isLowStock(item) ? "#f59e0b" : "inherit"
                    }}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{item.unit}</td>
                  <td>{item.supplier}</td>
                  <td>{formatDate(item.updated_at)}</td>
                  <td>₱{parseFloat(item.unit_cost).toFixed(2)}</td>

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
        )}
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