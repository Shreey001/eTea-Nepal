import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await api.post("/api/auth/verify", { email, otp });
      alert("OTP has been verified, now you can login");
      navigate("/login");
    } catch (error) {
      setError("Verification failed. Please check your OTP and email.");
      alert("Verification failed. Please check your OTP and email.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await api.post("/api/auth/resend-otp", { email });
      alert("OTP has been resent to your email.");
    } catch (error) {
      setError("Failed to resend OTP. Please try again later.");
      alert("Enter your email to resend OTP");
    }
  };

  return (
    <div className="verify-otp">
      <h2>Verify OTP</h2>
      <div className="form-group">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <button onClick={handleVerify} className="btn clickAnimation">
        Verify OTP
      </button>
      <button onClick={handleResendOTP} className="btn clickAnimation">
        Resend OTP
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default VerifyOTP;
