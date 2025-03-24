import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginPhoto from "../Assets/login.png";
import api from "../api/axios";

const SellerSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    businessAddress: "",
    password: "",
    confirmPassword: "",
    panCard: "",
    panCardDocument: null,
    mobileNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "panCardDocument") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      await api.post("/api/seller/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/verify-otp");
    } catch (error) {
      setError("Signup failed. Please check your details.");
    }
  };

  return (
    <div className="login__container">
      <div className="login__container__content">
        <div className="login__container__content__upper">
          <img src={loginPhoto} alt="login" />
        </div>
        <div className="login__container__content__lower">
          <div className="login__container__content__lower__left">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <Link to="/login" className="btn clickAnimation">
              Login
            </Link>
          </div>
          <div className="login__container__content__lower__right">
            <h1>Create Account</h1>
            <div className="login__container__content__lower__right__fields">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="businessAddress"
                placeholder="Business Address"
                value={formData.businessAddress}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="panCard"
                placeholder="PAN Card Number"
                value={formData.panCard}
                onChange={handleInputChange}
              />
              <input
                type="file"
                name="panCardDocument"
                accept="image/*"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
              />
              {error && <p className="error">{error}</p>}
              <button onClick={handleSignup} className="btn clickAnimation">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;
