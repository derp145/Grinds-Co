// Reports.jsx
import React, { useEffect, useState } from "react";
import "./Reports.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inventory")) || [];
    setItems(stored);
  }, []);

  // SUMMARY
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitCost),
    0
  );

  // GROUP BY CATEGORY FOR GRAPH
  const categoryTotals = {};
  const categoryValues = {};

  items.forEach((item) => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = 0;
      categoryValues[item.category] = 0;
    }
    categoryTotals[item.category] += Number(item.quantity);
    categoryValues[item.category] += Number(item.quantity) * Number(item.unitCost);
  });

  const graphData = Object.keys(categoryTotals).map((cat) => ({
    category: cat,
    quantity: categoryTotals[cat],
    value: categoryValues[cat],
  }));

  return (
    <div className="reports-page">
      <h1 className="reports-title">Inventory Reports Dashboard</h1>
      <p className="reports-subtitle">Automated summary based on Inventory Items</p>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Items</h3>
          <p>{totalItems}</p>
        </div>

        <div className="summary-card">
          <h3>Total Quantity</h3>
          <p>{totalQuantity}</p>
        </div>

        <div className="summary-card">
          <h3>Total Inventory Value</h3>
          <p>₱{totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* ===== SINGLE GRAPH CONTAINER ===== */}
      <div className="report-section">
        <h2 className="report-subtitle">Inventory Breakdown</h2>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={graphData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />

              {/* Quantity */}
              <Bar dataKey="quantity" name="Stock Qty" fill="#6c4e31" />

              {/* Value */}
              <Bar dataKey="value" name="Stock Value (₱)" fill="#d8b48a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
