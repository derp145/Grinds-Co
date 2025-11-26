import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthRoute from "./Routes/AuthRoute";
import RouteLayout from "./common/RouteLayout";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages (no layout) */}
        <Route path="/auth/*" element={<AuthRoute />} />

        {/* Main app pages (with layout) */}
        <Route path="/*" element={<RouteLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* Add more pages here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
