import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function SignIn() {
  const navigate = useNavigate();

  const dummyUser = {
    email: "admin",
    password: "123",
    role: "Admin",
  };

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

      navigate("/dashboard");

    } else {
      setError("Invalid email, password, or role");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevents page refresh
    handleSignIn();
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src={logo} className="logo-images" alt="Logo" />
        <h1 className="headline">
          Manage Your <br /> Inventory
        </h1>
        <p className="subtext">Brew Better Efficiently.</p>

        <div className="coffee-images">
          <img src={coffee} alt="Coffee Cups" />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <form className="login-container" onSubmit={handleSubmit}>
          <h1 className="welcome">Welcome Back</h1>
          <p className="desc">Enter your credentials to access your account.</p>

          <div className="input-group">
            <label>User Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
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

          {/* ENTER NOW WORKS */}
          <button className="signin-btn" type="submit">
            Sign In
          </button>

          <p
            className="forgot"
            onClick={() => navigate("/auth/forgot")}
            style={{ cursor: "pointer" }}
          >
            Forgot Password?
          </p>

          <p className="signup">
            Don't have an account?{" "}
            <a onClick={() => navigate("/auth/signup")}>Register Here!</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
