import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import coffee from "../assets/CoffeeCups.png";
import logo from "../assets/LoginLogo.png";

function ResetSuccess() {
  const navigate = useNavigate();

  const goToSignIn = () => {
    navigate("/auth/signin");
  };

  return (
    <div className="container">

      {/* LEFT SECTION */}
      <div className="left-section">
        <img src={logo} alt="Logo" className="logo-images" />
        <h1 className="headline">
          Password<br />Reset Successful
        </h1>
        <p className="subtext">
          Everything is all set. You may now sign in safely.
        </p>
        <div className="coffee-images">
          <img src={coffee} alt="Coffee" />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        
        {/* Success Icon with Animation */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
          animation: 'successPulse 0.6s ease-out'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 className="welcome" style={{ marginBottom: '12px' }}>Password Reset Complete!</h1>
        <p className="desc" style={{ 
          fontSize: '16px', 
          color: '#666',
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          Your password has been successfully updated.<br />
          You can now sign in with your new credentials.
        </p>

        <button
          type="button"
          className="signin-btn"
          onClick={goToSignIn}
          style={{
            marginTop: '20px'
          }}
        >
          Back to Sign In
        </button>

        {/* Add this CSS animation inline or in your Auth.css */}
        <style>{`
          @keyframes successPulse {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ResetSuccess;