import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";
import { supabase } from "../supabaseClient"; 

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError(""); 
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setError("Your email is not yet verified. Please check your inbox and confirm your account.");
      } else {
        setError("Invalid email or password");
      }
      return;
    }

    console.log("User logged in:", data.user.id);

    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", data.user.id)
      .single();

    console.log("Profile data:", profileData);
    console.log("Profile error:", profileError);

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      // Still allow login but with default values
    }

    // Save user info in localStorage
    localStorage.setItem("user", JSON.stringify({
      id: data.user.id,
      email: data.user.email,
      name: profileData?.full_name || "User",
      role: profileData?.role || "Staff"
    }));

    console.log("Saved to localStorage:", {
      name: profileData?.full_name || "User",
      role: profileData?.role || "Staff"
    });

    navigate("/dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

      <div className="right-section">
        <form className="login-container" onSubmit={handleSubmit}>
          <h1 className="welcome">Welcome Back</h1>
          <p className="desc">Enter your credentials to access your account.</p>

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