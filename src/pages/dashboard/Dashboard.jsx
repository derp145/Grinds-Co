import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockCount: 0,
    purchaseOrderCount: 0,
    lowStockItems: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription to inventory changes
    const subscription = supabase
      .channel('dashboard-inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          // Refresh dashboard data when inventory changes
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    // Fetch ALL inventory items (not filtered by user_id)
    const { data: inventoryData, error: invError } = await supabase
      .from("inventory")
      .select("*");

    if (invError) {
      console.error("Error fetching inventory:", invError);
    }

    // Fetch purchase orders (ALL orders)
    const { data: ordersData, error: ordersError } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("eta", { ascending: true })
      .limit(3);

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
    }

    // Calculate stats
    const inventory = inventoryData || [];
    const orders = ordersData || [];

    // Find items at or below reorder point (matching Header.jsx logic)
    const lowStock = inventory.filter(
      (item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const reorderPoint = parseFloat(item.reorder_point) || 10;
        return quantity <= reorderPoint;
      }
    );

    // Sort low stock by how far below reorder point (most critical first)
    const sortedLowStock = lowStock
      .sort((a, b) => {
        const quantityA = parseFloat(a.quantity) || 0;
        const reorderPointA = parseFloat(a.reorder_point) || 10;
        const diffA = reorderPointA - quantityA;
        
        const quantityB = parseFloat(b.quantity) || 0;
        const reorderPointB = parseFloat(b.reorder_point) || 10;
        const diffB = reorderPointB - quantityB;
        
        return diffB - diffA;
      })
      .slice(0, 3);

    // Calculate total purchase orders count
    const { count: totalOrdersCount } = await supabase
      .from("purchase_orders")
      .select("*", { count: "exact", head: true });

    setStats({
      totalItems: inventory.length,
      lowStockCount: lowStock.length,
      purchaseOrderCount: totalOrdersCount || 0,
      lowStockItems: sortedLowStock,
      recentOrders: orders,
    });

    setLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

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
          <h3>{stats.totalItems}</h3>
          <p className="card-desc">Across beans, syrups, dairy, and dry goods.</p>
        </div>

        <div className="card">
          <p className="card-subtitle">Needs attention</p>
          <h3>
            {stats.lowStockCount} 
            {stats.lowStockCount > 0 && <span className="accent"> ⚠️</span>}
          </h3>
          <p className="card-desc">Items at or below reorder point.</p>
        </div>

        <div className="card">
          <p className="card-subtitle">Purchase orders</p>
          <h3>{stats.purchaseOrderCount}</h3>
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

          {stats.lowStockItems.length === 0 ? (
            <ul className="list">
              <li>All items are above their reorder point.</li>
            </ul>
          ) : (
            <ul className="list">
              {stats.lowStockItems.map((item) => {
                const quantity = parseFloat(item.quantity) || 0;
                const reorderPoint = parseFloat(item.reorder_point) || 10;
                const isCritical = quantity <= (reorderPoint - 5);
                
                return (
                  <li key={item.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {isCritical ? (
                        <span style={{ fontSize: "14px" }}>🔴</span>
                      ) : (
                        <span style={{ fontSize: "14px" }}>⚠️</span>
                      )}
                      <strong>{item.name}</strong>
                    </div>
                    <span style={{ 
                      color: isCritical ? "#dc2626" : "#f59e0b",
                      fontWeight: "500"
                    }}>
                      {quantity} {item.unit} (Reorder @ {reorderPoint})
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <button 
            className="btn-secondary"
            onClick={() => navigate("/inventoryItems")}
          >
            View inventory
          </button>
        </div>

        {/* RIGHT LARGE CARD */}
        <div className="card large-card">
          <p className="card-subtitle">Purchase orders in motion</p>
          <h4 className="card-title">
            Incoming deliveries <span className="accent">🚚</span>
          </h4>

          {stats.recentOrders.length === 0 ? (
            <ul className="list">
              <li>No purchase orders yet.</li>
            </ul>
          ) : (
            <ul className="list">
              {stats.recentOrders.map((order) => (
                <li key={order.id}>
                  <strong>{order.item}</strong>
                  <span>
                    {order.status} • ETA {formatDate(order.eta)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <button 
            className="btn-secondary"
            onClick={() => navigate("/purchasedOrder")}
          >
            View purchase orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;