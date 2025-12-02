import React, { useState, useEffect } from "react";
import "./PurchasedOrder.css";


const dummyOrders = [
  {
    id: 1,
    item: "Espresso Roast Beans",
    supplier: "Roastery North",
    quantity: 20,
    eta: "2025-11-20",
    status: "Scheduled",
  },
  {
    id: 2,
    item: "Oat Milk",
    supplier: "Sunrise Creamery",
    quantity: 18,
    eta: "2025-11-19",
    status: "Confirmed",
  },
  {
    id: 3,
    item: "Vanilla Syrup",
    supplier: "Sweet Leaf Co.",
    quantity: 30,
    eta: "2025-11-22",
    status: "Draft",
  },
];

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

  useEffect(() => {
    setOrders(dummyOrders);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCreateOrder = () => {
    const newOrder = {
      id: Date.now(),
      ...form,
    };
    setOrders([newOrder, ...orders]);
    setForm({ supplier: "", item: "", quantity: 1, eta: "", status: "Draft" });
  };

  const confirmRemove = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleRemove = () => {
    setOrders(orders.filter((o) => o.id !== selectedId));
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

      {/* CREATE ORDER FORM */}
      <div className="po-form">
        <input
          type="text"
          name="supplier"
          placeholder="Supplier"
          value={form.supplier}
          onChange={handleFormChange}
        />
        <input
          type="text"
          name="item"
          placeholder="Item"
          value={form.item}
          onChange={handleFormChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          min="1"
          value={form.quantity}
          onChange={handleFormChange}
        />
        <input
          type="date"
          name="eta"
          value={form.eta}
          onChange={handleFormChange}
        />
        <select name="status" value={form.status} onChange={handleFormChange}>
          <option>Draft</option>
          <option>Scheduled</option>
          <option>Confirmed</option>
        </select>
        <button onClick={handleCreateOrder}>Create order</button>
      </div>

      {/* ORDERS CARDS */}
      <div className="po-cards">
        {orders.map((o) => (
          <div className="po-card" key={o.id}>
            <div className="po-card-header">
              <h3>{o.item}</h3>
              <span className={`po-status ${o.status.toLowerCase()}`}>{o.status}</span>
            </div>
            <p className="po-supplier">{o.supplier}</p>
            <p>Quantity: {o.quantity}</p>
            <p>ETA: {o.eta}</p>
            <select
              value={o.status}
              onChange={(e) =>
                setOrders(
                  orders.map((order) =>
                    order.id === o.id ? { ...order, status: e.target.value } : order
                  )
                )
              }
            >
              <option>Draft</option>
              <option>Scheduled</option>
              <option>Confirmed</option>
            </select>
            <button className="po-remove" onClick={() => confirmRemove(o.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* CONFIRMATION MODAL */}
      {/* CONFIRMATION MODAL */}
{showConfirm && (
  <div className="modal-overlay">
    <div className="modal">
      <p>Are you sure you want to remove this order?</p>
      <div className="modal-buttons">
        <button className="cancel-btn" onClick={cancelRemove}>No</button>
        <button className="confirm-btn" onClick={handleRemove}>Yes</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default PurchasedOrder;
