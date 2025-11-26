import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function ResetSuccess() {
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate("/auth/signin");
  };

  return (
    <div className="container">

      {/* LEFT SECTION */}
      <div className="left-section">
        <img src={logo} alt="Logo" className="logo-images" />
        <h1 className="headline">
          Password<br />Reset Successful
        </h1>
        <p className="subtext">
          Everything is all set. You may now sign in safely.
        </p>
        <div className="coffee-images">
          <img src={coffee} alt="Coffee" />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <h1 className="welcome">All Done!</h1>
        <p className="desc">Your password has been successfully updated.</p>

        <div className="success-check">✅</div>

        <button
          type="button"
          className="signin-btn"
          onClick={goToSignIn}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}

export default ResetSuccess;
