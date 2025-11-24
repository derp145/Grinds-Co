import React, { useState, useEffect } from "react";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function ConfirmCode({ onNavigate }) {
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const email = JSON.parse(localStorage.getItem("resetEmail")) || "";
    setUserEmail(email);
  }, []);

  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...codeDigits];
    newCode[index] = value;
    setCodeDigits(newCode);

    if (value && index < 5) {
      document.getElementById(`digit-${index + 1}`).focus();
    }
    if (!value && index > 0) {
      document.getElementById(`digit-${index - 1}`).focus();
    }
  };

  const handleConfirm = () => {
    const code = codeDigits.join("");
    if (code !== "123456") {
      setError("Invalid code");
      return;
    }
    onNavigate("newPassword");
  };

  const handleResend = () => {
    setResendMessage(`Code resent to ${userEmail}`);
    setTimeout(() => setResendMessage(""), 2000);
  };

  return (
    <div className="container">
      {/* LEFT SECTION */}
      <div className="left-section">
        <img src={logo} alt="Grinds & Co Logo" className="logo-images" />
        <h1 className="headline">
          Confirm<br />Your Code
        </h1>
        <p className="subtext">
          Enter the code sent to <strong>{userEmail}</strong>.
        </p>
        <div className="coffee-images">
          <img src={coffee} alt="CoffeeCups" />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <button className="back-btn" onClick={() => onNavigate("forgot")}>
          ← Back
        </button>

        <h1 className="welcome">Verification Code</h1>
        <p className="desc">Enter the 6-digit code sent to your email.</p>

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

        <button className="signin-btn" onClick={handleConfirm}>
          Confirm
        </button>

        <button className="resend-btn" onClick={handleResend}>
          Resend
        </button>

        {resendMessage && (
          <p style={{ color: "#b68255", marginTop: "5px", fontWeight: 500 }}>
            {resendMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default ConfirmCode;
