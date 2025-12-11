import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function ConfirmCode() {
  const navigate = useNavigate();

  // Changed to 8 digits instead of 6
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const email = JSON.parse(localStorage.getItem("resetEmail")) || "";
    setUserEmail(email);
    
    if (!email) {
      // If no email found, redirect back to forgot password
      navigate("/auth/forgot");
    }
  }, [navigate]);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...codeDigits];
    newCode[index] = value;
    setCodeDigits(newCode);

    // Auto-focus next/previous input
    if (value && index < 7) {
      document.getElementById(`digit-${index + 1}`)?.focus();
    }
    if (!value && index > 0) {
      document.getElementById(`digit-${index - 1}`)?.focus();
    }
  };

  const handleConfirm = async () => {
    setError("");
    const code = codeDigits.join("");

    if (code.length < 6) {
      setError("Please enter the complete verification code");
      return;
    }

    // Verify OTP with Supabase
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: userEmail,
      token: code,
      type: 'email',
    });

    if (verifyError) {
      setError("Invalid or expired code. Please try again.");
      return;
    }

    // Store a flag to indicate OTP was verified successfully
    localStorage.setItem("otpVerified", "true");

    // OTP verified successfully, navigate to new password page
    navigate("/auth/new-password");
  };

  const handleResend = async () => {
    setResendMessage("");
    setError("");

    // Resend OTP
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) {
      setError("Failed to resend code. Please try again.");
      return;
    }

    setResendMessage(`Code resent to ${userEmail}`);
    setTimeout(() => setResendMessage(""), 3000);
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src={logo} className="logo-images" alt="Logo" />
        <h1 className="headline">Confirm<br />Your Code</h1>
        <p className="subtext">Enter the code sent to <strong>{userEmail}</strong>.</p>
        <div className="coffee-images"><img src={coffee} alt="Coffee" /></div>
      </div>

      <div className="right-section">
        <button className="back-btn" onClick={() => navigate("/auth/forgot")}>
          ← Back
        </button>

        <h1 className="welcome">Verification Code</h1>
        <p className="desc">Enter the 8-digit code sent to your email.</p>

        <label>Confirmation Code</label>
        <div className="code-inputs">
          {codeDigits.map((digit, idx) => (
            <input
              key={idx}
              id={`digit-${idx}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
          ))}
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="signin-btn" onClick={handleConfirm}>Confirm</button>
        <button className="resend-btn" onClick={handleResend}>Resend</button>

        {resendMessage && (
          <p style={{ color: "#b68255", fontWeight: 500 }}>{resendMessage}</p>
        )}
      </div>
    </div>
  );
}

export default ConfirmCode;