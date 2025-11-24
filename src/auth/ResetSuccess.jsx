import React from "react";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function ResetSuccess({ onNavigate }) {
  return (
    <div className="container">

      {/* LEFT SECTION — EXACT SAME AS ALL OTHER PAGES */}
      <div className="left-section">
        <div className="top-bars">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <img src={logo} alt="Grinds & Co Logo" className="logo-images" />

        <h1 className="headline">
          Password <br /> Reset Successful
        </h1>

        <p className="subtext">
          Your password has been updated.
        </p>

        <div className="coffee-images">
          <img src={coffee} alt="CoffeeCups" />
        </div>
      </div>

      {/* RIGHT SECTION — CUSTOM FOR SUCCESS PAGE */}
      <div className="right-section">
        <h1 className="welcome">All Done!</h1>
        <p className="desc">You can now log in with your new password.</p>

        <div className="success-container">
          <div className="success-check">✅</div>
        </div>

        <button
          className="signin-btn"
          onClick={() => onNavigate("signin")}
          style={{ marginTop: "1rem" }}
        >
          Back to Sign In
        </button>
      </div>

    </div>
  );
}

export default ResetSuccess;
