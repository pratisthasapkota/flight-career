import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn, FaPaperPlane, FaPlane } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [newsletterStatus, setNewsletterStatus] = useState<string>("");

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterStatus("Please enter a valid email address.");
      return;
    }
    try {
      const backendUrl: string = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      await axios.post(`${backendUrl}/api/notify`, { email: newsletterEmail });
      setNewsletterStatus("Subscribed! Thank you for joining.");
      setNewsletterEmail("");
    } catch (err) {
      setNewsletterStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="footer">
      <style>{`
        .footer {
          background: linear-gradient(180deg, #000d1f 0%, #001229 100%);
          color: #c8d6e5;
          padding: 0;
          font-family: var(--font-sans);
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent);
        }

        .footer-top {
          padding: 80px 80px 50px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
          gap: 50px;
          margin-bottom: 50px;
        }

        .footer-brand p {
          font-size: 14px;
          line-height: 1.8;
          color: #8899aa;
          max-width: 300px;
          margin-top: 16px;
        }

        .footer h3 {
          color: white;
          font-size: 15px;
          margin-bottom: 20px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          position: relative;
          padding-bottom: 12px;
        }

        .footer h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: var(--color-gold-500);
          border-radius: 2px;
        }

        .footer ul {
          list-style: none;
          padding: 0;
        }

        .footer ul li {
          margin-bottom: 10px;
        }

        .footer ul li a {
          color: #8899aa;
          text-decoration: none;
          transition: all var(--transition-fast);
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .footer ul li a:hover {
          color: var(--color-gold-500);
          transform: translateX(4px);
        }

        .social-icons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .social-icons a {
          color: #8899aa;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
        }

        .social-icons a:hover {
          background: var(--color-gold-500);
          color: var(--color-navy-800);
          border-color: var(--color-gold-500);
          transform: translateY(-3px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
          font-size: 14px;
          color: #8899aa;
          line-height: 1.5;
        }

        .footer-contact-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          background: rgba(255, 215, 0, 0.08);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          margin-top: 2px;
        }

        .subscribe {
          margin-top: 0;
        }

        .subscribe p {
          color: #8899aa;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 16px;
        }

        .subscribe-form {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          overflow: hidden;
          width: 100%;
          transition: border-color var(--transition-fast);
        }

        .subscribe-form:focus-within {
          border-color: rgba(255, 215, 0, 0.4);
        }

        .subscribe-form input {
          flex: 1;
          border: none;
          outline: none;
          padding: 12px 16px;
          font-size: 14px;
          background: transparent;
          color: white;
          font-family: var(--font-sans);
        }

        .subscribe-form input::placeholder {
          color: #5a6a7a;
        }

        .subscribe-form button {
          background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-400));
          border: none;
          color: var(--color-navy-800);
          padding: 12px 18px;
          cursor: pointer;
          transition: all var(--transition-base);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .subscribe-form button:hover {
          background: var(--color-gold-300);
          transform: scale(1.05);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 24px 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: #5a6a7a;
        }

        .footer-bottom-links {
          display: flex;
          gap: 24px;
        }

        .footer-bottom-links a {
          color: #5a6a7a;
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer-bottom-links a:hover {
          color: var(--color-gold-500);
        }

        @media (max-width: 768px) {
          .footer-top {
            padding: 50px 24px 30px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 36px;
          }

          .footer h3::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .footer-brand p {
            max-width: 100%;
          }

          .social-icons {
            justify-content: center;
          }

          .footer-contact-item {
            justify-content: center;
          }

          .subscribe-form {
            max-width: 400px;
            margin: 0 auto;
          }

          .footer-bottom {
            padding: 20px 24px;
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }
        }
      `}</style>

      <div className="footer-top">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #ffd700, #ffcc00)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#001a3d",
                fontSize: "16px",
              }}>
                <FaPlane />
              </div>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "white" }}>AeroCareers</span>
            </div>
            <p>
              Delivering career-focused, innovative aviation training programs
              designed to empower future cabin crew and aviation professionals worldwide.
            </p>
            <h3 style={{ marginTop: "24px" }}>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/explore">Explore Careers</a></li>
              <li><a href="/colleges">Colleges</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/store">Store</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📍</span>
              <span>AeroCareers Academy<br/>Kathmandu, Nepal</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📞</span>
              <span>+977 9744341824</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">✉️</span>
              <span>info@cabincrew.edu.np</span>
            </div>
          </div>

          <div className="subscribe">
            <h3>Newsletter</h3>
            <p>
              Stay updated with the latest aviation news, career opportunities, and exclusive offers.
            </p>
            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" style={{ position: "absolute", left: "-9999px" }}>
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe to newsletter"><FaPaperPlane /></button>
            </form>
            {newsletterStatus && (
              <p style={{
                marginTop: "12px",
                fontSize: "13px",
                color: newsletterStatus.includes("valid") || newsletterStatus.includes("wrong") ? "#ff6b6b" : "#51cf66"
              }}>
                {newsletterStatus}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AeroCareers. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="/about">Privacy Policy</a>
          <a href="/about">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
