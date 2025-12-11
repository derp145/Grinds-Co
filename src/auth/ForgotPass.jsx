import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function ForgotPass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    const trimmedEmail = email.trim();

    // Send OTP email using Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        shouldCreateUser: false, // Only send to existing users
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Show success message
    setMessage("A verification code has been sent to your email.");

    // Store email in localStorage so ConfirmCode page can access it
    localStorage.setItem("resetEmail", JSON.stringify(trimmedEmail));

    // Wait 2.5 seconds before navigating to give user time to read
    setTimeout(() => {
      navigate("/auth/confirm-code");
    }, 2500);
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src={logo} className="logo-images" alt="Logo" />
        <h1 className="headline">Forgot your<br />password?</h1>
        <p className="subtext">No worries — we'll help you recover your account.</p>
        <div className="coffee-images"><img src={coffee} alt="Coffee" /></div>
      </div>

      <div className="right-section">
        <button className="back-btn" onClick={() => navigate("/auth/signin")}>
          ← Back to Sign In
        </button>

        <h1 className="welcome">Reset Password</h1>
        <p className="desc">Enter your email to receive a verification code.</p>

        <form onSubmit={handleSendCode}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}

          <button className="signin-btn" type="submit">Send Code</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPass;