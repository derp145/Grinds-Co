import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function NewPass() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user came from OTP verification
    const otpVerified = localStorage.getItem("otpVerified");
    if (!otpVerified) {
      // If not verified, redirect back
      navigate("/auth/forgot");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPass) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message || "Failed to update password. Please try again.");
      return;
    }

    // Clear localStorage
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("otpVerified");

    // Success! Navigate to success page
    navigate("/auth/reset-success");
  };

  return (
    <div className="container">
      {/* LEFT SIDE */}
      <div className="left-section">
        <img src={logo} className="logo-images" alt="Logo" />
        <h1 className="headline">Create<br />New Password</h1>
        <p className="subtext">Make sure your new password is strong.</p>
        <div className="coffee-images"><img src={coffee} alt="Coffee" /></div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">

        {/* BACK BUTTON */}
        <button className="back-btn" onClick={() => navigate("/auth/confirm-code")}>
          ← Back
        </button>

        {/* TITLE */}
        <h1 className="welcome">New Password</h1>
        <p className="desc">Enter and confirm your new password below.</p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          
          {/* Password */}
          <label>New Password</label>
          <div className="password-wrapper">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <AiFillEye size={20} />
              ) : (
                <AiFillEyeInvisible size={20} />
              )}
            </span>
          </div>

          {/* Confirm Password */}
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Re-enter password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <span
              className="password-toggle"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? (
                <AiFillEye size={20} />
              ) : (
                <AiFillEyeInvisible size={20} />
              )}
            </span>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button 
            className="signin-btn" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default NewPass;