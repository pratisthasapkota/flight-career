import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn, FaPaperPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <style>{`
        .footer {
          background: #0b0c10;
          color: #dcdcdc;
          padding: 60px 80px 20px;
          font-family: 'Poppins', sans-serif;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 50px;
          margin-bottom: 40px;
        }

        .footer-logo img {
          width: 180px;
          margin-bottom: 15px;
        }

        .footer-logo p {
          font-size: 14px;
          line-height: 1.6;
          color: #bfbfbf;
          max-width: 300px;
        }

        .footer h3 {
          color: white;
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .footer ul {
          list-style: none;
          padding: 0;
          line-height: 2;
        }

        .footer ul li a {
          color: #bfbfbf;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer ul li a:hover {
          color: #ffcc00;
        }

        .social-icons {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .social-icons a {
          color: white;
          background: #222;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .social-icons a:hover {
          background: #ffcc00;
          color: #001f3f;
        }

        .subscribe {
          margin-top: 10px;
        }

        .subscribe p {
          color: #bfbfbf;
          font-size: 14px;
          line-height: 1.6;
        }

        .subscribe-form {
          display: flex;
          align-items: center;
          margin-top: 15px;
          background: white;
          border-radius: 30px;
          overflow: hidden;
          width: 100%;
          max-width: 280px;
        }

        .subscribe-form input {
          flex: 1;
          border: none;
          outline: none;
          padding: 10px 15px;
          font-size: 14px;
          border-radius: 30px 0 0 30px;
        }

        .subscribe-form button {
          background: #003366;
          border: none;
          color: white;
          padding: 10px 15px;
          border-radius: 0 30px 30px 0;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .subscribe-form button:hover {
          background: #ffcc00;
          color: #001f3f;
        }

        .footer-bottom {
          text-align: center;
          border-top: 1px solid #333;
          padding-top: 20px;
          font-size: 13px;
          color: #aaa;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 40px 25px 20px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .social-icons {
            justify-content: center;
          }

          .subscribe-form {
            margin: 0 auto;
          }
        }
      `}</style>

      <div className="footer-content">
       
        <div className="footer-logo">
          
          <p>
            Delivering career-focused, innovative aviation training programs
            designed to empower future cabin crew and aviation professionals worldwide.
          </p>
          <h3>Follow us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          </div>
        </div>

        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/colleges">Colleges</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>CabinCrew Aviation Ltd.</p>
          <p> Kathmandu, Nepal</p>
          <p>📞 +977 9744341824</p>
          <p>📧 info@cabincrew.edu.np</p>
        </div>

        
        <div className="subscribe">
          <h3>Subscribe</h3>
          <p>
            Don’t miss out! Join our newsletter for the latest aviation news,
            events, and offers.
          </p>
          <div className="subscribe-form">
            <input type="email" placeholder="Email Address" />
            <button><FaPaperPlane /></button>
          </div>
        </div>
      </div>

      
      <div className="footer-bottom">
        <p>© 2025 CabinCrew Academy | Designed by me</p>
      </div>
    </footer>
  );
};

export default Footer;
