import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPass) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    navigate("/auth/reset-success");
  };

  return (
    <div className="container">
      {/* LEFT SIDE */}
      <div className="left-section">
        <img src={logo} className="logo-images" />
        <h1 className="headline">Create<br />New Password</h1>
        <p className="subtext">Make sure your new password is strong.</p>
        <div className="coffee-images"><img src={coffee} /></div>
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

          <button className="signin-btn" type="submit">
            Reset Password
          </button>

        </form>
      </div>
    </div>
  );
}

export default NewPass;
