import React, { useState } from "react";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";   
import { supabase } from "../supabaseClient"; 

function SignUp() {
  const navigate = useNavigate();  

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSignUp = async () => {
  setError("");
  setMessage("");

  if (password !== confirmPass) {
    setError("Passwords do not match.");
    return;
  }

  if (!role) {
    setError("Please select a user role.");
    return;
  }

  if (!fullName.trim()) {
    setError("Please enter your full name.");
    return;
  }

  const trimmedEmail = email.trim();

  try {
    // 1️⃣ Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    if (authError) {
      console.error("Auth error:", authError);
      setError(authError.message);
      return;
    }

    console.log("User signed up:", authData.user.id);

    // 2️⃣ Create profile using RPC function
    const { data: profileData, error: profileError } = await supabase
      .rpc('create_profile', {
        user_id: authData.user.id,
        user_full_name: fullName.trim(),
        user_role: role,
        user_email: trimmedEmail,  // ← ADDED THIS
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      setError(`Profile creation failed: ${profileError.message}`);
      return;
    }

    console.log("Profile created successfully");

    // 3️⃣ Display success message
    setMessage(
      "🎉 Account created successfully! Please check your email to verify your account before logging in."
    );

    // Navigate to sign-in after delay
    setTimeout(() => navigate("/auth/signin"), 2500);
  } catch (err) {
    console.error("Signup error:", err);
    setError(err.message || "An error occurred during signup");
  }
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
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="" disabled hidden>
            Select user role
          </option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
        </select>

        {/* Display messages */}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}

        <button className="signin-btn" onClick={handleSignUp}>
          Create Account
        </button>

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