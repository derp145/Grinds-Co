import React from "react";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dash-header">
        <p className="eyebrow">Today</p>
        <h2>Morning roast overview</h2>
        <p className="muted">Track beans, syrups, and purchase orders before the rush.</p>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-three">
        <div className="card">
          <p className="card-subtitle">Active SKUs</p>
          <h3>4</h3>
          <p className="card-desc">Across beans, syrups, dairy, and dry goods.</p>
        </div>

        <div className="card">
          <p className="card-subtitle">Needs attention</p>
          <h3>0 <span className="accent">⚠️</span></h3>
          <p className="card-desc">Items at or below reorder point.</p>
        </div>

        <div className="card">
          <p className="card-subtitle">Purchase orders</p>
          <h3>3</h3>
          <p className="card-desc">
            Keep suppliers in sync to avoid shortages.
          </p>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-two">
        {/* LEFT LARGE CARD */}
        <div className="card large-card">
          <p className="card-subtitle">Top 3 low stock</p>
          <h4 className="card-title">
            Critical inventory <span className="accent">☕</span>
          </h4>

          <ul className="list">
            <li>All items are above their reorder point.</li>
          </ul>
        </div>

        {/* RIGHT LARGE CARD */}
        <div className="card large-card">
          <p className="card-subtitle">Purchase orders in motion</p>
          <h4 className="card-title">
            Incoming deliveries <span className="accent">🚚</span>
          </h4>

          <ul className="list">
            <li>
              <strong>Espresso Roast Beans</strong>
              <span>Scheduled • ETA 2025-11-20</span>
            </li>

            <li>
              <strong>Oat Milk</strong>
              <span>Confirmed • ETA 2025-11-19</span>
            </li>

            <li>
              <strong>Vanilla Syrup</strong>
              <span>Draft • ETA 2025-11-22</span>
            </li>
          </ul>

          <button className="btn-secondary">View purchase orders</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
