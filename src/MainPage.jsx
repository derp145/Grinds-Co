import React from "react";

function MainPage({ onNavigate }) {
  const handleLogout = () => {
    localStorage.removeItem("user"); // remove dummy login
    onNavigate("signin"); // go back to sign in page
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#0B1F50", // dark blue
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1>Welcome to the Main Page!</h1>
      <p>This is a dummy page after signing in.</p>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#af2222ff",
          color: "#0B1F50",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default MainPage;
