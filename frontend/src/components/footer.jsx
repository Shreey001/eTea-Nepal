import React, { useState } from "react";
import logo from "../Assets/icons/logo-footer.svg";
import fb from "../Assets/icons/facebook.svg";
import insta from "../Assets/icons/instagram.svg";
import github from "../Assets/icons/github.svg";
import api from "../api/axios";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubscribe = async () => {
    if (!email) {
      alert("Please enter an email address.");
      return;
    }

    try {
      const response = await api.post("/api/subscribe", { email });
      if (response.status === 200) {
        alert("Subscription successful!");
        setEmail("");
      } else {
        alert("Failed to subscribe. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <footer>
      <div className="footer__container">
        <div className="footer__container__logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="footer__container__content">
          <div className="footer__container__content__links">
            <h3>Quick Links</h3>
            <ul>
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div className="footer__container__content__social">
            <h3>Follow Us</h3>
            <div className="footer__container__content__social__links">
              <img src={fb} alt="facebook" />
              <img src={insta} alt="instagram" />
              <img src={github} alt="github" />
            </div>
          </div>
          <div className="footer__container__content__newsletter">
            <h3>Newsletter</h3>
            <div className="footer__container__content__newsletter__input">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
              <button onClick={handleSubscribe}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2024 eTea Nepal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
