import React, { useState } from "react";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function SignIn({ onNavigate }) {
  // Dummy user
  const dummyUser = {
    email: "admin",
    password: "123",
    role: "Admin",
  };

  // State
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle sign in
  const handleSignIn = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const selectedRole = role || dummyUser.role;

    if (
      trimmedEmail === dummyUser.email.toLowerCase() &&
      trimmedPassword === dummyUser.password &&
      selectedRole === dummyUser.role
    ) {
      localStorage.setItem(
        "user",
        JSON.stringify({ email: trimmedEmail, role: selectedRole })
      );
      onNavigate("dashboard");
    } else {
      setError("Invalid email, password, or role");
    }
  };

  return (
    <div className="container">
      {/* LEFT SIDE */}
      <div className="left-section">
        <div className="top-bars">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="left-content">
          <img src={logo} alt="Grinds & Co Logo" className="logo-images" />
          <h1 className="headline">
            Manage Your<br />Inventory
          </h1>
          <p className="subtext">Brew Better Efficiently.</p>
        </div>

        <div className="coffee-images">
          <img src={coffee} alt="Coffee Cups" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-section">
        <form
          className="login-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
        >
          <div className="login-header">
            <h1 className="welcome">Welcome Back</h1>
            <p className="desc">
              Enter your credentials to access your account.
            </p>
          </div>

          <button type="button" className="google-btn">
            <img
              className="google-icon"
              src="https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-google-icon-PNG.png"
              alt="Google"
            />
            Sign in with Google
          </button>

          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">Or use email</span>
            <span className="divider-line"></span>
          </div>

          {/* User Role */}
          <div className="input-group">
            <label>User Role</label>
            <select
              className="input-select role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select user role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          {/* Options */}
          <div className="options">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot"
              onClick={() => onNavigate("forgot")}
            >
              Forgot Password?
            </button>
          </div>

          <button className="signin-btn" type="submit">
            Sign In
          </button>

          <p className="signup">
            Don't have an account?{" "}
            <a onClick={() => onNavigate("signup")}>Register Here!</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
