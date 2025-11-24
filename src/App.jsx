import React, { useState } from "react";

import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import ForgotPass from "./auth/ForgotPass";
import ConfirmCode from "./auth/ConfirmCode";
import NewPassword from "./auth/NewPass";
import ResetSuccess from "./auth/ResetSuccess";

import RouteLayout from "./common/RouteLayout";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const [page, setPage] = useState("signin");

  const handleNavigate = (targetPage) => {
    setPage(targetPage);
  };

  const isAuthPage =
    page === "signin" ||
    page === "signup" ||
    page === "forgot" ||
    page === "confirmCode" ||
    page === "newPassword" ||
    page === "resetSuccess";

  return (
    <>
      {/* AUTH PAGES */}
      {page === "signin" && <SignIn onNavigate={setPage} />}
      {page === "signup" && <SignUp onNavigate={setPage} />}
      {page === "forgot" && <ForgotPass onNavigate={setPage} />}
      {page === "confirmCode" && <ConfirmCode onNavigate={setPage} />}
      {page === "newPassword" && <NewPassword onNavigate={setPage} />}
      {page === "resetSuccess" && <ResetSuccess onNavigate={setPage} />}

      {/* APP PAGES (with sidebar inside RouteLayout) */}
      {!isAuthPage && (
        <RouteLayout onNavigate={handleNavigate} currentPage={page}>
          {page === "dashboard" && <Dashboard />}
        </RouteLayout>
      )}
    </>
  );
}

export default App;
