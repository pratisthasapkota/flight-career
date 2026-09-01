import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getEmail, isLoggedIn, clearAuth } from "../auth";
import { FiMenu, FiX } from "react-icons/fi";
import { FaPlane } from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loggedIn: boolean = isLoggedIn();
  const email: string | null = getEmail();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
  }, [location]);

  const isActive = (path: string): boolean => location.pathname === path;

  const handleLogout = (): void => {
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
          padding: 0 48px;
          height: 72px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: var(--font-sans);
          transition: all var(--transition-base);
          background: transparent;
        }

        .navbar.scrolled {
          background: rgba(0, 26, 61, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 24px rgba(0, 0, 0, 0.2);
        }

        .navbar:not(.scrolled) {
          background: rgba(0, 26, 61, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .logo:hover {
          transform: scale(1.03);
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--color-gold-500), var(--color-gold-400));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-navy-800);
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
        }

        .logo a {
          color: white;
          text-decoration: none;
          background: linear-gradient(135deg, #ffffff, #e0e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-links {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .nav-links a, .nav-links .nav-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all var(--transition-fast);
          position: relative;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          letter-spacing: 0.01em;
        }

        .nav-links a:hover, .nav-links .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.08);
        }

        .nav-links a.active-link, .nav-links .nav-link.active-link {
          color: var(--color-gold-500);
          background: rgba(255, 215, 0, 0.08);
        }

        .nav-links a.active-link::after, .nav-links .nav-link.active-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 25%;
          width: 50%;
          height: 2px;
          background: var(--color-gold-500);
          border-radius: 2px;
          animation: scaleIn 0.3s ease forwards;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-arrow {
          display: inline-block;
          margin-left: 4px;
          font-size: 10px;
          transition: transform var(--transition-fast);
        }

        .dropdown.open .dropdown-arrow {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          min-width: 220px;
          display: none;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.04);
          border-radius: var(--radius-md);
          overflow: hidden;
          animation: fadeInUp 0.25s ease forwards;
          padding: 6px;
        }

        .dropdown-menu::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 2px;
          transform: translateX(-50%) rotate(45deg);
          box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.04);
        }

        .dropdown-menu a {
          color: var(--color-text-primary);
          padding: 10px 16px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all var(--transition-fast);
          border-radius: var(--radius-sm);
        }

        .dropdown-menu a:hover {
          background: var(--color-navy-100);
          color: var(--color-navy-500);
          padding-left: 20px;
        }

        .show {
          display: flex;
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 8px;
          padding-left: 16px;
          border-left: 1px solid rgba(255, 255, 255, 0.15);
        }

        .nav-email {
          color: var(--color-gold-500) !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-logout {
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 13px !important;
          padding: 6px 12px !important;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-sm) !important;
          transition: all var(--transition-fast) !important;
        }

        .nav-logout:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.3);
          color: white !important;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: background var(--transition-fast);
        }

        .mobile-toggle:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        @media (max-width: 900px) {
          .navbar {
            padding: 0 20px;
          }

          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .nav-links {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            background: rgba(0, 26, 61, 0.97);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 20px;
            gap: 4px;
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: all var(--transition-base);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          .nav-links.mobile-open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }

          .nav-links a, .nav-links .nav-link {
            padding: 12px 16px;
            font-size: 15px;
            width: 100%;
            border-radius: var(--radius-sm);
          }

          .nav-links a.active-link, .nav-links .nav-link.active-link {
            background: rgba(255, 215, 0, 0.1);
          }

          .dropdown-menu {
            position: static;
            transform: none;
            background: rgba(255, 255, 255, 0.05);
            box-shadow: none;
            border-radius: var(--radius-sm);
            margin-top: 4px;
            padding: 4px;
            min-width: auto;
          }

          .dropdown-menu::before {
            display: none;
          }

          .dropdown-menu a {
            color: rgba(255, 255, 255, 0.8);
            padding: 10px 16px;
          }

          .dropdown-menu a:hover {
            background: rgba(255, 255, 255, 0.08);
            color: white;
            padding-left: 16px;
          }

          .nav-auth {
            border-left: none;
            padding-left: 0;
            margin-left: 0;
            margin-top: 8px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            width: 100%;
          }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="logo">
          <div className="logo-icon">
            <FaPlane />
          </div>
          <Link to="/">AeroCareers</Link>
        </div>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-links ${mobileOpen ? "mobile-open" : ""}`}>
          <Link to="/" className={isActive("/") ? "active-link" : ""}>Home</Link>
          <Link to="/about" className={isActive("/about") ? "active-link" : ""}>About</Link>

          <div className={`dropdown ${open ? "open" : ""}`}>
            <span className="nav-link" onClick={() => setOpen(!open)}>
              Explore <span className="dropdown-arrow">▾</span>
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
            <div className="nav-auth">
              <span className="nav-link nav-email">{email || "Logged in"}</span>
              <span className="nav-link nav-logout" onClick={handleLogout}>Logout</span>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className={isActive("/login") ? "active-link" : ""}>Login</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
