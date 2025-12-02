import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthRoute from "./auth/AuthRoute";
import RouteLayout from "./common/RouteLayout";

import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/inventory-management/Inventory";
import AddItem from "./pages/inventory-management/AddItem";
import UpdateItem from "./pages/inventory-management/UpdateItem";
import PurchasedOrder from "./pages/master-data/PurchasedOrder";
import Reports from "./pages/user-management/Reports";   // ✔ correct import
import Users from "./pages/user-management/Users";     
import Settings from "./pages/user-management/Settings";     

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
          
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Inventory */}
          <Route path="/inventoryItems" element={<Inventory />} />
          <Route path="/inventoryItems/new" element={<AddItem />} />
          <Route path="/inventoryItems/update/:id" element={<UpdateItem />} />

          {/* Purchase Orders */}
          <Route path="/purchasedOrder" element={<PurchasedOrder />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Users Page */}
          <Route path="/users" element={<Users />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
