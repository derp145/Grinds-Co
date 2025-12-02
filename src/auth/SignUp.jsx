import React, { useState } from "react";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";   // ✅ added

function SignUp() {
  const navigate = useNavigate();  // ✅ added

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSignUp = () => {
    if (!fullName || !email || !password || !confirmPass) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    const newUser = { fullName, email, password, role };
    localStorage.setItem("registeredUser", JSON.stringify(newUser));

    alert("Account created successfully!");
    navigate("/auth/signin");   // ✅ changed
  };

  return (
    <div className="container">
      {/* LEFT */}
      <div className="left-section">
        <img src={logo} alt="Grinds & Co Logo" className="logo-images" />

        <h1 className="headline">
          Start your journey<br />with a freshly<br />brewed cup.
        </h1>

        <p className="subtext">
          Create an account to enjoy personalized recommendations and rewards.
        </p>

        <div className="coffee-images">
          <img src={coffee} alt="CoffeeCups" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-section">

        {/* ✅ FIXED BACK BUTTON */}
        <button className="back-btn" onClick={() => navigate("/auth/signin")}>
          ← Back to Sign In
        </button>

        <h1 className="welcome">Create Account</h1>
        <p className="desc">Fill in your information below.</p>

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="password-toggle"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <IoEyeOff /> : <IoEye />}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
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
            {showConfirmPass ? <IoEyeOff /> : <IoEye />}
          </span>
        </div>

        <label>User Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled hidden>
            Select user role
          </option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="signin-btn" onClick={handleSignUp}>
          Create Account
        </button>

        {/* ✅ FIXED SIGN IN LINK */}
        <p className="signup">
          Already registered?{" "}
          <a style={{ cursor: "pointer" }} onClick={() => navigate("/auth/signin")}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
