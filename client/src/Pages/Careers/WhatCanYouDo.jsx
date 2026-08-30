import React from "react";
import { useNavigate } from "react-router-dom";

const WhatCanYouDo = () => {
  const navigate = useNavigate();

  const roles = [
    { icon: "🧑‍✈️", title: "Pilot", desc: "Command the skies as a commercial or private pilot. Train for your PPL, CPL, and ATPL certifications.", link: "/pilots" },
    { icon: "💁", title: "Cabin Crew", desc: "Deliver exceptional in-flight experiences as a flight attendant or cabin crew manager.", link: "/hostess" },
    { icon: "🔧", title: "Aircraft Maintenance Engineer", desc: "Keep aircraft safe and airworthy with hands-on technical expertise.", link: "/craft" },
    { icon: "📋", title: "Flight Operations", desc: "Manage flight schedules, safety protocols, and ground operations.", link: "/operation" },
    { icon: "🎓", title: "Aviation Trainer", desc: "Train the next generation of aviation professionals with specialized programs.", link: "/training" },
    { icon: "🏢", title: "Airport Management", desc: "Oversee airport operations, logistics, and passenger services.", link: "/operation" },
  ];

  return (
    <>
      <style>{`
        .roles-page {
          font-family: 'Poppins', sans-serif;
        }

        .roles-hero {
          background: linear-gradient(135deg, #001a3d, #00509e);
          color: white;
          text-align: center;
          padding: 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .roles-hero::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at 70% 30%, rgba(255,215,0,0.06) 0%, transparent 50%);
          animation: heroGlow 8s ease-in-out infinite;
        }

        .roles-hero h1 {
          position: relative;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 10px;
          animation: fadeInUp 0.6s ease forwards;
        }

        .roles-hero p {
          position: relative;
          font-size: 1.1rem;
          opacity: 0;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 0.6s ease 0.2s forwards;
        }

        .roles-grid {
          max-width: 1100px;
          margin: 60px auto;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
        }

        .role-card {
          background: white;
          border-radius: 14px;
          padding: 35px 30px;
          box-shadow: 0 4px 18px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          border-left: 4px solid #00509e;
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }

        .role-card:nth-child(1) { animation-delay: 0.1s; }
        .role-card:nth-child(2) { animation-delay: 0.2s; }
        .role-card:nth-child(3) { animation-delay: 0.3s; }
        .role-card:nth-child(4) { animation-delay: 0.4s; }
        .role-card:nth-child(5) { animation-delay: 0.5s; }
        .role-card:nth-child(6) { animation-delay: 0.6s; }

        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
          border-left-color: #ffd700;
        }

        .role-card .role-icon {
          font-size: 2.2rem;
          margin-bottom: 15px;
          transition: transform 0.3s ease;
        }

        .role-card:hover .role-icon {
          transform: scale(1.2) rotate(-5deg);
        }

        .role-card h3 {
          font-size: 1.2rem;
          color: #001a3d;
          margin-bottom: 10px;
        }

        .role-card p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin-bottom: 15px;
        }

        .role-card .role-link {
          color: #00509e;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .role-card:hover .role-link {
          color: #ffd700;
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .roles-hero h1 { font-size: 1.8rem; }
          .roles-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="roles-page">
        <div className="roles-hero">
          <h1>What Can You Do?</h1>
          <p>Explore the exciting range of career paths available in the aviation industry.</p>
        </div>

        <div className="roles-grid">
          {roles.map((role, index) => (
            <div
              className="role-card"
              key={index}
              onClick={() => navigate(role.link)}
            >
              <div className="role-icon">{role.icon}</div>
              <h3>{role.title}</h3>
              <p>{role.desc}</p>
              <span className="role-link">Learn More →</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WhatCanYouDo;
