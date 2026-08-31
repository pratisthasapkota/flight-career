import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const careerLinks = [
  { label: "Why Work With Us", path: "/careers/why-work-with-us" },
  { label: "What Can You Do", path: "/careers/what-can-you-do" },
  { label: "Student Corner", path: "/careers/student-corner" },
  { label: "Become an Employee", path: "/careers/become-an-employee" },
  { label: "Vacancies", path: "/careers/vacancies" },
  { label: "FAQ", path: "/careers/faq" },
];

const CareerNavbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <>
      <style>{`
        .career-navbar {
          background: linear-gradient(135deg, #002b5c 0%, #003f7f 100%);
          padding: 0 40px;
          font-family: 'Poppins', sans-serif;
          position: sticky;
          top: 70px;
          z-index: 999;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .career-nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .career-nav-links {
          display: flex;
          align-items: center;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .career-nav-links::-webkit-scrollbar {
          display: none;
        }

        .career-nav-link {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 16px 20px;
          white-space: nowrap;
          transition: all 0.3s ease;
          position: relative;
          border-bottom: 3px solid transparent;
        }

        .career-nav-link:hover {
          color: #ffd700;
          background: rgba(255,255,255,0.05);
        }

        .career-nav-link.active {
          color: #ffd700;
          border-bottom: 3px solid #ffd700;
          background: rgba(255,215,0,0.08);
        }

        .career-mobile-toggle {
          display: none;
          background: none;
          border: 2px solid rgba(255,255,255,0.4);
          color: white;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
        }

        .career-mobile-toggle:hover {
          border-color: #ffd700;
          color: #ffd700;
        }

        @media (max-width: 900px) {
          .career-navbar {
            padding: 0 20px;
          }

          .career-mobile-toggle {
            display: block;
          }

          .career-nav-links {
            display: ${menuOpen ? "flex" : "none"};
            flex-direction: column;
            width: 100%;
            padding-bottom: 10px;
            gap: 0;
          }

          .career-nav-links.mobile-open {
            display: flex;
          }

          .career-nav-link {
            padding: 12px 16px;
            width: 100%;
            text-align: left;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            border-left: 3px solid transparent;
          }

          .career-nav-link.active {
            border-bottom: 1px solid rgba(255,255,255,0.1);
            border-left: 3px solid #ffd700;
          }

          .career-nav-container {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="career-navbar">
        <div className="career-nav-container">
          <button
            className="career-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕ Close" : "☰ Career Menu"}
          </button>

          <div className={`career-nav-links ${menuOpen ? "mobile-open" : ""}`}>
            {careerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`career-nav-link ${isActive(link.path) ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CareerNavbar;
