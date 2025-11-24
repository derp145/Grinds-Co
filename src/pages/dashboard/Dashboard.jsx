import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">

      {/* HEADER */}
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Welcome back! Here's an overview of your inventory activity.</p>

      {/* STAT CARDS */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Items</h3>
          <p className="card-value">152</p>
        </div>

        <div className="card">
          <h3>Low Stock</h3>
          <p className="card-value">12</p>
        </div>

        <div className="card">
          <h3>Suppliers</h3>
          <p className="card-value">8</p>
        </div>
      </div>

      {/* DUMMY TABLE */}
      <div className="dashboard-table">
        <h2>Recent Stock Activity</h2>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Coffee Beans</td>
              <td>Stock In</td>
              <td>40</td>
              <td>2025-01-12</td>
            </tr>
            <tr>
              <td>Milk</td>
              <td>Stock Out</td>
              <td>10</td>
              <td>2025-01-12</td>
            </tr>
            <tr>
              <td>Syrup</td>
              <td>Stock In</td>
              <td>15</td>
              <td>2025-01-11</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;
