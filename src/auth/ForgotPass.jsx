import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function ForgotPass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    localStorage.setItem("resetEmail", JSON.stringify(email));
    navigate("/auth/confirm-code");
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src={logo} className="logo-images" />
        <h1 className="headline">Forgot your<br />password?</h1>
        <p className="subtext">No worries — we’ll help you recover your account.</p>
        <div className="coffee-images"><img src={coffee} /></div>
      </div>

      <div className="right-section">
        <button className="back-btn" onClick={() => navigate("/auth/signin")}>
          ← Back to Sign In
        </button>

        <h1 className="welcome">Reset Password</h1>
        <p className="desc">Enter your email to receive a confirmation code.</p>

        <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="signin-btn" type="submit">Send Code</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPass;
