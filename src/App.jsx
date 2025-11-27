import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthRoute from "./auth/AuthRoute";
import RouteLayout from "./common/RouteLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/inventory-management/Inventory";
import AddItem from "./pages/inventory-management/AddItem";
import UpdateItem from "./pages/inventory-management/UpdateItem";
import PurchasedOrder from "./pages/master-data/PurchasedOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/signin" />} />

        {/* Auth pages */}
        <Route path="/auth/*" element={<AuthRoute />} />

        {/* MAIN LAYOUT */}
        <Route element={<RouteLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* INVENTORY */}
          <Route path="/inventoryItems" element={<Inventory />} />
          <Route path="/inventoryItems/new" element={<AddItem />} />
          <Route path="/inventoryItems/update/:id" element={<UpdateItem />} />

          {/* PURCHASED ORDER */}
          <Route path="/purchasedOrder" element={<PurchasedOrder />} />

          {/* OTHER */}
          <Route path="/reports" element={<div>Reports Page</div>} />
          <Route path="/users" element={<div>Users Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
