import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import "./PurchasedOrder.css";

const PurchasedOrder = () => {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    supplier: "",
    item: "",
    quantity: 1,
    eta: "",
    status: "Draft",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      setLoading(false);
      return;
    }

    // Fetch ALL orders with profile info (who created it)
    const { data, error: fetchError } = await supabase
      .from("purchase_orders")
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching orders:", fetchError);
      setError("Failed to load orders");
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreateOrder = async () => {
    setError("");

    // Validate form
    if (!form.supplier || !form.item || !form.eta) {
      setError("Please fill in all required fields");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("purchase_orders")
      .insert([
        {
          supplier: form.supplier,
          item: form.item,
          quantity: parseFloat(form.quantity) || 1,
          eta: form.eta,
          status: form.status,
          user_id: user.id,
        },
      ])
      .select();

    if (insertError) {
      console.error("Error creating order:", insertError);
      setError("Failed to create order");
      return;
    }

    // Reset form and refresh
    setForm({ supplier: "", item: "", quantity: 1, eta: "", status: "Draft" });
    await fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const { error: updateError } = await supabase
      .from("purchase_orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating status:", updateError);
      setError("Failed to update status");
      return;
    }

    // Update local state
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const confirmRemove = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleRemove = async () => {
    const { error: deleteError } = await supabase
      .from("purchase_orders")
      .delete()
      .eq("id", selectedId);

    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      setError("Failed to delete order");
      setShowConfirm(false);
      return;
    }

    // Refresh orders
    await fetchOrders();
    setShowConfirm(false);
    setSelectedId(null);
  };

  const cancelRemove = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  return (
    <div className="po-page">
      <p className="po-eyebrow">SUPPLIERS & DELIVERIES</p>
      <h1 className="po-title">Purchase orders</h1>

      {error && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#fee", 
          color: "#c00", 
          borderRadius: "4px", 
          marginBottom: "15px" 
        }}>
          {error}
        </div>
      )}

      {/* CREATE ORDER FORM */}
      <div className="po-form">
        <input
          type="text"
          name="supplier"
          placeholder="Supplier *"
          value={form.supplier}
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="item"
          placeholder="Item *"
          value={form.item}
          onChange={handleFormChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          min="1"
          step="0.01"
          value={form.quantity}
          onChange={handleFormChange}
        />
        <input
          type="date"
          name="eta"
          value={form.eta}
          onChange={handleFormChange}
          required
        />
        <select name="status" value={form.status} onChange={handleFormChange}>
          <option>Draft</option>
          <option>Scheduled</option>
          <option>Confirmed</option>
        </select>
        <button onClick={handleCreateOrder}>Create order</button>
      </div>

      {/* ORDERS CARDS */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading orders...
        </div>
      ) : (
        <div className="po-cards">
          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              No purchase orders yet. Create one above to get started.
            </div>
          ) : (
            orders.map((o) => (
              <div className="po-card" key={o.id}>
                <div className="po-card-header">
                  <h3>{o.item}</h3>
                  <span className={`po-status ${o.status.toLowerCase()}`}>
                    {o.status}
                  </span>
                </div>
                <p className="po-supplier">{o.supplier}</p>
                <p>Quantity: {o.quantity}</p>
                <p>ETA: {new Date(o.eta).toLocaleDateString()}</p>
                {o.profiles && (
                  <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "5px" }}>
                    Created by: {o.profiles.full_name || "Unknown"}
                  </p>
                )}
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                >
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Confirmed</option>
                </select>
                <button className="po-remove" onClick={() => confirmRemove(o.id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to remove this order?</p>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={cancelRemove}>
                No
              </button>
              <button className="confirm-btn" onClick={handleRemove}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasedOrder;