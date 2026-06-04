import React, { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
        }

        .logo {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
        }

        .nav-links {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          cursor: pointer;
          font-size: 15px;
        }

        .nav-links a:hover {
          color: #ffd700;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 120%;
          left: 0;
          background: white;
          min-width: 200px;
          display: none;
          flex-direction: column;
          box-shadow: 0 6px 15px rgba(0,0,0,0.2);
          border-radius: 8px;
          overflow: hidden;
          animation: fade 0.2s ease-in;
        }

        .dropdown-menu a {
          color: #001a3d;
          padding: 12px 18px;
          text-decoration: none;
          font-size: 14px;
        }

        .dropdown-menu a:hover {
          background-color: #f0f0f0;
        }

        .show {
          display: flex;
        }

        @keyframes fade {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <nav className="navbar">
        <div className="logo">AeroCareers</div>

        <div className="nav-links">
          <a href="/">Home</a>

          <div className="dropdown">
            <a onClick={() => setOpen(!open)}>Explore ▾</a>

            <div className={`dropdown-menu ${open ? "show" : ""}`}>
              <a href="/colleges">Colleges</a>
              <a href="/student">Student Resources</a>
              
            </div>
          </div>

          <a href="/store">Store</a>
          <a href="/contact">Contact</a>
          <a href="/login">Login</a>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
