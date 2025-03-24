import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const ForgotResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Reset password
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStep(2);
      alert("OTP sent to your email");
    } catch (error) {
      setError("Failed to send OTP. Please check your email.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await api.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      alert("Password reset successful!");
      navigate("/login");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="forgot-password">
      <h2>Reset Password</h2>
      {step === 1 && (
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP} className="btn clickAnimation">
            Send OTP
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword} className="btn clickAnimation">
            Reset Password
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ForgotResetPassword;
