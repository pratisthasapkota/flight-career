import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getEmail, isLoggedIn, clearAuth } from "../auth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const email = getEmail();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #001a3d;
          padding: 15px 40px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          height: 70px;
          font-family: 'Poppins', sans-serif;
          animation: fadeInDown 0.5s ease forwards;
          box-shadow: 0 2px 15px rgba(0,0,0,0.2);
        }

        .logo {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo a {
          color: white;
          text-decoration: none;
          background: linear-gradient(135deg, #ffffff, #ffd700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .nav-links a, .nav-links .nav-link {
          color: white;
          text-decoration: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          padding: 8px 14px;
          border-radius: 8px;
        }

        .nav-links a:hover, .nav-links .nav-link:hover {
          color: #ffd700;
          background: rgba(255,215,0,0.08);
          transform: translateY(-1px);
        }

        .nav-links a.active-link, .nav-links .nav-link.active-link {
          color: #ffd700;
          background: rgba(255,215,0,0.1);
        }

        .nav-links a.active-link::after, .nav-links .nav-link.active-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 20%;
          width: 60%;
          height: 2px;
          background: #ffd700;
          border-radius: 2px;
          animation: scaleIn 0.3s ease forwards;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 120%;
          left: 0;
          background: white;
          min-width: 220px;
          display: none;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          border-radius: 12px;
          overflow: hidden;
          animation: fadeInUp 0.3s ease forwards;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .dropdown-menu a {
          color: #001a3d;
          padding: 14px 20px;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
          border-bottom: 1px solid #f0f0f0;
        }

        .dropdown-menu a:last-child {
          border-bottom: none;
        }

        .dropdown-menu a:hover {
          background-color: #f0f6ff;
          padding-left: 26px;
          color: #00509e;
        }

        .show {
          display: flex;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 15px 20px;
          }
          .nav-links {
            gap: 4px;
          }
          .nav-links a, .nav-links .nav-link {
            font-size: 12px;
            padding: 6px 8px;
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="logo">
          <Link to="/">AeroCareers</Link>
        </div>

        <div className="nav-links">
          <Link to="/" className={isActive("/") ? "active-link" : ""}>Home</Link>
          <Link to="/about" className={isActive("/about") ? "active-link" : ""}>About</Link>

          <div className="dropdown">
            <span
              className="nav-link"
              onClick={() => setOpen(!open)}
            >
              Explore ▾
            </span>

            <div className={`dropdown-menu ${open ? "show" : ""}`}>
              <Link to="/colleges" onClick={() => setOpen(false)}>Colleges</Link>
              <Link to="/explore" onClick={() => setOpen(false)}>Explore Careers</Link>
            </div>
          </div>

          <Link to="/careers" className={location.pathname.startsWith("/careers") ? "active-link" : ""}>Careers</Link>
          <Link to="/store" className={isActive("/store") ? "active-link" : ""}>Store</Link>
          <Link to="/contact" className={isActive("/contact") ? "active-link" : ""}>Contact</Link>
          {loggedIn ? (
            <>
              <span className="nav-link" style={{ color: "#ffd700" }}>
                {email || "Logged in"}
              </span>
              <span className="nav-link" onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </span>
            </>
          ) : (
            <Link to="/login" className={isActive("/login") ? "active-link" : ""}>Login</Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
